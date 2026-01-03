import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeProfile from './pages/EmployeeProfile';
import MyProfile from './pages/MyProfile';
import HRDashboard from './pages/HRDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute employeeOnly={true}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hr-dashboard" 
            element={
              <ProtectedRoute adminOnly={true}>
                <HRDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/:id" 
            element={
              <ProtectedRoute>
                <EmployeeProfile />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
