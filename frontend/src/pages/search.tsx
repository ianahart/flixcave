import { AxiosError } from 'axios';
import { useSearchParams } from 'react-router-dom';
import { http } from '../helpers/utils';
import { useEffectOnce } from '../hooks/UseEffectOnce';

const Search = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');

  const performSearch = async () => {
    try {
      const response = await http.get(`/search/?q=${q}`);
      console.log(response);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  useEffectOnce(() => {
    performSearch();
  });

  return <div>search page</div>;
};

export default Search;
