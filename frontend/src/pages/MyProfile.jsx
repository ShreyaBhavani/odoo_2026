import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const employeeId = user?.employeeId?._id || user?.employeeId || user?.employee?._id;
    if (employeeId) {
      navigate(`/employee/${employeeId}`, { replace: true });
    } else {
      // fallback to dashboard
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return null;
};

export default MyProfile;
