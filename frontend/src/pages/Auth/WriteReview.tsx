import { useLocation, useNavigate } from 'react-router-dom';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import Jumbotron from '../../components/Mixed/Jumbotron';
import Header from '../../components/Review/Header';
import writeReviewStyles from '../../styles/review/WriteReview.module.scss';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';
import { useAppSelector } from '../../app/hooks';
import { nanoid } from 'nanoid';

interface ILocationState {
  name: string;
  id: number;
  backdropPath: string;
}

const WriteReview = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.value);
  const location = useLocation();
  const locationState = location.state as ILocationState;
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [stars, setStars] = useState([1, 2, 3, 4, 5]);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');

  const addStar = (index: number) => {
    setRating(index);
  };

  const removeStar = (index: number) => {
    if (index === 1) {
      setRating(0);
      return;
    }
    setRating(index);
  };

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const validateBody = () => {
    if (body.trim().length > 400) {
      const error = 'Please keep the review under 400 characters.';
      setValidationErrors((prevState) => [...prevState, error]);
      return false;
    }
    return true;
  };

  const submitReview = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      setValidationErrors([]);
      if (!validateBody()) {
        return;
      }
      await http.post('/reviews/', {
        backdrop_path: `https://image.tmdb.org/t/p/w500${locationState.backdropPath}`,
        resource_id: locationState.id,
        name: locationState.name,
        body,
        rating,
        user: user.id,
      });
      navigate('/');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        if (err.response.status === 409) {
          const error = err.response.data.error;
          setValidationErrors((prevState) => [...prevState, error]);
        }
        if (err.response.status === 400) {
          applyValidationErrors(err.response.data);
        }
      }
    }
  };

  const applyValidationErrors = <T,>(errors: T) => {
    console.log(Object.values(errors));
    Object.values(errors).forEach((error) => {
      const [err] = error;
      console.log(err);
      setValidationErrors((prevState) => [...prevState, err]);
    });
  };

  return (
    <div>
      <Jumbotron />
      <div className={writeReviewStyles.container}>
        <Header
          name={locationState.name}
          backdropPath={locationState.backdropPath}
          id={locationState.id}
        />
        <div className={writeReviewStyles.starTitle}>
          <h3>Your rating:</h3>
          {rating > 0 && (
            <div className={writeReviewStyles.starRow}>
              <p>{rating}</p>
              <AiFillStar />
            </div>
          )}
        </div>
        <div className={writeReviewStyles.stars}>
          {stars.map((_, index) => {
            index += 1;
            return (
              <div
                onMouseEnter={() => addStar(index)}
                onMouseLeave={() => removeStar(index)}
                style={{ color: rating >= index ? 'orange' : 'black' }}
                className={writeReviewStyles.star}
                key={index}
              >
                <AiFillStar />
              </div>
            );
          })}
        </div>
        <div className={writeReviewStyles.errors}>
          {validationErrors.map((error) => {
            return <p key={nanoid()}>{error}</p>;
          })}
        </div>
        <div className={writeReviewStyles.body}>
          <textarea
            placeholder="Write Review"
            onChange={handleOnChange}
            value={body}
          ></textarea>
        </div>
        <div className={writeReviewStyles.btnContainer}>
          <button onClick={submitReview}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;
