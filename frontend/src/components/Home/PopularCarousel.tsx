import { AxiosError } from 'axios';
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from 'react-icons/bs';
import { MouseEvent, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { IResource, IResourcesResponse } from '../../interfaces';
import popularCarouselStyles from '../../styles/home/PopularCarousel.module.scss';
import spinner from '../../images/spinner.svg';

interface IPopularCarouselProps {
  link: string;
}

interface IActiveResourceProps {
  activeResource: IResource;
}

const PopularCarousel = ({ link }: IPopularCarouselProps) => {
  const LIMIT = 5;
  const [resources, setResources] = useState<IResource[]>([]);
  const [activeResources, setActiveResources] = useState<IResource[]>([]);
  const [lastPos, setLastPos] = useState(0);
  const [direction, setDirection] = useState('next');
  const [loaded, setLoaded] = useState(true);

  const fetchPopular = async (endpoint: string) => {
    try {
      setLoaded(false);
      const response = await http.get<IResourcesResponse>(endpoint);
      setResources(response.data.resources);
      setActiveResources(response.data.resources.slice(0, LIMIT));
      setLastPos(LIMIT);
      setLoaded(true);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        setLoaded(true);
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchPopular(link);
  });

  const handleLeftArrowClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (direction !== 'prev') {
      setDirection('prev');
    }
    setLastPos((prevState) => prevState - LIMIT);
    setActiveResources(resources.slice(lastPos - LIMIT * 2, lastPos - LIMIT));
  };

  const handleRightArrowClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (direction !== 'next') {
      setDirection('next');
    }
    setLastPos((prevState) => prevState + LIMIT);
    setActiveResources(resources.slice(lastPos, lastPos + LIMIT));
  };

  const Resource = ({ activeResource }: IActiveResourceProps) => {
    const [hovered, setHovered] = useState(false);

    const handleOnMouseEnter = () => setHovered(true);
    const handleOnMouseLeave = () => setHovered(false);

    return (
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className={`${popularCarouselStyles.activeResource} ${
          direction === 'next'
            ? popularCarouselStyles.slideRight
            : popularCarouselStyles.slideLeft
        }  `}
      >
        <img
          src={`https://image.tmdb.org/t/p/original${activeResource.backdrop_path}`}
          alt={activeResource.original_title}
        />
        {hovered && (
          <RouterLink to={`/movies/${activeResource.id}`}>
            <div className={popularCarouselStyles.overlay}>
              {activeResource.original_title}
            </div>
          </RouterLink>
        )}
      </div>
    );
  };

  return (
    <>
      {!loaded && <img src={spinner} alt="spinner" />}
      <div className={popularCarouselStyles.container}>
        {lastPos > LIMIT && (
          <div onClick={handleLeftArrowClick} className={popularCarouselStyles.leftArrow}>
            <BsArrowLeftSquareFill />
          </div>
        )}
        {activeResources.length > 0 &&
          activeResources.map((activeResource) => {
            return <Resource key={activeResource.id} activeResource={activeResource} />;
          })}
        {lastPos < resources.length && (
          <div
            onClick={handleRightArrowClick}
            className={popularCarouselStyles.rightArrow}
          >
            <BsArrowRightSquareFill />
          </div>
        )}
      </div>
    </>
  );
};

export default PopularCarousel;
