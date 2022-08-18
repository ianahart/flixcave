import { AxiosError } from 'axios';
import { useState } from 'react';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import resourceStyles from '../../styles/links/movies/Resources.module.scss';
import spinnerImg from '../../images/spinner.svg';
import { IResource, IResourcesResponse } from '../../interfaces';
import { Link as RouterLink } from 'react-router-dom';
import ProgressCircle from '../Details/ProgressCircle';
import { BsFileImage } from 'react-icons/bs';
import SortBox from './SortBox';
import { sortBy } from 'lodash';
import { nanoid } from 'nanoid';

interface IResourcesProps {
  mainLink: string;
  filterLink: string;
  details: string;
}

const Resources = ({ mainLink, filterLink, details }: IResourcesProps) => {
  const [resources, setResources] = useState<IResource[]>([]);
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [sort, setSort] = useState('');
  const resetPage = () => setPage(1);
  const resetResources = () => setResources([]);

  const fetchResources = async (endpoint: string) => {
    try {
      setLoaded(false);
      const response = await http.get<IResourcesResponse>(endpoint);
      setResources((prevState) => [...prevState, ...response.data.resources]);
      setPage(response.data.page);

      setLoaded(true);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        setLoaded(true);
      }
    }
  };

  useEffectOnce(() => {
    fetchResources(`/resources/tmdb/?main_link=${mainLink}&page=${page}`);
  });

  const handleSort = async (sort: string, link: string) => {
    try {
      setSort(sort);
      const response = await http.get<IResourcesResponse>(
        `resources/tmdb/sorted/?sort_by=${sort}&link=${link}&page=${page}`
      );
      console.log(response);
      setPage(response.data.page);
      setResources((prevState) => [...prevState, ...response.data.resources]);
      console.log(sort, link);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  return (
    <div className={resourceStyles.container}>
      <div className={resourceStyles.row}>
        <div className={resourceStyles.searchSettings}>
          <SortBox
            resetPage={resetPage}
            resetResources={resetResources}
            filterLink={filterLink}
            handleSort={handleSort}
          />
        </div>
        <div>
          <div className={resourceStyles.resources}>
            {!loaded && <img src={spinnerImg} alt="spinner" />}
            {resources.map((resource) => {
              return (
                <div className={resourceStyles.resource} key={nanoid()}>
                  <RouterLink to={`/${details}/${resource.id}`}>
                    {resource.backdrop_path === null ? (
                      <BsFileImage />
                    ) : (
                      <img
                        src={`https://image.tmdb.org/t/p/original/${resource.backdrop_path}`}
                        alt="movie poster"
                      />
                    )}
                  </RouterLink>
                  <div className={resourceStyles.content}>
                    <p>{resource.original_title ?? resource.original_name}</p>
                    <p>{resource.release_date}</p>
                    <div className={resourceStyles.progressCircle}>
                      <ProgressCircle
                        value={resource.vote_percent}
                        text={`${resource.vote_percent}%`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {resources.length > 0 && (
            <div className={resourceStyles.loadMore}>
              {sort.length > 0 ? (
                <button onClick={() => handleSort(sort, filterLink)}>See more</button>
              ) : (
                <button
                  onClick={() =>
                    fetchResources(`/resources/tmdb/?main_link=${mainLink}&page=${page}`)
                  }
                >
                  See more
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;
