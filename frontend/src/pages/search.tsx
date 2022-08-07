import { AxiosError } from 'axios';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { http } from '../helpers/utils';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import TotalResults from '../components/Search/TotalResults';
import SearchResults from '../components/Search/SearchResults';
import searchStyles from '../styles/search/Search.module.scss';
import { useAppDispatch } from '../app/hooks';
import { saveSearchResults } from '../features/searchSlice';
import { saveSearchTotal } from '../features/searchTotalSlice';

const Search = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const q = searchParams.get('q');

  const performSearch = async () => {
    try {
      const response = await http.get<any>(`/search/?query=${q}&page=1`);
      console.log(response);
      dispatch(saveSearchResults(response.data.results.results));
      dispatch(saveSearchTotal(response.data.totals));
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  useEffectOnce(() => {
    performSearch();
  });

  return (
    <div className={searchStyles.container}>
      <div className={searchStyles.contentContainer}>
        <TotalResults />
        <SearchResults />
      </div>
    </div>
  );
};

export default Search;
