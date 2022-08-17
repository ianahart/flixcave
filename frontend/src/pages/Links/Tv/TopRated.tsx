import Resources from '../../../components/Links/Resources';
import popularStyles from '../../../styles/links/movies/Popular.module.scss';

const TopRated = () => {
  return (
    <div className={popularStyles.container}>
      <Resources filterLink="discover/tv" details="tv" mainLink="/tv/top_rated" />
    </div>
  );
};

export default TopRated;
