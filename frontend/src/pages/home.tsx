import Hero from '../components/Home/Hero';
import PopularCarousel from '../components/Home/PopularCarousel';
import homeStyles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <div className={homeStyles.container}>
      <Hero />
      <div className={homeStyles.carousel}>
        <h3>New and Popular</h3>
        <PopularCarousel link="/resources/tmdb/?main_link=/movie/popular&page=1" />
        <h3>Top Rated</h3>
        <PopularCarousel link="/resources/tmdb/?main_link=/movie/top_rated&page=1" />
        <h3>Now Playing</h3>
        <PopularCarousel link="/resources/tmdb/?main_link=/movie/now_playing&page=1" />
      </div>
    </div>
  );
}
