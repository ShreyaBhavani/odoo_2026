import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [role, setRole] = useState('employee');
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup' (for HR)
  const [credentials, setCredentials] = useState({ loginId: '', password: '' });
  const [signupData, setSignupData] = useState({ company: '', name: '', email: '', phone: '', password: '', confirmPassword: '', avatar: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      if (signupData.password !== signupData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if ((signupData.password || '').length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      // derive a safe loginId: prefer name, fallback to email prefix
      const derivedLoginId = signupData.name
        ? signupData.name.split(' ').join('').toLowerCase()
        : (signupData.email ? signupData.email.split('@')[0] : '');
      if (!derivedLoginId) {
        setError('Please provide a name or a valid email to generate login ID');
        setLoading(false);
        return;
      }
      // register is available on AuthContext
      await register({
        loginId: derivedLoginId,
        email: signupData.email,
        password: signupData.password,
        role: 'hr',
        company: signupData.company,
        phone: signupData.phone
      });
      // after signup, redirect to HR dashboard
      navigate('/hr-dashboard');
    } catch (err) {
      // Prefer validation errors from backend
      const resp = err.response?.data;
      if (resp) {
        if (resp.errors && resp.errors.length) {
          setError(resp.errors[0].msg || resp.message || 'Validation failed');
        } else if (resp.message) {
          setError(resp.message);
        } else {
          setError('Signup failed');
        }
      } else {
        setError('Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Employee Management</h1>
          <p>Choose your role and sign in</p>
        </div>

        {/* Role Selection */}
        <div className="role-tabs">
          <button 
            className={role === 'employee' ? 'role-tab active' : 'role-tab'}
            onClick={() => { setRole('employee'); setMode('signin'); }}
          >
            👤 Employee
          </button>
          <button 
            className={role === 'admin' ? 'role-tab active' : 'role-tab'}
            onClick={() => { setRole('admin'); setMode('signin'); }}
          >
            👔 HR / Admin
          </button>
        </div>

        {/* For HR role show Sign In / Sign Up tabs */}
        {role === 'admin' && (
          <div className="auth-tabs">
            <button className={mode === 'signin' ? 'auth-tab active' : 'auth-tab'} onClick={() => setMode('signin')}>Sign In</button>
            <button className={mode === 'signup' ? 'auth-tab active' : 'auth-tab'} onClick={() => setMode('signup')}>Sign Up</button>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {role === 'employee' && (
          <div className="signup-note" style={{ margin: '10px 0', color: '#444', textAlign: 'center' }}>
            Employees cannot sign up — contact HR to create an account.
          </div>
        )}

        {/* Sign In / Sign Up Forms */}
        {role === 'employee' ? (
          // Employee: only show Sign In
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
          </form>
        ) : (
          // HR / Admin: show Sign In or Sign Up based on `mode`
          (mode === 'signin') ? (
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
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="login-form">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={signupData.company}
                  onChange={(e) => setSignupData({ ...signupData, company: e.target.value })}
                  placeholder="Company name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  placeholder="Your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  placeholder="Choose a password"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  placeholder="Confirm password"
                  required
                />
              </div>

              <div className="form-group">
                <label>Upload Logo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSignupData({ ...signupData, avatar: e.target.files[0] || null })}
                />
              </div>

              {/* Admin signup code removed — admin creation handled via backend scripts */}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>

              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <small>Already have an account? <button type="button" className="link-button" onClick={() => setMode('signin')}>Sign In</button></small>
              </div>

            </form>
          )
        )}
      </div>
    </div>
  );
};

export default Login;
