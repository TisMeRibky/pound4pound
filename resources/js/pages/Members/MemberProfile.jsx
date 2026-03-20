import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const STATUS_COLORS = {
  active:    'bg-emerald-100 text-emerald-700',
  expired:   'bg-rose-100 text-rose-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

export default function MemberProfile({ onSuccess }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member,    setMember]    = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message,   setMessage]   = useState('');
  const [formData,  setFormData]  = useState({
    first_name: '', last_name: '', email: '', phone: '', status: '',
  });

  // Training sub edit state
  const [editingSub,  setEditingSub]  = useState(null);
  const [subFormData, setSubFormData] = useState({ plan_id: '', start_date: '', end_date: '' });
  const [plans,       setPlans]       = useState([]);
  const [subMessage,  setSubMessage]  = useState('');

  // Walk-in edit state
  const [editingWalkIn,  setEditingWalkIn]  = useState(null);
  const [walkInFormData, setWalkInFormData] = useState({ date: '', amount: '', notes: '' });
  const [walkInMessage,  setWalkInMessage]  = useState('');

  const token = localStorage.getItem('token');

  const fetchMember = () => {
    fetch(`/api/members/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setMember(data);
        setFormData({
          first_name: data.first_name,
          last_name:  data.last_name,
          email:      data.email,
          phone:      data.phone || '',
          status:     data.status,
        });
      })
      .catch(console.error);
  };

  useEffect(() => { fetchMember(); }, [id]);

  useEffect(() => {
    fetch('/api/plans', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setPlans(d.data?.filter(p => p.is_active) || []))
      .catch(console.error);
  }, []);

  // ── Member edit ──────────────────────────────────────────
  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.message || 'Update failed'); return; }
      setMember(prev => ({ ...prev, ...data }));
      setMessage('Member updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      setIsEditing(false);
      if (onSuccess) onSuccess();
    } catch (err) { console.error(err); setMessage('Server error'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = {};
      if (res.status !== 204) data = await res.json().catch(() => ({}));
      alert(data.message || 'Member deleted successfully!');
      navigate(-1);
      if (onSuccess) onSuccess();
    } catch (err) { console.error(err); alert('Server error.'); }
  };

  // ── Training sub edit ────────────────────────────────────
  const openEditSub = (sub) => {
    setEditingSub(sub);
    setSubFormData({ plan_id: sub.plan?.id || '', start_date: sub.start_date || '', end_date: sub.end_date || '' });
    setSubMessage('');
  };

  const handleSubPlanChange = (planId) => {
    const plan = plans.find(p => String(p.id) === String(planId));
    const newEndDate = plan && subFormData.start_date
      ? new Date(new Date(subFormData.start_date).getTime() + plan.duration_days * 86400000).toISOString().split('T')[0]
      : subFormData.end_date;
    setSubFormData(p => ({ ...p, plan_id: planId, end_date: newEndDate }));
  };

  const handleSubStartDateChange = (startDate) => {
    const plan = plans.find(p => String(p.id) === String(subFormData.plan_id));
    const newEndDate = plan && startDate
      ? new Date(new Date(startDate).getTime() + plan.duration_days * 86400000).toISOString().split('T')[0]
      : subFormData.end_date;
    setSubFormData(p => ({ ...p, start_date: startDate, end_date: newEndDate }));
  };

  const handleUpdateSub = async (e) => {
    e.preventDefault();
    setSubMessage('');
    try {
      const res = await fetch(`/api/training-subscriptions/${editingSub.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(subFormData),
      });
      const data = await res.json();
      if (!res.ok) { setSubMessage(data.message || 'Update failed'); return; }
      setSubMessage('Subscription updated!');
      setTimeout(() => { setEditingSub(null); fetchMember(); }, 1000);
    } catch (err) { console.error(err); setSubMessage('Server error'); }
  };

  const handleDeleteSub = async (subId) => {
    if (!window.confirm('Delete this training subscription? The payment record will be kept.')) return;
    try {
      await fetch(`/api/training-subscriptions/${subId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMember();
    } catch (err) { console.error(err); alert('Server error.'); }
  };

  // ── Walk-in edit ─────────────────────────────────────────
  const openEditWalkIn = (w) => {
    setEditingWalkIn(w);
    setWalkInFormData({ date: w.date || '', amount: w.amount || '', notes: w.notes || '' });
    setWalkInMessage('');
  };

  const handleUpdateWalkIn = async (e) => {
    e.preventDefault();
    setWalkInMessage('');
    try {
      const res = await fetch(`/api/walk-ins/${editingWalkIn.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(walkInFormData),
      });
      const data = await res.json();
      if (!res.ok) { setWalkInMessage(data.message || 'Update failed'); return; }
      setWalkInMessage('Walk-in updated!');
      setTimeout(() => { setEditingWalkIn(null); fetchMember(); }, 1000);
    } catch (err) { console.error(err); setWalkInMessage('Server error'); }
  };

  const handleDeleteWalkIn = async (walkInId) => {
    if (!window.confirm('Delete this walk-in record? The payment record will be kept.')) return;
    try {
      await fetch(`/api/walk-ins/${walkInId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMember();
    } catch (err) { console.error(err); alert('Server error.'); }
  };

  if (!member) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400 animate-pulse">Loading...</div>
    </div>
  );

  const statusBadge = member.status === 'Active'
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-rose-100 text-rose-700';

  const walkIns = member.walk_ins ?? [];

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <button className="mb-5 text-sm text-blue-500 hover:underline" onClick={() => navigate(-1)}>
        ← Back to Members
      </button>

      {message && (
        <div className="mb-4 text-sm text-center font-medium text-green-600">{message}</div>
      )}

      {/* ── Member Info Card ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#03023B]">
              {member.first_name} {member.last_name}
            </h1>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge}`}>
              {member.status}
            </span>
          </div>
          {!isEditing && (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(true)}
                className="bg-[#03023B] text-white text-sm px-4 py-2 rounded hover:bg-[#FFDE59] hover:text-black transition">
                Edit
              </button>
              <button onClick={handleDelete}
                className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="grid grid-cols-2 gap-3">
            <InfoRow label="Email" value={member.email} />
            <InfoRow label="Phone" value={member.phone || '—'} />
          </div>
        )}

        {isEditing && (
          <form onSubmit={handleUpdate} className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <input name="first_name" value={formData.first_name} onChange={handleChange}
                placeholder="First Name" className="border px-3 py-2 rounded w-full text-sm" required />
              <input name="last_name" value={formData.last_name} onChange={handleChange}
                placeholder="Last Name" className="border px-3 py-2 rounded w-full text-sm" required />
              <input name="email" value={formData.email} onChange={handleChange}
                placeholder="Email" type="email" className="border px-3 py-2 rounded w-full text-sm" required />
              <input name="phone" value={formData.phone} onChange={handleChange}
                placeholder="Phone" className="border px-3 py-2 rounded w-full text-sm" />
            </div>
            <select name="status" value={formData.status} onChange={handleChange}
              className="border px-3 py-2 rounded w-full text-sm">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="flex gap-2">
              <button type="submit"
                className="bg-[#03023B] text-white px-4 py-2 text-sm rounded hover:bg-[#FFDE59] hover:text-black transition">
                Save Changes
              </button>
              <button type="button" onClick={() => setIsEditing(false)}
                className="bg-gray-100 text-gray-600 px-4 py-2 text-sm rounded hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Membership Card ── */}
      {member.membership && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Annual Membership</h2>
          <div className="grid grid-cols-2 gap-3">
            <InfoRow label="Start Date" value={new Date(member.membership.start_date).toLocaleDateString()} />
            <InfoRow label="End Date" value={member.membership.end_date
              ? new Date(member.membership.end_date).toLocaleDateString() : '—'} />
          </div>
        </div>
      )}

      {/* ── Training Subscriptions ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Training Subscriptions</h2>

        {!member.training_subscriptions?.length ? (
          <p className="text-sm text-gray-400 text-center py-4">No training subscriptions yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {member.training_subscriptions.map(sub => (
              <div key={sub.id} className="border border-gray-100 rounded-lg p-4">
                {editingSub?.id !== sub.id ? (
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#03023B] text-sm">{sub.plan?.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[sub.status] || 'bg-gray-100 text-gray-500'}`}>
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {sub.plan?.program?.name && `${sub.plan.program.name} · `}
                        {sub.start_date} → {sub.end_date}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditSub(sub)}
                        className="text-xs bg-[#03023B] text-white px-3 py-1.5 rounded hover:bg-[#FFDE59] hover:text-black transition">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteSub(sub.id)}
                        className="text-xs bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateSub} className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Edit Subscription</p>
                    {subMessage && (
                      <p className={`text-xs font-medium ${subMessage.includes('updated') ? 'text-green-600' : 'text-red-500'}`}>
                        {subMessage}
                      </p>
                    )}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Plan</label>
                      <select value={subFormData.plan_id} onChange={e => handleSubPlanChange(e.target.value)}
                        className="border px-3 py-2 rounded text-sm" required>
                        <option value="">Select a plan</option>
                        {plans.map(p => <option key={p.id} value={p.id}>{p.name} — ₱{p.price}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Start Date</label>
                        <input type="date" value={subFormData.start_date}
                          onChange={e => handleSubStartDateChange(e.target.value)}
                          className="border px-3 py-2 rounded text-sm" required />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                          End Date <span className="text-gray-300 normal-case font-normal">(auto)</span>
                        </label>
                        <input type="date" value={subFormData.end_date} readOnly
                          className="border px-3 py-2 rounded text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit"
                        className="bg-[#03023B] text-white text-xs px-4 py-2 rounded hover:bg-[#FFDE59] hover:text-black transition">
                        Save
                      </button>
                      <button type="button" onClick={() => setEditingSub(null)}
                        className="bg-gray-100 text-gray-600 text-xs px-4 py-2 rounded hover:bg-gray-200 transition">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Walk-in History ── */}
      {walkIns.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Walk-in History</h2>
            <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              {walkIns.length} visit{walkIns.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
            {walkIns.map(w => (
              <div key={w.id} className="border border-gray-100 rounded-lg p-3">

                {/* View mode */}
                {editingWalkIn?.id !== w.id ? (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-[#03023B]">{w.date}</p>
                      {w.notes && <p className="text-xs text-gray-400">{w.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        w.has_membership ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {w.has_membership ? 'Member rate' : 'Standard rate'}
                      </span>
                      <span className="text-sm font-bold text-emerald-600">
                        ₱{Number(w.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </span>
                      <button onClick={() => openEditWalkIn(w)}
                        className="text-xs bg-[#03023B] text-white px-3 py-1.5 rounded hover:bg-[#FFDE59] hover:text-black transition">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteWalkIn(w.id)}
                        className="text-xs bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Edit mode */
                  <form onSubmit={handleUpdateWalkIn} className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Edit Walk-in</p>
                    {walkInMessage && (
                      <p className={`text-xs font-medium ${walkInMessage.includes('updated') ? 'text-green-600' : 'text-red-500'}`}>
                        {walkInMessage}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Date</label>
                        <input type="date" value={walkInFormData.date}
                          onChange={e => setWalkInFormData(p => ({ ...p, date: e.target.value }))}
                          className="border px-3 py-2 rounded text-sm" required />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Amount</label>
                        <input type="number" value={walkInFormData.amount}
                          onChange={e => setWalkInFormData(p => ({ ...p, amount: e.target.value }))}
                          className="border px-3 py-2 rounded text-sm" required />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Notes</label>
                      <input type="text" value={walkInFormData.notes}
                        onChange={e => setWalkInFormData(p => ({ ...p, notes: e.target.value }))}
                        placeholder="Optional notes"
                        className="border px-3 py-2 rounded text-sm" />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit"
                        className="bg-[#03023B] text-white text-xs px-4 py-2 rounded hover:bg-[#FFDE59] hover:text-black transition">
                        Save
                      </button>
                      <button type="button" onClick={() => setEditingWalkIn(null)}
                        className="bg-gray-100 text-gray-600 text-xs px-4 py-2 rounded hover:bg-gray-200 transition">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold text-[#03023B]">{value}</span>
    </div>
  );
}