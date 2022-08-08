import { useAppSelector } from '../../app/hooks';
import anonymousPerson from '../../images/anonymous.png';
import personsStyles from '../../styles/search/Persons.module.scss';
import { IMovie, IPerson } from '../../interfaces';
import { Link as RouterLink } from 'react-router-dom';
const Persons = () => {
  const data = useAppSelector((state) => state.search.value.searchResults);
  console.log('DATA', data);
  return (
    <div className={personsStyles.container}>
      {data.length === 0 ? (
        <p>There are no people that matched your search.</p>
      ) : (
        <div>
          {data?.map((person: IPerson) => {
            return (
              <div className={personsStyles.person} key={person.id}>
                <RouterLink to={`/people/${person.id}`}>
                  <div className={personsStyles.profilePicture}>
                    {person.profile_path === null ? (
                      <img src={anonymousPerson} alt="anonymous person" />
                    ) : (
                      <img
                        src={`https://image.tmdb.org/t/p/original/${person.profile_path}`}
                        alt={person.name}
                      />
                    )}
                  </div>
                </RouterLink>
                <div className={personsStyles.details}>
                  <RouterLink to={`/people/${person.id}`}>
                    <h2>{person.name}</h2>
                  </RouterLink>
                  <div className={personsStyles.knownFor}>
                    {person?.known_for?.map((movie: any) => {
                      return <p key={movie.id}>{movie.original_name}</p>;
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Persons;
