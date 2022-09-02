import { AxiosError } from 'axios';
import { useState } from 'react';
import Jumbotron from '../../components/Mixed/Jumbotron';
import { Link as RouterLink } from 'react-router-dom';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { IGetFavoritesResponse, IFavorite } from '../../interfaces';
import favoritesStyles from '../../styles/favorites/Favorites.module.scss';

const Favorites = () => {
  const [hasNext, setHasNext] = useState(false);
  const [favorites, setFavorites] = useState<IFavorite[]>([]);
  const [page, setPage] = useState(1);
  const fetchFavorites = async (endpoint: string) => {
    try {
      const response = await http.get<IGetFavoritesResponse>(endpoint);

      setPage(response.data.page);
      setFavorites((prevState) => [...prevState, ...response.data.favorites]);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchFavorites('/favorites/?page=0');
  });

  const unFavorite = async (id: number) => {
    try {
      const filteredFavorites = [...favorites].filter(
        (favorite) => favorite.resource_id !== id
      );
      setFavorites(filteredFavorites);

      await http.delete(`/favorites/${id}`);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  return (
    <div className={favoritesStyles.container}>
      <Jumbotron />
      <div className={favoritesStyles.listContainer}>
        {favorites.map((favorite) => {
          return (
            <div className={favoritesStyles.listItem} key={favorite.id}>
              <RouterLink to={`/${favorite.type}/${favorite.resource_id}`}>
                <div className={favoritesStyles.content}>
                  <img src={favorite.backdrop_path} alt={favorite.title} />
                  <h3>{favorite.title}</h3>
                </div>
              </RouterLink>
              <div className={favoritesStyles.btnContainer}>
                <button onClick={() => unFavorite(favorite.resource_id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
      {hasNext && (
        <div className={favoritesStyles.loadMore}>
          <button onClick={() => fetchFavorites(`/favorites/?page=${page}`)}>
            See more...
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
