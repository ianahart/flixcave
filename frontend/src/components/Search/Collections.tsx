import { useAppSelector } from '../../app/hooks';
import collectionsStyles from '../../styles/search/Collections.module.scss';
import { Link as RouterLink } from 'react-router-dom';
import { ICollection, IMovie } from '../../interfaces';
const Movies = () => {
  const data = useAppSelector((state) => state.search.value.searchResults);
  return (
    <div className={collectionsStyles.container}>
      {data.length === 0 ? (
        <p>There were no collections that matched your search.</p>
      ) : (
        <div>
          {data.map((collection: ICollection) => {
            return (
              <div key={collection.id} className={collectionsStyles.movieContainer}>
                <RouterLink to={`/collections/${collection.id}`}>
                  <div>
                    {collection.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/original/${collection.poster_path}`}
                      />
                    )}
                  </div>
                </RouterLink>
                <div className={collectionsStyles.header}>
                  <RouterLink to={`/collections/${collection.id}`}>
                    <h2>{collection.name}</h2>
                  </RouterLink>

                  <div className={collectionsStyles.overview}>{collection.overview}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Movies;
