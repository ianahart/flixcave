import navBarStyles from '../../styles/navbar/Navbar.module.scss';
import NavListItem from './NavListItem';
import { movies, tvShows, people, discussions } from '../../data/data';
export default function MovieNav() {
  return (
    <ul
      style={{ marginRight: 'auto' }}
      className={`${navBarStyles.desktopList} ${navBarStyles.list}`}
    >
      <NavListItem link="movies" subListItems={movies} label="Movies" />
      <NavListItem link="tv" subListItems={tvShows} label="Tv Shows" />
      <NavListItem link="people" subListItems={people} label="People" />
      <NavListItem link="discussions" subListItems={discussions} label="Discussions" />
    </ul>
  );
}
