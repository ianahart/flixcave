import { useRef, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import totalResultsStyles from '../../styles/search/TotalResults.module.scss';
import TotalResult from './TotalResult';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { saveSearchResults } from '../../features/searchSlice';
import { http } from '../../helpers/utils';
import { saveSearchType } from '../../features/searchTypeSlice';
import { saveSearchTotalPages } from '../../features/searchTotalPagesSlice';
import { saveSearchPage } from '../../features/searchPageSlice';
const TotalResults = () => {
  const dispatch = useAppDispatch();
  const total = useAppSelector((state) => state.searchTotal.value);
  const searchType = useAppSelector((state) => state.searchType.value);
  const [initialLoad, setInitialLoad] = useState(true);
  const firstRender = useRef(true);
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      setInitialLoad(false);
      return;
    }
  }, []);

  const handleSetActive = async (activeParameter: string) => {
    try {
      if (searchType === activeParameter) return;
      const page = activeParameter === 'movie' && initialLoad ? 2 : 1;
      const response = await http.get(
        `/search/tmdb/${activeParameter}/?page=${page}&query=${q}`
      );
      dispatch(saveSearchResults(response.data.results.results));
      dispatch(saveSearchType(response.data.type));
      dispatch(saveSearchTotalPages(response.data.results.total_pages));
      dispatch(saveSearchPage(response.data.page));
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
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
        active={searchType}
        parameter="person"
      />
      <TotalResult
        handleSetActive={handleSetActive}
        label="Tv"
        count={total.tv}
        active={searchType}
        parameter="tv"
      />
      <TotalResult
        handleSetActive={handleSetActive}
        label="Movie"
        count={total.movie}
        active={searchType}
        parameter="movie"
      />
      <TotalResult
        handleSetActive={handleSetActive}
        label="Collection"
        count={total.collection}
        active={searchType}
        parameter="collection"
      />
    </div>
  );
};

export default TotalResults;
