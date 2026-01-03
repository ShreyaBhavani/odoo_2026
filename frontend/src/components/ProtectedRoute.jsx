import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, employeeOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If adminOnly is set, allow 'admin' and 'hr' roles (HR has admin-like access)
  if (adminOnly && user.role !== 'admin' && user.role !== 'hr') {
    return <Navigate to="/dashboard" replace />;
  }

  // If employeeOnly is set, only allow employees; non-employees go to HR/Admin dashboard
  if (employeeOnly && user.role !== 'employee') {
    return <Navigate to="/hr-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
