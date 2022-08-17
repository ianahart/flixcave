import popularStyles from '../../../styles/links/movies/Popular.module.scss';
import Resources from '../../../components/Links/Resources';
const NowPlaying = () => {
  return (
    <div className={popularStyles.container}>
      <Resources
        filterLink="discover/movie"
        details="movies"
        mainLink="/movie/now_playing"
      />
    </div>
  );
};

export default NowPlaying;
