import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetLoggedInAdminQuery } from '../features/auth/authApi';
import { setAdmin, clearAdmin } from '../features/auth/authSlice';
import { RootState } from '../store';

const ProtectedRoutes = () => {
  const dispatch = useDispatch();
  const { admin, isLoggingOut } = useSelector((state: RootState) => state.auth);

  // Skip fetching when logging out or when admin is already set
  const { data, isError } = useGetLoggedInAdminQuery(undefined, {
    skip: isLoggingOut || !!admin,
  });

  useEffect(() => {
    if (!admin && !isLoggingOut) {
      if (data) {
        dispatch(setAdmin(data)); // Restore session on refresh
      }
      if (isError) {
        dispatch(clearAdmin()); // Clear session on error
      }
    }
  }, [data, isError, dispatch, isLoggingOut]);

  if (admin) return <Outlet />; // Allow access

  return <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
