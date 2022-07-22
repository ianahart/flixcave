import navBarStyles from '../../styles/navbar/Navbar.module.scss';
import NavListItem from './NavListItem';
import { movies, tvShows, people, discussions } from '../../data/data';
export default function MovieNav() {
  return (
    <ul
      style={{ marginRight: 'auto' }}
      className={`${navBarStyles.desktopList} ${navBarStyles.list}`}
    >
      <NavListItem subListItems={movies} label="Movies" />
      <NavListItem subListItems={tvShows} label="Tv Shows" />
      <NavListItem subListItems={people} label="People" />
      <NavListItem subListItems={discussions} label="Discussions" />
    </ul>
  );
}
