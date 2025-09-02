import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import {
  isAuthCheckedSelector,
  loginUserRequestSelector
} from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  noAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({ noAuth, children }: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const loginUserRequest = useSelector(loginUserRequestSelector);
  const location = useLocation();

  if (!isAuthChecked && loginUserRequest) {
    console.log('User is not authenticated, redirecting to login page');
    return <Preloader />;
  }

  if (!noAuth && !isAuthChecked) {
    console.log('User is not authenticated, redirecting to login page');
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (noAuth && isAuthChecked) {
    console.log('User is authenticated, redirecting to home page');
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} state={location} />;
  }

  return children;
};
