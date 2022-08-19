import { AxiosError } from 'axios';
import { BsFileImage } from 'react-icons/bs';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import resourceStyles from '../../styles/links/movies/Resources.module.scss';
import spinnerImg from '../../images/spinner.svg';
import { IResource, IResourcesResponse } from '../../interfaces';
import ProgressCircle from '../Details/ProgressCircle';
import SortBox from './SortBox';
import FilterBox from './FilterBox';

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
  const [runTimeRange, setRunTimeRange] = useState([60, 360]);
  const [voteRange, setVoteRange] = useState([1, 10]);
  const [filterOn, setFilterOn] = useState(false);

  const resetPage = () => setPage(1);
  const resetResources = () => setResources([]);
  const handleSetRunTime = (range: number[]) => {
    setRunTimeRange(range);
    resetPage();
    resetResources();
    if (!filterOn) {
      setFilterOn(true);
    }
  };

  const handleSetVoteRange = (range: number[]) => {
    setVoteRange(range);
    resetPage();
    resetResources();
    if (!filterOn) {
      setFilterOn(true);
    }
  };

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
      setLoaded(false);
      setFilterOn(false);
      setSort(sort);
      const response = await http.get<IResourcesResponse>(
        `resources/tmdb/sorted/?sort_by=${sort}&link=${link}&page=${page}`
      );
      setPage(response.data.page);
      setResources((prevState) => [...prevState, ...response.data.resources]);
      setLoaded(true);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        setLoaded(true);
        return;
      }
    }
  };

  const handleFilter = async (runTimeRange: number[], voteRange: number[]) => {
    try {
      setLoaded(false);
      const response = await http.get(
        `/resources/tmdb/filtered/?main_path=${filterLink}&page=${page}&with_runtime.lte=${runTimeRange[1]}&with_runtime.gte=${runTimeRange[0]}&vote_average.lte=${voteRange[1]}&vote_average.gte=${voteRange[0]}`
      );

      setPage(response.data.page);
      setResources((prevState) => [...prevState, ...response.data.resources]);
      setLoaded(true);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        setLoaded(false);
        return;
      }
    }
  };

  const seeMoreBtn = () => {
    if (sort.length > 0) {
      // sort
      return <button onClick={() => handleSort(sort, filterLink)}>See more sort</button>;
    } else if (sort.length === 0 && filterOn) {
      //filter
      return (
        <button
          onClick={() =>
            fetchResources(
              `/resources/tmdb/filtered/?main_path=${filterLink}&page=${page}&with_runtime.lte=${runTimeRange[1]}&with_runtime.gte=${runTimeRange[0]}&vote_average.lte=${voteRange[1]}&vote_average.gte=${voteRange[0]}`
            )
          }
        >
          See more
        </button>
      );
    } else {
      // regular
      return (
        <button
          onClick={() =>
            fetchResources(`/resources/tmdb/?main_link=${mainLink}&page=${page}`)
          }
        >
          See more
        </button>
      );
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
          <FilterBox
            handleFilter={handleFilter}
            runTimeRange={runTimeRange}
            voteRange={voteRange}
            handleSetRunTime={handleSetRunTime}
            handleSetVoteRange={handleSetVoteRange}
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
            <div className={resourceStyles.loadMore}>{seeMoreBtn()}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;
