import { AxiosError } from 'axios';
import { useState } from 'react';
import { http } from '../helpers/utils';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import { IReview, IReviewsResponse } from '../interfaces';
import reviewsStyles from '../styles/review/Reviews.module.scss';
import Review from '../components/Review/Review';

const Reviews = () => {
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [reviews, setReviews] = useState<IReview[]>([]);

  const fetchReviews = async (endpoint: string) => {
    try {
      const response = await http.get<IReviewsResponse>(endpoint);
      setPage(response.data.page);
      setReviews(response.data.reviews);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchReviews('/reviews/list/?page=0&direction=next');
  });

  return (
    <div className={reviewsStyles.container}>
      <div className={reviewsStyles.header}>
        <h1>Reviews</h1>
      </div>
      <div className={reviewsStyles.reviews}>
        {reviews.map((review) => {
          return <Review key={review.id} review={review} />;
        })}
      </div>
      <div className={reviewsStyles.btnContainer}>
        {page > 1 && (
          <button
            onClick={() => fetchReviews(`/reviews/list/?page=${page}&direction=prev`)}
          >
            Prev
          </button>
        )}
        <p>{page}</p>
        {hasNext && (
          <button
            onClick={() => fetchReviews(`/reviews/list/?page=${page}&direction=next`)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Reviews;
