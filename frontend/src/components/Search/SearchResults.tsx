import { AxiosError } from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import searchResultsStyles from '../../styles/search/SearchResults.module.scss';
import { http } from '../../helpers/utils';
import Movies from './Movies';
import { saveSearchResults } from '../../features/searchSlice';
import { saveSearchType } from '../../features/searchTypeSlice';
import { saveSearchPage } from '../../features/searchPageSlice';
import { saveSearchTotalPages } from '../../features/searchTotalPagesSlice';
import Tvs from './Tvs';
import Persons from './Persons';
import Collections from './Collections';
const SearchResults = () => {
  const searchType = useAppSelector((state) => state.searchType.value);
  const searchPage = useAppSelector((state) => state.searchPage.value);
  const searchTotalPages = useAppSelector((state) => state.searchTotalPages.value);
  const page = useAppSelector((state) => state.searchPage.value);
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');

  const displaySearchResults = () => {
    switch (searchType) {
      case 'tv':
        return <Tvs />;
      case 'person':
        return <Persons />;
      case 'movie':
        return <Movies />;
      case 'collection':
        return <Collections />;
      default:
        return <Movies />;
    }
  };

  const paginate = async (direction: string) => {
    try {
      let curPage: number;
      if (direction === 'prev' && page > 1) {
        curPage = page - 1;
      } else if (direction === 'next') {
        curPage = page + 1;
      } else {
        curPage = page;
      }

      const response = await http.get(
        `/search/tmdb/${searchType}/?page=${curPage}&query=${q}&direction=${direction}`
      );
      dispatch(saveSearchResults(response.data.results.results));
      dispatch(saveSearchType(response.data.type));
      dispatch(saveSearchPage(response.data.page));
      dispatch(saveSearchTotalPages(response.data.results.total_pages));
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  return (
    <div className={searchResultsStyles.container}>
      {displaySearchResults()}

      <div className={searchResultsStyles.pagination}>
        {page > 1 && <button onClick={() => paginate('prev')}>Previous</button>}
        <p>{searchPage}</p>
        {page < searchTotalPages && (
          <button onClick={() => paginate('next')}>Next</button>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
