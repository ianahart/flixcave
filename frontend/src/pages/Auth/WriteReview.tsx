import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Jumbotron from '../../components/Mixed/Jumbotron';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import writeReviewStyles from '../../styles/review/WriteReview.module.scss';

interface ILocationState {
  name: string;
  id: number;
  backdropPath: string;
}

const WriteReview = () => {
  const location = useLocation();
  const locationState = location.state as ILocationState;

  useEffectOnce(() => {
    console.log(locationState.name);
  });

  return (
    <div>
      <Jumbotron />
      <div className={writeReviewStyles.container}>
        <header className={writeReviewStyles.header}>
          <h1>Review for {locationState.name}</h1>
        </header>
        <div className={writeReviewStyles.title}>
          <img
            src={`https://image.tmdb.org/t/p/w500${locationState.backdropPath}`}
            alt={locationState.name}
          />
          <h3>{locationState.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;
