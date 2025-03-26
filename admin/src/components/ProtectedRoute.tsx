import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetLoggedInAdminQuery } from '../features/auth/authApi';
import { setAdmin, clearAdmin } from '../features/auth/authSlice';
import { RootState } from '../store';

const ProtectedRoutes = () => {
  const dispatch = useDispatch();
  const { admin } = useSelector((state: RootState) => state.auth);
  const { data, isError } = useGetLoggedInAdminQuery(undefined, {
    skip: !!admin, // Skip fetching if admin is already set
  });

  useEffect(() => {
    if (data) {
      dispatch(setAdmin(data)); // Restore session on refresh
    }
    if (isError) {
      dispatch(clearAdmin()); // Clear session on error
    }
  }, [data, isError, dispatch]);

  if (admin) return <Outlet />; // Allow access

  return <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
