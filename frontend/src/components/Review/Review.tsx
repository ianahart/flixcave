import { AiFillStar } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { useState } from 'react';
import { IReview } from '../../interfaces';
import reviewStyles from '../../styles/review/Review.module.scss';
import WriteComment from '../Comment/WriteComment';

interface IReviewProps {
  review: IReview;
}

const Review = ({ review }: IReviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stars, setStars] = useState<number[]>([1, 2, 3, 4, 5]);

  const handleIsOpen = (isOpen: boolean) => setIsOpen(isOpen);

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
      <WriteComment isOpen={isOpen} handleIsOpen={handleIsOpen} review={review} />
    </div>
  );
};

export default Review;
