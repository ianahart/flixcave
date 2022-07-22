import { AiOutlinePlus } from 'react-icons/ai';
import navBarStyles from '../../styles/navbar/Navbar.module.scss';
import { Link } from 'react-router-dom';
export default function MainNav() {
  return (
    <ul className={`${navBarStyles.desktopList} ${navBarStyles.list}`}>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/join">Join</Link>
      </li>
    </ul>
  );
}
