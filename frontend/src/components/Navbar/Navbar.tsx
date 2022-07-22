import { AiOutlineMenu } from 'react-icons/ai';
import { MouseEvent, useEffect, useState } from 'react';
import MainNav from './MainNav';
import MovieNav from './MovieNav';
import Mobile from './Mobile';
import logo from '../../images/logo.png';
import navBarStyles from '../../styles/navbar/Navbar.module.scss';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSetMobileMenuOpen = (mobileMenuOpen: boolean) => {
    setMobileMenuOpen(mobileMenuOpen);
  };

  const handleOnClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleSetMobileMenuOpen(true);
  };

  return (
    <nav className={navBarStyles.navContainer}>
      <img className="logo" width={70} height={70} src={logo} alt="logo" />
      <MovieNav />
      <MainNav />
      <div onClick={handleOnClick} className={navBarStyles.hamburgerMenu}>
        <AiOutlineMenu />
        {mobileMenuOpen && <Mobile handleSetMobileMenuOpen={handleSetMobileMenuOpen} />}
      </div>
    </nav>
  );
}
