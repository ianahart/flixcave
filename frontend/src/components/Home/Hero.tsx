import heroStyles from '../../styles/home/Hero.module.scss';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const goToSearchPage = () => {
    if (searchTerm.trim().length === 0) {
      return;
    }
    const q = encodeURIComponent(searchTerm);
    navigate(`search/?q=${q}`);
  };

  return (
    <div className={heroStyles.hero}>
      <div className={heroStyles.heroContent}>
        <header>
          <h1>Welcome.</h1>
          <p>Explore enterainment, actors and actresses. Start now.</p>
        </header>
        <div className={heroStyles.inputContainer}>
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            placeholder="search shows, movies etc..."
          />
          <div role="button" onClick={goToSearchPage} className={heroStyles.searchBtn}>
            Search
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
