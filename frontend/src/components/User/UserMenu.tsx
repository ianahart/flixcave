import { AxiosError } from 'axios';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AiOutlineUser, AiOutlineLogout, AiOutlineUnorderedList } from 'react-icons/ai';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { http, retreiveTokens } from '../../helpers/utils';
import { clearUser } from '../../features/userSlice';
import { clearTokens } from '../../features/tokenSlice';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import userMenuStyles from '../../styles/user/UserMenu.module.scss';

const UserMenu = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.user.value);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleToggleUserMenu = () => {
    setUserMenuOpen((prevState) => !prevState);
  };

  const clickAway = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    const target = e.target as Element;
    if (menuRef.current !== null && triggerRef.current !== null) {
      if (!menuRef.current.contains(target) && target !== triggerRef.current) {
        setUserMenuOpen(false);
      }
    }
  }, []);

  const logoutUser = async () => {
    try {
      const tokens = retreiveTokens();
      const response = await http.post('/auth/logout/', {
        pk: user.id,
        refresh_token: tokens.refresh_token,
      });
      dispatch(clearUser());
      dispatch(clearTokens());
      navigate('/login');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  useEffectOnce(() => {
    window.addEventListener('click', clickAway);
    return () => window.addEventListener('click', clickAway);
  });

  return (
    <li className={userMenuStyles.container}>
      <div
        ref={triggerRef}
        onClick={handleToggleUserMenu}
        className={userMenuStyles.initialsContainer}
      >
        <p>{user.initials}</p>
      </div>
      {userMenuOpen && (
        <div ref={menuRef} className={userMenuStyles.menu}>
          <div className={userMenuStyles.menuHeader}>
            <div className={userMenuStyles.menuHeaderContent}>
              <AiOutlineUser />
              <div>
                <p>{user.first_name}</p>
                <p>{user.email}</p>
              </div>
            </div>
          </div>

          <div className={userMenuStyles.link}>
            <AiOutlineUnorderedList />
            <RouterLink to="/lists">Your Lists</RouterLink>
          </div>

          <div className={userMenuStyles.link}>
            <AiOutlineLogout />
            <p onClick={logoutUser} role="button">
              Logout
            </p>
          </div>
        </div>
      )}
    </li>
  );
};

export default UserMenu;
