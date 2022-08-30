import notificationsStyles from '../../styles/notification/Notifications.module.scss';
import { useCallback, useRef } from 'react';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { INotification } from '../../interfaces';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';
import { AiOutlineClose } from 'react-icons/ai';
interface INotificationProps {
  handleSetNotificationsOpen: (notificationsOpen: boolean) => void;
  notifications: INotification[];
  fetchNotifications: (endpoint: string) => void;
  filterNotifications: (id: number) => void;
  page: number;
  hasNext: boolean;
  resetState: () => void;
  top: string;
  left: string;
}

const Notifications = ({
  handleSetNotificationsOpen,
  notifications,
  page,
  hasNext,
  top,
  left,
  fetchNotifications,
  resetState,
  filterNotifications,
}: INotificationProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const clickAway = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const target = e.target as Element;
      const triggers = ['path', 'svg'];
      if (menuRef.current !== null && !triggers.includes(target.tagName)) {
        if (!menuRef.current.contains(target)) {
          handleSetNotificationsOpen(false);
          resetState();
        }
      }
    },
    [handleSetNotificationsOpen]
  );

  useEffectOnce(() => {
    window.addEventListener('click', clickAway);
    return () => window.addEventListener('click', clickAway);
  });

  const handleMoreNotifications = () => {
    let endpoint: string = '';
    if (notifications.length === 0) {
      endpoint = `/notifications/?page=0`;
    } else {
      endpoint = `/notifications/?page=${page}`;
    }
    fetchNotifications(endpoint);
  };
  const deleteNotification = async (id: number) => {
    try {
      filterNotifications(id);
      await http.delete(`/notifications/${id}/`);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };
  return (
    <div
      ref={menuRef}
      style={{ top, left }}
      className={`${notificationsStyles.container} ${notificationsStyles.overflowScroll}`}
    >
      <h3>Notifications</h3>
      {notifications.map((notification) => {
        return (
          <div key={notification.id} className={notificationsStyles.notification}>
            <div
              className={notificationsStyles.closeIcon}
              onClick={() => deleteNotification(notification.id)}
            >
              <AiOutlineClose color="silver" />
            </div>
            <img src={notification.backdrop_path} alt="movie" />
            <div>
              <p className={notificationsStyles.text}>{notification.text}</p>
              <p className={notificationsStyles.readable_date}>
                {notification.readable_date}
              </p>
            </div>
          </div>
        );
      })}

      {hasNext && (
        <div
          className={notificationsStyles.loadMoreBtn}
          onClick={handleMoreNotifications}
        >
          <p>Older notifications...</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
