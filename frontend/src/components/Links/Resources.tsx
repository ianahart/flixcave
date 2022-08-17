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

interface IResourcesProps {
  mainLink: string;
  filterLink: string;
  details: string;
}

const Resources = ({ mainLink, filterLink, details }: IResourcesProps) => {
  const [resources, setResources] = useState<IResource[]>([]);
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(false);

  const fetchResources = async (endpoint: string) => {
    try {
      setLoaded(false);
      const response = await http.get<IResourcesResponse>(endpoint);
      console.log(response);
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

  return (
    <div className={resourceStyles.container}>
      <div className={resourceStyles.row}>
        <div className={resourceStyles.filterBox}></div>
        <div>
          <div className={resourceStyles.resources}>
            {!loaded && <img src={spinnerImg} alt="spinner" />}
            {resources.map((resource) => {
              return (
                <div className={resourceStyles.resource} key={resource.id}>
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
          <div className={resourceStyles.loadMore}>
            <button
              onClick={() =>
                fetchResources(`/resources/tmdb/?main_link=${mainLink}&page=${page}`)
              }
            >
              Load more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
