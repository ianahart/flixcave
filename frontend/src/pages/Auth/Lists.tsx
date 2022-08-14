import { Axios, AxiosError } from 'axios';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import listsStyles from '../../styles/lists/Lists.module.scss';
import { IListsResponse, IList } from '../../interfaces';
import Jumbotron from '../../components/Mixed/Jumbotron';

const Lists = () => {
  const [lists, setLists] = useState<IList[]>([]);
  const fetchLists = async () => {
    try {
      const response = await http.get<IListsResponse>(`/lists/`);
      setLists(response.data.lists);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchLists();
  });

  return (
    <div className={listsStyles.container}>
      <Jumbotron />
      <div className={listsStyles.header}>
        <header>
          <h2>Your Lists</h2>
        </header>
      </div>
      <div className={listsStyles.listsContainer}>
        {lists.map((list) => {
          return (
            <RouterLink to={`/lists/${list.id}`} key={list.id}>
              {list.name}
            </RouterLink>
          );
        })}
      </div>
    </div>
  );
};

export default Lists;
