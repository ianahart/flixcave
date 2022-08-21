import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { personDetailsState } from '../../data/initialState';
import personDetailsStyles from '../../styles/details/PersonDetails.module.scss';
import { IPersonDetails, IPersonDetailsResponse } from '../../interfaces';
import anonymousUser from '../../images/anonymous.png';

const PersonDetails = () => {
  const params = useParams();
  const [details, setDetails] = useState<IPersonDetails>(personDetailsState);

  console.log(details);
  const fetchCollectionDetails = async () => {
    try {
      const response = await http.get<IPersonDetailsResponse>(
        `/persons/tmdb/details/${params.id}/`
      );
      setDetails(response.data.person_details);
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
    <div className={personDetailsStyles.container}>
      <div className={personDetailsStyles.row}>
        <div className={personDetailsStyles.poster}>
          {details.profile_path === null ? (
            <img src={anonymousUser} alt="anonymous user" />
          ) : (
            <img
              src={`https://image.tmdb.org/t/p/original${details.profile_path}`}
              alt={details.name}
            />
          )}
        </div>
        <div className={personDetailsStyles.infoContainer}>
          <h2>{details.name}</h2>
          <div className={personDetailsStyles.overview}>
            <h3>Overview</h3>
            <p>{details.biography}</p>
          </div>
          <div className={personDetailsStyles.facts}>
            <p>
              Birthday: <span>{details.birthday}</span>
            </p>
            <p>
              Place of birth: <span>{details.place_of_birth}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;
