import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { attendanceAPI, employeeAPI } from "../services/api";
import TimeOff from './TimeOff';
import "./Dashboard.css";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("employees");
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [monthCursor, setMonthCursor] = useState(new Date());
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (activeTab === "attendance") {
      fetchAttendance();
    }
  }, [activeTab]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    if (!user) return;
    setAttendanceLoading(true);
    try {
      const employeeId = user.employeeId?._id || user.employeeId || user?.employee?._id;
      if (!employeeId) {
        setAttendance([]);
        return;
      }
      const response = await attendanceAPI.getByEmployee(employeeId);
      setAttendance(response.data.data || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleCheckIn = async (employeeId) => {
    try {
      await attendanceAPI.checkIn(employeeId);
      fetchEmployees();
      alert("Checked in successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to check in");
    }
  };

  const handleCheckOut = async (employeeId) => {
    try {
      await attendanceAPI.checkOut(employeeId);
      fetchEmployees();
      alert("Checked out successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to check out");
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return { color: "#48bb78", icon: "●", label: "Present" };
      case "on-leave":
        return { color: "#ed8936", icon: "✈", label: "On leave" };
      case "absent":
        return { color: "#f6ad55", icon: "●", label: "Absent" };
      default:
        return { color: "#cbd5e0", icon: "●", label: "Unknown" };
    }
  };

  const sameMonth = (dateA, dateB) => {
    return dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth();
  };

  const monthFiltered = attendance.filter((item) => {
    if (!item.date) return false;
    const d = new Date(item.date);
    return sameMonth(d, monthCursor);
  });

  const uniqueWorkingDays = new Set(monthFiltered.map((item) => new Date(item.date).toDateString())).size;
  const presentDays = monthFiltered.filter((item) => item.status === "present").length;
  const leaveDays = monthFiltered.filter((item) => item.status === "on-leave").length;

  const changeMonth = (delta) => {
    const next = new Date(monthCursor);
    next.setMonth(monthCursor.getMonth() + delta);
    setMonthCursor(next);
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
                  <button onClick={() => navigate("/profile")}>My Profile</button>
                  <button onClick={logout}>Log Out</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-nav">
        <button
          className={activeTab === "employees" ? "active" : ""}
          onClick={() => setActiveTab("employees")}
        >
          Employees
        </button>
        <button
          className={activeTab === "attendance" ? "active" : ""}
          onClick={() => setActiveTab("attendance")}
        >
          Attendance & Time Off
        </button>
        <button
          className={activeTab === "timeoff" ? "active" : ""}
          onClick={() => setActiveTab("timeoff")}
        >
          Time Off
        </button>
        {user?.role === "admin" && (
          <button
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        )}
      </div>

      <main className="dashboard-content">
        {activeTab === "employees" && (
          <>
            <div className="content-header">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {user?.role === "admin" && (
                <button className="new-button">+ NEW</button>
              )}
            </div>

            <div className="employee-grid">
              {filteredEmployees.map((employee) => (
                <div key={employee._id} className="employee-card">
                  <div className="card-header">
                    {(() => {
                      const badge = getStatusBadge(employee.status);
                      return (
                        <div
                          className="status-indicator"
                          title={badge.label}
                          style={{ backgroundColor: badge.color }}
                        >
                          {badge.icon}
                        </div>
                      );
                    })()}
                    <button className="card-menu">...</button>
                  </div>

                  <div className="card-body">
                    <img
                      src={employee.avatar || "https://via.placeholder.com/80"}
                      alt={employee.name}
                      className="employee-avatar"
                    />
                    <h3>{employee.name}</h3>
                    <p className="employee-role">{employee.department || "Employee"}</p>
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
          </>
        )}

        {activeTab === "attendance" && (
          <div className="attendance-wrapper">
            <div className="attendance-header">
              <div>
                <h2>Attendance</h2>
                <p>Live records for the selected month</p>
              </div>
              <div className="attendance-controls">
                <button onClick={() => changeMonth(-1)} aria-label="Previous month">&lt;</button>
                <span className="month-chip">{monthCursor.toLocaleString("default", { month: "short", year: "numeric" })}</span>
                <button onClick={() => changeMonth(1)} aria-label="Next month">&gt;</button>
              </div>
            </div>

            <div className="attendance-note">
              <strong>Note:</strong> Attendance data is the basis for payslip generation. Missing days reduce payable days automatically.
            </div>

            <div className="attendance-stats">
              <div className="stat-card">
                <span className="stat-label">Count of days present</span>
                <span className="stat-value">{presentDays}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Leaves count</span>
                <span className="stat-value">{leaveDays}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Total working days</span>
                <span className="stat-value">{uniqueWorkingDays}</span>
              </div>
            </div>

            {attendanceLoading ? (
              <div className="loading">Loading attendance...</div>
            ) : (
              <div className="attendance-table">
                <div className="attendance-table-head">
                  <span>Date</span>
                  <span>Check In</span>
                  <span>Check Out</span>
                  <span>Work Hours</span>
                  <span>Extra Hours</span>
                </div>
                {monthFiltered.map((item) => {
                  const workHours = item.totalHours || 0;
                  const extra = Math.max((item.totalHours || 0) - 8, 0);
                  const dateLabel = item.date ? new Date(item.date).toLocaleDateString() : "-";
                  return (
                    <div key={item._id} className="attendance-row">
                      <span>{dateLabel}</span>
                      <span>{item.checkIn ? new Date(item.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}</span>
                      <span>{item.checkOut ? new Date(item.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}</span>
                      <span>{workHours.toFixed(2)} hrs</span>
                      <span>{extra.toFixed(2)} hrs</span>
                    </div>
                  );
                })}

                {monthFiltered.length === 0 && (
                  <div className="empty-state">No attendance records found.</div>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === 'timeoff' && (
          <div style={{padding:20}}>
            <TimeOff isAdmin={user?.role === 'admin'} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
