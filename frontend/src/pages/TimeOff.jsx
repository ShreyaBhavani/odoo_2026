import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { timeOffAPI } from '../services/api';
import './TimeOff.css';

const TimeOff = ({ isAdmin }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ startDate: '', endDate: '', type: 'paid', reason: '' });
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    try {
      const res = isAdmin ? await timeOffAPI.getAll() : await timeOffAPI.getMine();
      setRequests(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await timeOffAPI.create(form);
      setForm({ startDate: '', endDate: '', type: 'paid', reason: '' });
      await fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    await timeOffAPI.approve(id);
    await fetch();
  };

  const handleReject = async (id) => {
    await timeOffAPI.reject(id);
    await fetch();
  };

  return (
    <div className="timeoff-container">
      {!isAdmin && (
        <form className="timeoff-form" onSubmit={handleSubmit}>
          <h3>New Time Off Request</h3>
          <label>Start Date<input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required/></label>
          <label>End Date<input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} required/></label>
          <label>Type<select value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="paid">Paid</option><option value="sick">Sick</option><option value="unpaid">Unpaid</option></select></label>
          <label>Reason<textarea value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}></textarea></label>
          <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Submit'}</button>
        </form>
      )}

      <div className="timeoff-list">
        <h3>{isAdmin ? 'All Time Off Requests' : 'My Time Off Requests'}</h3>
        {requests.map(r => (
          <div key={r._id} className="timeoff-item">
            <div className="left">
              <strong>{r.employeeName || (r.employeeId?.name)}</strong>
              <div>{new Date(r.startDate).toLocaleDateString()} → {new Date(r.endDate).toLocaleDateString()}</div>
              <div>Type: {r.type} • Status: {r.status}</div>
              <div>Reason: {r.reason}</div>
            </div>
            {isAdmin && (
              <div className="actions">
                {r.status === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(r._id)}>Approve</button>
                    <button onClick={() => handleReject(r._id)}>Reject</button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        {requests.length === 0 && <div className="empty">No requests found.</div>}
      </div>
    </div>
  );
};

export default TimeOff;
