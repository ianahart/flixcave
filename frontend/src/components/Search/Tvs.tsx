import { useAppSelector } from '../../app/hooks';
import { Link as RouterLink } from 'react-router-dom';
import tvStyles from '../../styles/search/Tvs.module.scss';
import { ITv } from '../../interfaces';

const Movies = () => {
  const data = useAppSelector((state) => state.search.value.searchResults);
  return (
    <div className={tvStyles.container}>
      {data.length === 0 ? (
        <p>There were no tv shows that matched your search.</p>
      ) : (
        <div>
          {data.map((tv: ITv) => {
            return (
              <div key={tv.id} className={tvStyles.tvContainer}>
                <RouterLink to={`/tv-shows/${tv.id}`}>
                  <div>
                    {tv.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/original/${tv.poster_path}`}
                      />
                    )}
                  </div>
                </RouterLink>
                <div className={tvStyles.header}>
                  <RouterLink to={`/tv-shows/${tv.id}`}>
                    <p>{tv.name}</p>
                  </RouterLink>
                  <p>{tv.first_air_date}</p>
                  <div className={tvStyles.overview}>{tv.overview}</div>
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
