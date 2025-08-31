import { ReactNode } from 'react';
import {
  isAuthSelector,
  loginUserRequest
} from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';

interface ProtectedRouteProps {
  auth?: boolean;
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  auth,
  children
}) => {
  const isAuth = useSelector(isAuthSelector);
  const loginUser = useSelector(loginUserRequest);
  const location = useLocation();

  if (!isAuth && loginUser) {
    return <Preloader />;
  }

  if (!auth && !isAuth) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (auth && isAuth) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} state={location} />;
  }

  return children;
};
