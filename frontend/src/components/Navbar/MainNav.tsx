import navBarStyles from '../../styles/navbar/Navbar.module.scss';
import { Link } from 'react-router-dom';
import UserMenu from '../User/UserMenu';
import { useAppSelector } from '../../app/hooks';
export default function MainNav() {
  const user = useAppSelector((state) => state.user.value);
  return (
    <ul className={`${navBarStyles.desktopList} ${navBarStyles.list}`}>
      {!user.logged_in && (
        <li>
          <Link to="/login">Login</Link>
        </li>
      )}
      {!user.logged_in && (
        <li>
          <Link to="/join">Join</Link>
        </li>
      )}
      {user.logged_in && <UserMenu />}
    </ul>
  );
}
