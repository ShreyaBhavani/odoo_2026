import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeAPI, salaryAPI, attendanceAPI } from '../services/api';
import './HRDashboard.css';

const HRDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [activeProfileTab, setActiveProfileTab] = useState('resume');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeSalary, setSelectedEmployeeSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [dayCursor, setDayCursor] = useState(new Date());
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchAttendance();
    }
  }, [activeTab]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      const all = response.data.data || [];
      setEmployees(all);
      if (all.length > 0) {
        handleSelectEmployee(all[0]);
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
    try {
      const salaryResponse = await salaryAPI.get(employee._id);
      setSelectedEmployeeSalary(salaryResponse.data.data);
    } catch (err) {
      setSelectedEmployeeSalary(null);
    }
  };

  const fetchAttendance = async () => {
    setAttendanceLoading(true);
    try {
      const response = await attendanceAPI.getAll();
      setAttendance(response.data.data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendance([]);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const sameDay = (a, b) => {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  const filteredAttendance = attendance.filter((item) => {
    const employeeName = item.employeeId?.name?.toLowerCase() || '';
    const search = attendanceSearch.toLowerCase();
    const dateMatch = item.date ? sameDay(new Date(item.date), dayCursor) : true;
    return employeeName.includes(search) && dateMatch;
  });

  const statusCounts = filteredAttendance.reduce(
    (acc, item) => {
      if (item.status === 'present') acc.present += 1;
      else if (item.status === 'on-leave') acc.onLeave += 1;
      else if (item.status === 'absent') acc.absent += 1;
      else acc.unknown += 1;
      return acc;
    },
    { present: 0, onLeave: 0, absent: 0, unknown: 0 }
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#48bb78';
      case 'on-leave':
        return '#ed8936';
      case 'absent':
        return '#ecc94b';
      default:
        return '#cbd5e0';
    }
  };

  const changeDay = (delta) => {
    const next = new Date(dayCursor);
    next.setDate(dayCursor.getDate() + delta);
    setDayCursor(next);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="error">Access Denied. Admin only.</div>;
  }

  return (
    <div className="hr-dashboard">
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

      <div className="hr-nav">
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
          Attendance
        </button>
      </div>

      {activeTab === 'employees' && (
        <div className="hr-container">
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
                  <div
                    className="status-dot"
                    style={{ backgroundColor: emp.isPresent ? '#48bb78' : '#cbd5e0' }}
                  ></div>
                </div>
              ))}
            </div>
          </main>

          <aside className="hr-right">
            {selectedEmployee && (
              <>
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
      )}

      {activeTab === 'attendance' && (
        <div className="hr-attendance">
          <div className="attendance-top">
            <div>
              <h2>Attendance Overview</h2>
              <p>Day view with live employee records</p>
            </div>
            <div className="attendance-actions">
              <button onClick={() => changeDay(-1)} aria-label="Previous day">◀</button>
              <div className="day-chip">{dayCursor.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
              <button onClick={() => changeDay(1)} aria-label="Next day">▶</button>
              <input
                type="text"
                placeholder="Search employee..."
                value={attendanceSearch}
                onChange={(e) => setAttendanceSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="attendance-note">
            <strong>Note:</strong> Attendance is the base for payslip and payable days. Missing days reduce payable days automatically. Admin can see all employees with default month/day view.
          </div>

          <div className="attendance-stats admin">
            <div className="stat-card">
              <span className="stat-label">Present</span>
              <span className="stat-value">{statusCounts.present}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">On leave</span>
              <span className="stat-value">{statusCounts.onLeave}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Absent</span>
              <span className="stat-value">{statusCounts.absent}</span>
            </div>
          </div>

          {attendanceLoading ? (
            <div className="loading">Loading attendance...</div>
          ) : (
            <div className="attendance-table admin">
              <div className="attendance-table-head">
                <span>Employee</span>
                <span>Date</span>
                <span>Check In</span>
                <span>Check Out</span>
                <span>Work Hours</span>
                <span>Extra Hours</span>
                <span>Status</span>
              </div>

              {filteredAttendance.map((item) => {
                const workHours = item.totalHours || 0;
                const extra = Math.max((item.totalHours || 0) - 8, 0);
                const dateLabel = item.date ? new Date(item.date).toLocaleDateString() : '-';
                return (
                  <div key={item._id} className="attendance-row">
                    <span>{item.employeeId?.name || 'N/A'}</span>
                    <span>{dateLabel}</span>
                    <span>{item.checkIn ? new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                    <span>{item.checkOut ? new Date(item.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                    <span>{workHours.toFixed(2)} hrs</span>
                    <span>{extra.toFixed(2)} hrs</span>
                    <span>
                      <span className="status-dot" style={{ backgroundColor: getStatusColor(item.status) }}></span>
                      {item.status || 'N/A'}
                    </span>
                  </div>
                );
              })}

              {filteredAttendance.length === 0 && (
                <div className="empty-state">No attendance records found.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
