import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { movies, tvShows, people, discussions } from '../../data/data';
import mobileStyles from '../../styles/navbar/Mobile.module.scss';
import MobileNavListItem from './MobileNavListItem';

interface IMobileProps {
  handleSetMobileMenuOpen: (mobileMenuOpen: boolean) => void;
}

export default function Mobile({ handleSetMobileMenuOpen }: IMobileProps) {
  const [windowWidth, setWindowWidth] = useState(0);
  const handleOnClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleSetMobileMenuOpen(false);
  };

  const handleResize = useCallback(
    (e: Event) => {
      const target = e.target as Window;
      setWindowWidth(target.innerWidth);
      if (target.innerWidth > 768) {
        handleSetMobileMenuOpen(false);
      }
    },
    [handleSetMobileMenuOpen]
  );

  const closeOnLink = (e: MouseEvent<HTMLLIElement>): void => {
    e.stopPropagation();
    handleSetMobileMenuOpen(false);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <div className={mobileStyles.container}>
      <div onClick={handleOnClick} className={mobileStyles.close}>
        <AiOutlineClose />
      </div>
      <ul className={mobileStyles.mainNav}>
        <li onClick={closeOnLink}>
          <Link to="/login">Login</Link>
        </li>
        <li onClick={closeOnLink}>
          <Link to="/join">Join</Link>
        </li>
      </ul>

      <div className={mobileStyles.subMenus}>
        <MobileNavListItem
          closeOnLink={closeOnLink}
          subListItems={movies}
          label="Movies"
        />
        <MobileNavListItem
          closeOnLink={closeOnLink}
          subListItems={tvShows}
          label="Tv Shows"
        />
        <MobileNavListItem
          closeOnLink={closeOnLink}
          subListItems={people}
          label="People"
        />
        <MobileNavListItem
          closeOnLink={closeOnLink}
          subListItems={discussions}
          label="Discussions"
        />
      </div>
    </div>
  );
}
