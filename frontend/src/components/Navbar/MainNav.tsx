import useWebSocket from 'react-use-websocket';
import navBarStyles from '../../styles/navbar/Navbar.module.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillBell } from 'react-icons/ai';
import UserMenu from '../User/UserMenu';
import Notifications from '../Notifications/Notifications';
import { useAppSelector } from '../../app/hooks';
import { http, retreiveTokens } from '../../helpers/utils';
import { AxiosError } from 'axios';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { INotification, INotificationsResponse } from '../../interfaces';

export default function MainNav() {
  const user = useAppSelector((state) => state.user.value);
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
        setNotifications((prevState) => [...prevState, data.notification]);
        setNotificationsCount((prevState) => prevState + 1);
      }
      // notificationsCount++
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
      {user.logged_in && (
        <div className={navBarStyles.notification}>
          <div onClick={handleToggleNotifications}>
            <AiFillBell />
            {notificationsCount > 0 && (
              <div className={navBarStyles.notificationCount}>
                {notificationsCount > 9 ? '9+' : notificationsCount}
              </div>
            )}
          </div>
          {notificationsOpen && (
            <>
              <Notifications
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
      {user.logged_in && <UserMenu />}
    </ul>
  );
}
