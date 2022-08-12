import { useLocation, Navigate } from 'react-router-dom';
import { retreiveTokens } from '../../helpers/utils';
interface Props {
  children: JSX.Element;
}

const RequireAuth: React.FC<Props> = ({ children }): JSX.Element => {
  const location = useLocation();

  if (retreiveTokens()?.access_token) {
    return children;
  } else {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }
};

export default RequireAuth;
