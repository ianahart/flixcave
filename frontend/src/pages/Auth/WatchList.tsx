import WatchListStyles from '../../styles/watchlist/WatchList.module.scss';
import { AxiosError } from 'axios';
import { useState } from 'react';
import Jumbotron from '../../components/Mixed/Jumbotron';
import { Link as RouterLink } from 'react-router-dom';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { IGetWatchlistResponse, IWatchListItem } from '../../interfaces';

const WatchList = () => {
  const [hasNext, setHasNext] = useState(false);
  const [watchlist, setWatchlist] = useState<IWatchListItem[]>([]);
  const [page, setPage] = useState(1);
  const fetchWatchlist = async (endpoint: string) => {
    try {
      const response = await http.get<IGetWatchlistResponse>(endpoint);

      console.log(response);
      setPage(response.data.page);
      setWatchlist((prevState) => [...prevState, ...response.data.watchlist_items]);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchWatchlist('/watchlists/?page=0');
  });

  const removeFromWatchlist = async (id: number) => {
    try {
      await http.delete(`/watchlists/${id}/`);

      const filteredWatchlist = [...watchlist].filter((item) => item.resource_id !== id);
      setWatchlist(filteredWatchlist);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  return (
    <div className={WatchListStyles.container}>
      <Jumbotron />
      <div className={WatchListStyles.listContainer}>
        {watchlist.map((item) => {
          return (
            <div className={WatchListStyles.listItem} key={item.id}>
              <RouterLink to={`/${item.type}/${item.resource_id}`}>
                <div className={WatchListStyles.content}>
                  <img src={item.backdrop_path} alt={item.title} />
                  <h3>{item.title}</h3>
                </div>
              </RouterLink>
              <div className={WatchListStyles.btnContainer}>
                <button onClick={() => removeFromWatchlist(item.resource_id)}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {hasNext && (
        <div className={WatchListStyles.loadMore}>
          <button onClick={() => fetchWatchlist(`/watchlists/?page=${page}`)}>
            See more...
          </button>
        </div>
      )}
    </div>
  );
};

export default WatchList;
