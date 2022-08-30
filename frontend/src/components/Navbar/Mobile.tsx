import { MouseEvent, useCallback, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import navBarStyles from '../../styles/navbar/Navbar.module.scss';
import { AxiosError } from 'axios';
import { AiOutlineClose, AiFillBell } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { INotification, INotificationsResponse } from '../../interfaces';
import { movies, tvShows, people, discussions } from '../../data/data';
import mobileStyles from '../../styles/navbar/Mobile.module.scss';
import UserMenu from '../User/UserMenu';
import MobileNavListItem from './MobileNavListItem';
import { retreiveTokens } from '../../helpers/utils';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import Notifications from '../Notifications/Notifications';

interface IMobileProps {
  handleSetMobileMenuOpen: (mobileMenuOpen: boolean) => void;
}

export default function Mobile({ handleSetMobileMenuOpen }: IMobileProps) {
  const user = useAppSelector((state) => state.user.value);
  const [windowWidth, setWindowWidth] = useState(0);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);

  const resetState = () => {
    setPage(1);
    setHasNext(false);
    setNotifications([]);
  };

  const filterNotifications = (id: number) => {
    const filtered = notifications.filter((notification) => notification.id !== id);
    setNotifications(filtered);
  };

  const handleSetNotificationsOpen = (notificationsOpen: boolean) =>
    setNotificationsOpen(notificationsOpen);

  const socketUrl = `ws://127.0.0.1:8000/ws/notification/${user.id}/?token=${
    retreiveTokens()?.access_token
  }`;

  const {} = useWebSocket(socketUrl, {
    share: true,
    onMessage: (event: WebSocketEventMap['message']) => {
      console.log('Message: ', event);
      const data = JSON.parse(event.data);
      if (Object.keys(data).includes('notification')) {
        setNotifications([]);
        setNotifications((prevState) => [
          ...prevState,
          ...data.notification.notifications,
        ]);
        setPage(data.notification.page);
        setHasNext(data.notification.has_next);
        setNotificationsCount((prevState) => prevState + 1);
      }
    },
  });

  const fetchNotifications = async (endpoint: string) => {
    try {
      const response = await http.get<INotificationsResponse>(endpoint);
      setPage(response.data.page);
      setNotifications((prevState) => [...prevState, ...response.data.notifications]);
      setHasNext(response.data.has_next);
      setNotificationsCount(response.data.notifications_count);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchNotifications(`/notifications/?page=0`);
  });

  const handleToggleNotifications = () => {
    setNotificationsOpen(true);
    if (!notifications.length) {
      fetchNotifications(`/notifications/?page=0`);
    }
  };

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

      {user.logged_in && (
        <div className={mobileStyles.notification}>
          <div onClick={handleToggleNotifications}>
            <AiFillBell />
            {notificationsCount > 0 && (
              <div className={mobileStyles.notificationCount}>
                {notificationsCount > 9 ? '9+' : notificationsCount}
              </div>
            )}
          </div>
          {notificationsOpen && (
            <>
              <Notifications
                top="40px"
                left="50px"
                page={page}
                hasNext={hasNext}
                resetState={resetState}
                notifications={notifications}
                filterNotifications={filterNotifications}
                fetchNotifications={fetchNotifications}
                handleSetNotificationsOpen={handleSetNotificationsOpen}
              />
            </>
          )}
        </div>
      )}

      <ul className={mobileStyles.mainNav}>
        {user.logged_in && <UserMenu />}

        {!user.logged_in && (
          <li onClick={closeOnLink}>
            <Link to="/login">Login</Link>
          </li>
        )}
        {!user.logged_in && (
          <li onClick={closeOnLink}>
            <Link to="/join">Join</Link>
          </li>
        )}
      </ul>

      <div className={mobileStyles.subMenus}>
        <MobileNavListItem
          closeOnLink={closeOnLink}
          subListItems={movies}
          label="Movies"
          link="movies"
        />
        <MobileNavListItem
          closeOnLink={closeOnLink}
          subListItems={tvShows}
          label="Tv Shows"
          link="tv"
        />
        <MobileNavListItem
          closeOnLink={closeOnLink}
          subListItems={people}
          label="People"
          link="person"
        />
        <MobileNavListItem
          closeOnLink={closeOnLink}
          subListItems={discussions}
          label="Discussions"
          link=""
        />
      </div>
    </div>
  );
}
