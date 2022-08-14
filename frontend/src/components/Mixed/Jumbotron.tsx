import { useAppSelector } from '../../app/hooks';
import jumbotronStyles from '../../styles/lists/Jumbotron.module.scss';

const Jumbotron = () => {
  const user = useAppSelector((state) => state.user.value);
  return (
    <div className={jumbotronStyles.jumbotron}>
      <div className={jumbotronStyles.contentContainer}>
        <div className={jumbotronStyles.profile}>{user.initials}</div>
        <div className={jumbotronStyles.content}>
          <p>
            {user.first_name} {user.last_name}
          </p>
          <p>Member since {user.member_since}</p>
        </div>
      </div>
    </div>
  );
};

export default Jumbotron;
