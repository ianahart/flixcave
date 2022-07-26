import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { useState } from 'react';
import { tvDetailsState } from '../../data/initialState';
import ProgressCircle from '../../components/Details/ProgressCircle';
import tvDetailsStyles from '../../styles/details/TvDetails.module.scss';
import Actions from '../../components/Details/Actions';

const TvDetails = () => {
  const params = useParams();
  const [details, setDetails] = useState(tvDetailsState);
  const fetchTvDetails = async () => {
    try {
      const response = await http.get<any>(`/tv/tmdb/details/${params.id}/`);

      setDetails(response.data.tv_details);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchTvDetails();
  });

  const updateDetails = (bool: boolean, field: string) => {
    setDetails((prevState) => ({
      ...prevState,
      [field]: bool,
    }));
  };

  return (
    <div className={tvDetailsStyles.container}>
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
        className={tvDetailsStyles.backdrop}
      >
        <div className={tvDetailsStyles.row}>
          <div className={tvDetailsStyles.poster}>
            <img
              src={` https://image.tmdb.org/t/p/original${details.poster_path}`}
              alt={details.original_name}
            />
          </div>

          <div className={tvDetailsStyles.content}>
            <div className={tvDetailsStyles.header}>
              <h2>{details.original_name}</h2>
              <p className={tvDetailsStyles.airDate}>
                {details.first_air_date} - {details.last_air_date}
              </p>
              {details.tagline && <p>"{details.tagline}"</p>}
            </div>
            <div className={tvDetailsStyles.genres}>
              {details?.genres.map(({ id, name }) => {
                return <p key={id}>{name}</p>;
              })}
            </div>

            <div className={tvDetailsStyles.actions}>
              <ProgressCircle
                value={details.vote_percent}
                text={`${details.vote_percent}%`}
              />
              <Actions
                type="tv"
                id={details.id}
                name={details.original_name}
                backdropPath={details.poster_path}
                favorited={details.favorited}
                watchlist={details.watchlist}
                updateDetails={updateDetails}
              />
            </div>

            <div className={tvDetailsStyles.overview}>{details.overview}</div>
          </div>
        </div>
      </div>

      <p className={tvDetailsStyles.productionCompaniesTitle}>Production Companies</p>
      <div className={tvDetailsStyles.productionCompanies}>
        {details?.production_companies.map(({ logo_path, name, id }) => {
          return (
            <div key={id} className={tvDetailsStyles.productionCompany}>
              <img src={`https://image.tmdb.org/t/p/original${logo_path}`} alt={name} />
              <p>{name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TvDetails;
