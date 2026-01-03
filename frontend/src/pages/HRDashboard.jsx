import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeAPI, salaryAPI } from '../services/api';
import './HRDashboard.css';

const HRDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [activeProfileTab, setActiveProfileTab] = useState('resume');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeSalary, setSelectedEmployeeSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
      if (response.data.data.length > 0) {
        handleSelectEmployee(response.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmployee = async (employee) => {
    setSelectedEmployee(employee);
    setActiveProfileTab('resume');
    
    // Fetch salary info if available
    try {
      const salaryResponse = await salaryAPI.get(employee._id);
      setSelectedEmployeeSalary(salaryResponse.data.data);
    } catch (err) {
      setSelectedEmployeeSalary(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="error">Access Denied. Admin only.</div>;
  }

  return (
    <div className="hr-dashboard">
      {/* Header */}
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

      <div className="hr-container">
        {/* Left Sidebar - Profile */}
        <aside className="hr-sidebar">
          {selectedEmployee && (
            <div className="profile-section">
              <div className="profile-avatar-section">
                <img 
                  src={selectedEmployee.avatar || 'https://via.placeholder.com/120'} 
                  alt={selectedEmployee.name}
                  className="profile-avatar"
                />
                <h2>{selectedEmployee.name}</h2>
                <p className="department">{selectedEmployee.department || 'Employee'}</p>
              </div>

              <div className="profile-tabs-list">
                <button 
                  className={activeProfileTab === 'resume' ? 'active' : ''}
                  onClick={() => setActiveProfileTab('resume')}
                >
                  Resume
                </button>
                <button 
                  className={activeProfileTab === 'private' ? 'active' : ''}
                  onClick={() => setActiveProfileTab('private')}
                >
                  Private Info
                </button>
                <button 
                  className={activeProfileTab === 'salary' ? 'active' : ''}
                  onClick={() => setActiveProfileTab('salary')}
                >
                  Salary Info
                </button>
                <button 
                  className={activeProfileTab === 'security' ? 'active' : ''}
                  onClick={() => setActiveProfileTab('security')}
                >
                  Security
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Middle - Employee List */}
        <main className="hr-main">
          <div className="main-header">
            <h3>Employees</h3>
          </div>

          <div className="employee-list">
            {employees.map((emp) => (
              <div 
                key={emp._id}
                className={`employee-item ${selectedEmployee?._id === emp._id ? 'active' : ''}`}
                onClick={() => handleSelectEmployee(emp)}
              >
                <img 
                  src={emp.avatar || 'https://via.placeholder.com/50'} 
                  alt={emp.name}
                  className="emp-avatar"
                />
                <div className="emp-info">
                  <p className="emp-name">{emp.name}</p>
                  <p className="emp-role">{emp.department || 'Employee'}</p>
                </div>
                <div className="status-dot" style={{
                  backgroundColor: emp.isPresent ? '#48bb78' : '#cbd5e0'
                }}></div>
              </div>
            ))}
          </div>
        </main>

        {/* Right - Profile Content & Salary */}
        <aside className="hr-right">
          {selectedEmployee && (
            <>
              {/* Profile Content */}
              <div className="profile-content">
                {activeProfileTab === 'resume' && (
                  <div className="tab-content">
                    <h4>My Name</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Login ID</label>
                        <p>{selectedEmployee.email}</p>
                      </div>
                      <div className="info-item">
                        <label>Company</label>
                        <p>{selectedEmployee.company || 'N/A'}</p>
                      </div>
                      <div className="info-item">
                        <label>Email</label>
                        <p>{selectedEmployee.email}</p>
                      </div>
                      <div className="info-item">
                        <label>Department</label>
                        <p>{selectedEmployee.department || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'private' && (
                  <div className="tab-content">
                    <h4>Private Information</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Mobile</label>
                        <p>{selectedEmployee.mobile || 'N/A'}</p>
                      </div>
                      <div className="info-item">
                        <label>Email</label>
                        <p>{selectedEmployee.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'salary' && (
                  <div className="tab-content">
                    <h4>Salary Information</h4>
                    {selectedEmployeeSalary ? (
                      <>
                        <div className="salary-info-note">
                          <strong>Important:</strong> Salary Info tab should only be visible to Admin. All salary-related data is managed and calculated automatically based on the employee's defined wage.
                        </div>

                        <div className="salary-summary">
                          <div className="salary-item">
                            <label>Month Wage</label>
                            <p className="wage">₹{selectedEmployeeSalary.monthlyWage?.toLocaleString()}</p>
                            <span>/ Month</span>
                          </div>
                          <div className="salary-item">
                            <label>Yearly wage</label>
                            <p className="wage">₹{selectedEmployeeSalary.yearlyWage?.toLocaleString()}</p>
                            <span>/ Year</span>
                          </div>
                          <div className="salary-item">
                            <label>No of working days</label>
                            <p className="wage">in a week:</p>
                            <span>{selectedEmployeeSalary.workingDaysPerWeek}</span>
                          </div>
                        </div>

                        <h5>Salary Components</h5>
                        <div className="salary-components">
                          {Object.entries(selectedEmployeeSalary.components || {}).map(([key, value]) => (
                            <div key={key} className="component-row">
                              <span className="component-name">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="component-amount">₹{value.amount?.toLocaleString() || 0}</span>
                              <span className="component-percentage">{value.percentage || 0}%</span>
                            </div>
                          ))}
                        </div>

                        <h5>Provident Fund (PF) Contribution</h5>
                        <div className="pf-section">
                          <div className="pf-row">
                            <span>Employee Contribution</span>
                            <span>₹{selectedEmployeeSalary.providentFund?.employee?.toLocaleString() || 0}</span>
                          </div>
                          <div className="pf-row">
                            <span>Employer Contribution</span>
                            <span>₹{selectedEmployeeSalary.providentFund?.employer?.toLocaleString() || 0}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p>No salary information available</p>
                    )}
                  </div>
                )}

                {activeProfileTab === 'security' && (
                  <div className="tab-content">
                    <h4>Security Information</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>PAN No</label>
                        <p>{selectedEmployee.resume?.panNo || 'N/A'}</p>
                      </div>
                      <div className="info-item">
                        <label>UAN No</label>
                        <p>{selectedEmployee.resume?.uanNo || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
};

export default HRDashboard;
