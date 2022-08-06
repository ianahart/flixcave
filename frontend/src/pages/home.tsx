import Hero from '../components/Home/Hero';
import homeStyles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <div className={homeStyles.container}>
      <Hero />
    </div>
  );
}
