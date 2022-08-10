import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import collectionDetailsStyles from '../../styles/details/CollectionDetails.module.scss';
import { http } from '../../helpers/utils';
import { collectionDetailsState } from '../../data/initialState';
import { useEffectOnce } from '../../hooks/UseEffectOnce';

const CollectionDetails = () => {
  const params = useParams();
  const [details, setDetails] = useState(collectionDetailsState);
  const fetchCollectionDetails = async () => {
    try {
      const response = await http.get(`/collections/tmdb/details/${params.id}/`);
      setDetails(response.data.collection_details);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchCollectionDetails();
  });

  return (
    <div className={collectionDetailsStyles.container}>
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
        className={collectionDetailsStyles.backdrop}
      >
        <div className={collectionDetailsStyles.row}>
          <div className={collectionDetailsStyles.content}>
            <div className={collectionDetailsStyles.header}>
              <h2>{details.original_name}</h2>
              <p className={collectionDetailsStyles.airDate}>
                {details.first_air_date} - {details.last_air_date}
              </p>
              {details.tagline && <p>"{details.tagline}"</p>}
            </div>
            <div className={collectionDetailsStyles.genres}>
              {details?.genres.map(({ id, name }) => {
                return <p key={id}>{name}</p>;
              })}
            </div>

            <div className={collectionDetailsStyles.overview}>{details.overview}</div>
          </div>
        </div>
      </div>
      <div className={collectionDetailsStyles.facts}>
        <p>
          Number of Seasons <span>{details.number_of_seasons}</span>
        </p>
        <p>
          Number of Episodes <span>{details.number_of_episodes}</span>
        </p>
      </div>
    </div>
  );
};

export default CollectionDetails;
