import { useAppSelector } from '../../app/hooks';
import moviesStyles from '../../styles/search/Movies.module.scss';
import { Link as RouterLink } from 'react-router-dom';
import { IMovie } from '../../interfaces';
const Movies = () => {
  const data = useAppSelector((state) => state.search.value.searchResults);
  return (
    <div className={moviesStyles.container}>
      {data.length === 0 ? (
        <p>There were no movies that matched your search.</p>
      ) : (
        <div>
          {data.map((movie: IMovie) => {
            return (
              <div key={movie.id} className={moviesStyles.movieContainer}>
                <RouterLink to={`/movies/${movie.id}`}>
                  <div>
                    {movie.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                      />
                    )}
                  </div>
                </RouterLink>
                <div className={moviesStyles.header}>
                  <RouterLink to={`/movies/${movie.id}`}>
                    <h2>{movie.title}</h2>
                  </RouterLink>

                  <p>{movie.release_date}</p>
                  <div className={moviesStyles.overview}>{movie.overview}</div>
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
