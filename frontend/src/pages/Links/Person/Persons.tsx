import { AxiosError } from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { http } from '../../../helpers/utils';
import { useEffectOnce } from '../../../hooks/UseEffectOnce';
import personsStyles from '../../../styles/links/persons/Persons.module.scss';

const Person = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [people, setPeople] = useState<any>([]);
  const fetchPeople = async (endpoint: string) => {
    try {
      const response = await http.get(endpoint);
      setPeople((prevState: any) => [...prevState, ...response.data.people]);
      setPage(response.data.page);
      setTotalPages(response.data.total_pages);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  useEffectOnce(() => {
    fetchPeople(`/persons/tmdb/?page=${page}`);
  });

  return (
    <div className={personsStyles.container}>
      <div className={personsStyles.grid}>
        {people?.map((person: any) => {
          return (
            <div key={person.id} className={personsStyles.person}>
              <RouterLink to={`/people/${person.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
                  alt="person"
                />
                <p>{person.name}</p>
              </RouterLink>
            </div>
          );
        })}
      </div>
      {page < totalPages && people.length > 0 && (
        <div className={personsStyles.loadMore}>
          <button onClick={() => fetchPeople(`/persons/tmdb/?page=${page}`)}>
            See more
          </button>
        </div>
      )}
    </div>
  );
};

export default Person;
