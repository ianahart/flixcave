import popularStyles from '../../../styles/links/movies/Popular.module.scss';
import Resources from '../../../components/Links/Resources';
const Popular = () => {
  return (
    <div className={popularStyles.container}>
      <Resources filterLink="discover/movie" details="movies" mainLink="/movie/popular" />
    </div>
  );
};

export default Popular;
