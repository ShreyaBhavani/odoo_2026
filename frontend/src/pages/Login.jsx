import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [role, setRole] = useState('employee');
  const [credentials, setCredentials] = useState({ loginId: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    loginId: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    employeeName: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(credentials);
      // Redirect based on role
      if (result.user.role === 'admin') {
        navigate('/hr-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        loginId: signupData.loginId,
        email: signupData.email,
        password: signupData.password,
        role: role,
        employeeName: signupData.employeeName
      });
      
      // Show success message and switch to signin
      setSignupSuccess(true);
      setSignupData({ loginId: '', email: '', password: '', confirmPassword: '', employeeName: '' });
      setError('');
      
      setTimeout(() => {
        setActiveTab('signin');
        setCredentials({ loginId: signupData.loginId, password: '' });
        setSignupSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Employee Management</h1>
          <p>Choose your role and {activeTab === 'signin' ? 'sign in' : 'create account'}</p>
        </div>

        {/* Role Selection */}
        <div className="role-tabs">
          <button 
            className={role === 'employee' ? 'role-tab active' : 'role-tab'}
            onClick={() => setRole('employee')}
          >
            👤 Employee
          </button>
          <button 
            className={role === 'admin' ? 'role-tab active' : 'role-tab'}
            onClick={() => setRole('admin')}
          >
            👔 HR / Admin
          </button>
        </div>

        {/* Sign In / Sign Up Tabs */}
        <div className="auth-tabs">
          <button 
            className={activeTab === 'signin' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => { setActiveTab('signin'); setError(''); }}
          >
            Sign In
          </button>
          <button 
            className={activeTab === 'signup' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => { setActiveTab('signup'); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {signupSuccess && <div className="success-message">✅ Account created! Redirecting to signin...</div>}

        {/* Sign In Form */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="login-form">
            <div className="form-group">
              <label>Login ID</label>
              <input
                type="text"
                value={credentials.loginId}
                onChange={(e) => setCredentials({ ...credentials, loginId: e.target.value })}
                placeholder="Enter your login ID"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="login-footer">
              <p>Demo Credentials:</p>
              <p>{role === 'admin' ? 'Admin: admin / admin123' : 'Employee: sheep / password123'}</p>
            </div>
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="login-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={signupData.employeeName}
                onChange={(e) => setSignupData({ ...signupData, employeeName: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Login ID</label>
              <input
                type="text"
                value={signupData.loginId}
                onChange={(e) => setSignupData({ ...signupData, loginId: e.target.value })}
                placeholder="Choose a login ID"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                placeholder="Create a password (min 6 characters)"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className="login-footer">
              <p>Creating account as: <strong>{role === 'admin' ? 'HR/Admin' : 'Employee'}</strong></p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
