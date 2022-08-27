import { AiFillStar } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { IComment, ICommentsResponse, IReview } from '../../interfaces';
import reviewStyles from '../../styles/review/Review.module.scss';
import WriteComment from '../Comment/WriteComment';
import { retreiveTokens } from '../../helpers/utils';
import { AxiosError } from 'axios';
import { useAppSelector } from '../../app/hooks';
import { http } from '../../helpers/utils';
import Comment from '../Comment/Comment';

interface IReviewProps {
  review: IReview;
}

const Review = ({ review }: IReviewProps) => {
  const user = useAppSelector((state) => state.user.value);
  const [isOpen, setIsOpen] = useState(false);
  const [stars, setStars] = useState<number[]>([1, 2, 3, 4, 5]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(1);

  const socketUrl = `ws://127.0.0.1:8000/ws/notification/${user.id}/?token=${
    retreiveTokens()?.access_token
  }`;

  const {} = useWebSocket(socketUrl, {
    share: true,
    onMessage: (event: WebSocketEventMap['message']) => {
      const data = JSON.parse(event.data);
      if (Object.keys(data).includes('comment')) {
        setComments([]);
        setPage(1);
        setHasNext(false);
        fetchComments(`/comments/?page=0&review=${review.id}`);
      }
    },
  });

  const handleIsOpen = (isOpen: boolean) => setIsOpen(isOpen);

  const fetchComments = async (endpoint: string) => {
    try {
      const response = await http.get<ICommentsResponse>(endpoint);
      setComments((prevState) => [...prevState, ...response.data.comments]);
      setHasNext(response.data.has_next);
      setPage(response.data.page);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const removeComment = (id: number) => {
    const filtered = comments.filter((comment) => comment.id !== id);
    setComments(filtered);
  };

  return (
    <div className={reviewStyles.container}>
      <div className={reviewStyles.header}>
        <div className={reviewStyles.initials}>{review.user.initials}</div>
        <div className={reviewStyles.name}>
          <p>
            {review.user.first_name} {review.user.last_name}
          </p>
        </div>
        <div className={reviewStyles.resourceTitle}>
          <h3>{review.name}</h3>
        </div>
        <div className={reviewStyles.resource}>
          <img src={review.backdrop_path} alt={review.name} />
        </div>
        <div className={reviewStyles.stars}>
          {stars.map((_, index) => {
            return (
              <AiFillStar
                key={index}
                color={review.rating > index ? 'orange' : 'black'}
              />
            );
          })}
        </div>
        <div className={reviewStyles.body}>
          <p>{review.body}</p>
        </div>
      </div>

      <div onClick={() => handleIsOpen(true)} className={reviewStyles.commentTrigger}>
        <BiCommentDetail />
        <p>Comment</p>
      </div>
      <div className={reviewStyles.totalComments}>
        <p>{review.total_comments} Comments</p>
      </div>
      {comments.length <= 0 && (
        <div
          onClick={() => fetchComments(`/comments/?page=0&review=${review.id}`)}
          className={reviewStyles.commentsTrigger}
        >
          <p>View Comments...</p>
        </div>
      )}
      <div className={reviewStyles.comments}>
        {comments.map((comment) => {
          return (
            <Comment
              removeComment={removeComment}
              reviewUserId={review.user.id}
              key={comment.id}
              comment={comment}
            />
          );
        })}
        {hasNext && (
          <div className={reviewStyles.loadMore}>
            <button
              onClick={() => fetchComments(`/comments/?page=${page}&review=${review.id}`)}
            >
              More comments...
            </button>
          </div>
        )}
      </div>
      <WriteComment isOpen={isOpen} handleIsOpen={handleIsOpen} review={review} />
    </div>
  );
};

export default Review;
