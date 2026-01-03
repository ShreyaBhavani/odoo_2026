import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeAPI, attendanceAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('employees');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (employeeId) => {
    try {
      await attendanceAPI.checkIn(employeeId);
      fetchEmployees();
      alert('Checked in successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async (employeeId) => {
    try {
      await attendanceAPI.checkOut(employeeId);
      fetchEmployees();
      alert('Checked out successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to check out');
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#48bb78';
      case 'absent': return '#f56565';
      case 'on-leave': return '#ed8936';
      default: return '#cbd5e0';
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Company Logo</h1>
          <div className="header-actions">
            <div className="user-info">
              <div className="avatar">{user?.email?.[0].toUpperCase()}</div>
              <div className="dropdown">
                <button className="dropdown-toggle">{user?.loginId}</button>
                <div className="dropdown-menu">
                  <button onClick={() => navigate('/profile')}>My Profile</button>
                  <button onClick={logout}>Log Out</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-nav">
        <button 
          className={activeTab === 'employees' ? 'active' : ''}
          onClick={() => setActiveTab('employees')}
        >
          Employees
        </button>
        <button 
          className={activeTab === 'attendance' ? 'active' : ''}
          onClick={() => setActiveTab('attendance')}
        >
          Attendance & Time Off
        </button>
        {user?.role === 'admin' && (
          <button 
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        )}
      </div>

      <main className="dashboard-content">
        <div className="content-header">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {user?.role === 'admin' && (
            <button className="new-button">+ NEW</button>
          )}
        </div>

        <div className="employee-grid">
          {filteredEmployees.map((employee) => (
            <div key={employee._id} className="employee-card">
              <div className="card-header">
                <div 
                  className="status-indicator" 
                  style={{ backgroundColor: getStatusColor(employee.status) }}
                />
                <button className="card-menu">⋮</button>
              </div>
              
              <div className="card-body">
                <img 
                  src={employee.avatar || 'https://via.placeholder.com/80'} 
                  alt={employee.name}
                  className="employee-avatar"
                />
                <h3>{employee.name}</h3>
                <p className="employee-role">{employee.department || 'Employee'}</p>
              </div>

              <div className="card-actions">
                {employee.isPresent ? (
                  <button 
                    className="checkout-btn"
                    onClick={() => handleCheckOut(employee._id)}
                  >
                    Check Out →
                  </button>
                ) : (
                  <button 
                    className="checkin-btn"
                    onClick={() => handleCheckIn(employee._id)}
                  >
                    Check In
                  </button>
                )}
                <button 
                  className="view-btn"
                  onClick={() => navigate(`/employee/${employee._id}`)}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="empty-state">
            <p>No employees found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
