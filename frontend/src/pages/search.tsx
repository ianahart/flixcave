import { AxiosError } from 'axios';
import { useSearchParams } from 'react-router-dom';
import { http } from '../helpers/utils';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import TotalResults from '../components/Search/TotalResults';
import SearchResults from '../components/Search/SearchResults';
import searchStyles from '../styles/search/Search.module.scss';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { saveSearchResults } from '../features/searchSlice';
import { saveSearchTotal } from '../features/searchTotalSlice';
import { saveSearchTotalPages } from '../features/searchTotalPagesSlice';
import { saveSearchPage } from '../features/searchPageSlice';
import { saveSearchType } from '../features/searchTypeSlice';
const Search = () => {
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.searchPage.value);
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');

  const performSearch = async () => {
    try {
      dispatch(saveSearchResults([]));
      dispatch(saveSearchType('movie'));
      const response = await http.get<any>(`/search/?query=${q}&page=${page}`);
      dispatch(saveSearchResults(response.data.results.results));
      dispatch(saveSearchTotal(response.data.totals));
      dispatch(saveSearchTotalPages(response.data.results.total_pages));
      dispatch(saveSearchPage(response.data.page));
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
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
