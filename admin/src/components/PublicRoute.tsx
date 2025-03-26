import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const PublicRoute = () => {
  const { admin } = useSelector((state: RootState) => state.auth);

  return admin ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
