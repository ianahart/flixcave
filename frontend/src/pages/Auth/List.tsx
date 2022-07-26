import { Axios, AxiosError } from 'axios';
import { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import listStyles from '../../styles/lists/List.module.scss';
import { IListResponse, IListItem } from '../../interfaces';
import Jumbotron from '../../components/Mixed/Jumbotron';

const List = () => {
  const params = useParams();
  const [listItems, setListItems] = useState<IListItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const fetchList = async (endpoint: string) => {
    try {
      const response = await http.get<IListResponse>(endpoint);
      setListItems((prevState) => [...prevState, ...response.data.list_items]);
      setPage(response.data.page);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchList(`/lists/${params.id}/?page=0`);
  });

  const deleteItem = async (listItemId: number) => {
    try {
      const filteredListItems = [...listItems].filter(
        (listItem) => listItem.id !== listItemId
      );
      setListItems(filteredListItems);

      await http.delete(`/lists/${listItemId}/`);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
      }
    }
  };
  return (
    <div className={listStyles.container}>
      <Jumbotron />
      <div className={listStyles.listContainer}>
        {listItems.map((listItem) => {
          return (
            <div className={listStyles.listItem} key={listItem.id}>
              <RouterLink to={`/${listItem.type}/${listItem.resource_id}`}>
                <div className={listStyles.content}>
                  <img src={listItem.backdrop_path} alt={listItem.title} />
                  <h3>{listItem.title}</h3>
                </div>
              </RouterLink>
              <div className={listStyles.btnContainer}>
                <button onClick={() => deleteItem(listItem.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
      {hasNext && (
        <div className={listStyles.loadMore}>
          <button onClick={() => fetchList(`/lists/${params.id}/?page=${page}`)}>
            See more...
          </button>
        </div>
      )}
    </div>
  );
};

export default List;
