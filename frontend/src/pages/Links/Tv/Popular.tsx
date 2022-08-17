import Resources from '../../../components/Links/Resources';
import popularStyles from '../../../styles/links/movies/Popular.module.scss';

const Popular = () => {
  return (
    <div className={popularStyles.container}>
      <Resources filterLink="discover/tv" details="tv" mainLink="/tv/popular" />
    </div>
  );
};

export default Popular;
