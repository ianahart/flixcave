import totalResultsStyles from '../../styles/search/TotalResults.module.scss';
import TotalResult from './TotalResult';
import { useAppSelector } from '../../app/hooks';
import { useState } from 'react';
const TotalResults = () => {
  const total = useAppSelector((state) => state.searchTotal.value);
  const [active, setActive] = useState('movie');

  const handleSetActive = (activeParameter: string) => {
    setActive(activeParameter);
  };

  return (
    <div className={totalResultsStyles.container}>
      <div className={totalResultsStyles.header}>
        <h2>Search Results</h2>
      </div>
      <TotalResult
        handleSetActive={handleSetActive}
        label="Person"
        count={total.person}
        active={active}
                parameter="person"
      />
      <TotalResult
        handleSetActive={handleSetActive}
        label="Tv"
        count={total.tv}
        active={active}
                parameter="tv"
      />
      <TotalResult
        handleSetActive={handleSetActive}
        label="Movie"
        count={total.movie}
        active={active}
                
                parameter="movie"
      />
      <TotalResult
        handleSetActive={handleSetActive}
        label="Collection"
        count={total.collection}
        active={active}
                parameter="collection"
      />
    </div>
  );
};

export default TotalResults;
