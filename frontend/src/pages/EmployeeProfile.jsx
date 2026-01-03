import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeAPI, salaryAPI, attendanceAPI } from '../services/api';
import './EmployeeProfile.css';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [salary, setSalary] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [activeTab, setActiveTab] = useState('resume');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const empResponse = await employeeAPI.getById(id);
      setEmployee(empResponse.data.data);

      if (user?.role === 'admin') {
        try {
          const salResponse = await salaryAPI.get(id);
          setSalary(salResponse.data.data);
        } catch (err) {
          console.log('No salary data');
        }
      }

      const attResponse = await attendanceAPI.getByEmployee(id);
      setAttendance(attResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!employee) {
    return <div className="error">Employee not found</div>;
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <h1>Company Logo</h1>
      </header>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            <img 
              src={employee.avatar || 'https://via.placeholder.com/150'} 
              alt={employee.name}
              className="profile-avatar"
            />
            <h2>{employee.name}</h2>
            <p>{employee.department || 'Employee'}</p>
          </div>

          <div className="profile-tabs">
            <button 
              className={activeTab === 'resume' ? 'active' : ''}
              onClick={() => setActiveTab('resume')}
            >
              Resume
            </button>
            <button 
              className={activeTab === 'private' ? 'active' : ''}
              onClick={() => setActiveTab('private')}
            >
              Private Info
            </button>
            {user?.role === 'admin' && (
              <button 
                className={activeTab === 'salary' ? 'active' : ''}
                onClick={() => setActiveTab('salary')}
              >
                Salary Info
              </button>
            )}
            <button 
              className={activeTab === 'security' ? 'active' : ''}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
          </div>
        </div>

        <div className="profile-content">
          {activeTab === 'resume' && (
            <div className="tab-content">
              <h3>My Name</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Login ID</label>
                  <p>{employee.email}</p>
                </div>
                <div className="info-item">
                  <label>Company</label>
                  <p>{employee.company || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{employee.email}</p>
                </div>
                <div className="info-item">
                  <label>Department</label>
                  <p>{employee.department || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Mobile</label>
                  <p>{employee.mobile || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Manager</label>
                  <p>{employee.manager || 'N/A'}</p>
                </div>
              </div>

              <h3>About</h3>
              <p>{employee.about || 'No information provided'}</p>

              <h3>Skills</h3>
              <div className="tags">
                {employee.skills?.map((skill, idx) => (
                  <span key={idx} className="tag">{skill}</span>
                )) || <p>No skills listed</p>}
              </div>

              <h3>Book Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Date of Joining</label>
                  <p>{employee.resume?.dateOfJoining || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Marital Status</label>
                  <p>{employee.resume?.maritalStatus || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'private' && (
            <div className="tab-content">
              <h3>Private Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Mobile</label>
                  <p>{employee.privateInfo?.mobile || employee.mobile || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Work Mobile</label>
                  <p>{employee.privateInfo?.workMobile || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{employee.privateInfo?.email || employee.email}</p>
                </div>
                <div className="info-item">
                  <label>IFSC Code</label>
                  <p>{employee.privateInfo?.ipfsCode || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salary' && user?.role === 'admin' && (
            <div className="tab-content">
              <h3>Salary Information</h3>
              {salary ? (
                <>
                  <div className="salary-summary">
                    <div className="salary-card">
                      <label>Monthly Wage</label>
                      <h2>₹{salary.monthlyWage?.toLocaleString()}</h2>
                      <p>/ Month</p>
                    </div>
                    <div className="salary-card">
                      <label>Yearly Wage</label>
                      <h2>₹{salary.yearlyWage?.toLocaleString()}</h2>
                      <p>/ Month</p>
                    </div>
                    <div className="salary-card">
                      <label>Working Days</label>
                      <h2>{salary.workingDaysPerWeek}</h2>
                      <p>per week</p>
                    </div>
                  </div>

                  <h3>Salary Components</h3>
                  <div className="salary-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Component</th>
                          <th>Amount</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(salary.components || {}).map(([key, value]) => (
                          <tr key={key}>
                            <td>{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                            <td>₹{value.amount?.toLocaleString() || 0}</td>
                            <td>{value.percentage || 0}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p>No salary information available</p>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="tab-content">
              <h3>Security Settings</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>PAN No</label>
                  <p>{employee.resume?.panNo || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>UAN No</label>
                  <p>{employee.resume?.uanNo || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Emp Code</label>
                  <p>{employee.resume?.empCode || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>IFSC Code</label>
                  <p>{employee.privateInfo?.ipfsCode || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
