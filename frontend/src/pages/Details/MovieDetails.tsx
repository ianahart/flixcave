import { AxiosError } from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { IMovieDetails, IMovieDetailsResponse } from '../../interfaces';
import { movieDetailsState } from '../../data/initialState';
import movieDetailsStyles from '../../styles/details/MovieDetails.module.scss';
import ProgressCircle from '../../components/Details/ProgressCircle';
import Actions from '../../components/Details/Actions';

const MovieDetails = () => {
  const params = useParams();
  const [details, setDetails] = useState<IMovieDetails>(movieDetailsState);
  const fetchMovieDetails = async () => {
    try {
      const response = await http.get<IMovieDetailsResponse>(
        `/movies/tmdb/details/${params.id}/`
      );

      setDetails(response.data.movie_details);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchMovieDetails();
  });

  return (
    <div className={movieDetailsStyles.container}>
      <div
        style={{
          backgroundImage: `linear-gradient(
    to right,
    rgba(33, 158, 188, 1) 150px,
    rgba(33, 158, 188, 0.75) 100%
  )
,    url(
            https://image.tmdb.org/t/p/original${details.backdrop_path}
          )`,
        }}
        className={movieDetailsStyles.backdrop}
      >
        <div className={movieDetailsStyles.row}>
          <div className={movieDetailsStyles.poster}>
            <img
              src={` https://image.tmdb.org/t/p/original${details.poster_path}`}
              alt={details.original_title}
            />
          </div>

          <div className={movieDetailsStyles.content}>
            <div className={movieDetailsStyles.header}>
              <h2>
                {details.original_title} <span>({details.date})</span>
              </h2>
              <p>"{details.tagline}"</p>
            </div>
            <div className={movieDetailsStyles.genres}>
              {details?.genres.map(({ id, name }) => {
                return <p key={id}>{name}</p>;
              })}
              <p className={movieDetailsStyles.runtime}>&#x25CF; {details.runtime}min</p>
            </div>

            <div className={movieDetailsStyles.actions}>
              <ProgressCircle
                value={details.vote_percent}
                text={`${details.vote_percent}%`}
              />
              <Actions
                type="movies"
                id={details.id}
                name={details.original_title}
                backdropPath={details.poster_path}
              />
            </div>

            <div className={movieDetailsStyles.overview}>{details.overview}</div>
          </div>
        </div>
      </div>

      {details.revenue && (
        <div className={movieDetailsStyles.revenue}>
          <p>Revenue</p>
          <p>{details.revenue}</p>
        </div>
      )}
      <p className={movieDetailsStyles.productionCompaniesTitle}>Production Companies</p>
      <div className={movieDetailsStyles.productionCompanies}>
        {details?.production_companies.map(({ logo_path, name, id }) => {
          return (
            <div key={id} className={movieDetailsStyles.productionCompany}>
              <img src={`https://image.tmdb.org/t/p/original${logo_path}`} alt={name} />
              <p>{name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MovieDetails;
