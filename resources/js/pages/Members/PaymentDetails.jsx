import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TYPE_LABELS = {
  annual_membership:     'Annual Membership',
  walk_in:               'Walk-in',
  training_subscription: 'Training Subscription',
};

const PAYMENT_TYPES = [
  { value: 'annual_membership',     label: 'Annual Membership' },
  { value: 'walk_in',               label: 'Walk-in' },
  { value: 'training_subscription', label: 'Training Subscription' },
];

const PAYMENT_METHODS = ['GCash', 'Bank Transfer', 'Cash'];

export default function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment,      setPayment]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [isEditing,    setIsEditing]    = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [message,      setMessage]      = useState('');
  const [saving,       setSaving]       = useState(false);

  const [formData, setFormData] = useState({
    amount:         '',
    payment_date:   '',
    payment_method: '',
    payment_type:   '',
    notes:          '',
  });
  const [newProofFile, setNewProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`/api/payments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        setPayment(d);
        setFormData({
          amount:         d.amount,
          payment_date:   d.payment_date || '',
          payment_method: d.payment_method || '',
          payment_type:   d.payment_type  || '',
          notes:          d.notes         || '',
        });
        setLoading(false);
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setLightboxOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewProofFile(file);
    if (!file.name.endsWith('.pdf')) {
      setProofPreview(URL.createObjectURL(file));
    } else {
      setProofPreview(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const data = new FormData();
    data.append('amount',         formData.amount);
    data.append('payment_date',   formData.payment_date);
    data.append('payment_method', formData.payment_method);
    data.append('payment_type',   formData.payment_type);
    data.append('notes',          formData.notes);
    if (newProofFile) data.append('proof', newProofFile);

    try {
      const res = await fetch(`/api/payments/${id}/update`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const json = await res.json();

      if (!res.ok) {
        setMessage(json.message || 'Update failed');
        setSaving(false);
        return;
      }

      setPayment(json.data);
      setFormData({
        amount:         json.data.amount,
        payment_date:   json.data.payment_date  || '',
        payment_method: json.data.payment_method || '',
        payment_type:   json.data.payment_type   || '',
        notes:          json.data.notes          || '',
      });
      setNewProofFile(null);
      setProofPreview(null);
      setIsEditing(false);
      setMessage('Payment updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this payment? This cannot be undone.')) return;
    try {
      await fetch(`/api/payments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  if (loading) return <div className="p-5">Loading...</div>;
  if (!payment) return <div className="p-5">Payment not found</div>;

  const currentProof    = payment.proof;
  const isImage         = currentProof && !currentProof.endsWith('.pdf');
  const newProofIsImage = newProofFile && !newProofFile.name.endsWith('.pdf');

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500 hover:underline">
        ← Back
      </button>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Payment Details</h1>
        {!isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#03023B] text-white px-4 py-2 text-sm rounded hover:bg-[#FFDE59] hover:text-black transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 text-sm rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {message && (
        <p className={`mb-4 text-sm text-center font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}

      {/* ── View Mode ── */}
      {!isEditing && (
        <>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
            <Row label="Member"         value={payment.member_name} />
            <Row label="Payment For"    value={TYPE_LABELS[payment.payment_type] || payment.payment_type || '—'} />
            {payment.notes && (
              <Row label="Notes" value={payment.notes} />
            )}
            <Row label="Payment Method" value={payment.payment_method || '—'} />
            <Row label="Amount"         value={`₱${Number(payment.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`} />
            <Row label="Date"           value={payment.payment_date} />
          </div>

          {currentProof && (
            <div className="mt-5">
              <p className="font-semibold mb-2">Proof of Payment</p>
              {isImage ? (
                <>
                  <div
                    className="cursor-zoom-in inline-block rounded-lg overflow-hidden border shadow-sm hover:opacity-90 transition"
                    onClick={() => setLightboxOpen(true)}
                  >
                    <img src={`/proof/${currentProof}`} alt="Proof"
                      className="w-48 h-48 object-cover" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Click to expand</p>
                </>
              ) : (
                <a href={`/proof/${currentProof}`} target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm">
                  View PDF
                </a>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Edit Mode ── */}
      {isEditing && (
        <form onSubmit={handleUpdate} className="space-y-3">

          <Field label="Payment For">
            <select value={formData.payment_type}
              onChange={e => setFormData(p => ({ ...p, payment_type: e.target.value }))}
              className="px-3 py-2 border rounded w-full" required>
              <option value="">Select type</option>
              {PAYMENT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Payment Method">
            <select value={formData.payment_method}
              onChange={e => setFormData(p => ({ ...p, payment_method: e.target.value }))}
              className="px-3 py-2 border rounded w-full">
              <option value="">— None —</option>
              {PAYMENT_METHODS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </Field>

          <Field label="Notes">
            <input type="text" value={formData.notes}
              onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
              className="px-3 py-2 border rounded w-full" />
          </Field>

          <Field label="Amount">
            <input type="number" value={formData.amount}
              onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
              className="px-3 py-2 border rounded w-full" required />
          </Field>

          <Field label="Date">
            <input type="date" value={formData.payment_date}
              onChange={e => setFormData(p => ({ ...p, payment_date: e.target.value }))}
              className="px-3 py-2 border rounded w-full" required />
          </Field>

          <Field label={`Proof ${currentProof ? '(upload to replace)' : ''}`}>
            {currentProof && !newProofFile && (
              <div className="flex items-center gap-3 mb-2">
                {isImage ? (
                  <img src={`/proof/${currentProof}`} alt="Current proof"
                    className="w-20 h-20 object-cover rounded border" />
                ) : (
                  <span className="text-sm text-gray-500">📄 {currentProof}</span>
                )}
                <span className="text-xs text-gray-400">Current proof</span>
              </div>
            )}
            {newProofFile && (
              <div className="flex items-center gap-3 mb-2">
                {newProofIsImage && proofPreview ? (
                  <img src={proofPreview} alt="Preview"
                    className="w-20 h-20 object-cover rounded border border-blue-300" />
                ) : (
                  <span className="text-sm text-gray-500">📄 {newProofFile.name}</span>
                )}
                <span className="text-xs text-blue-500">New file selected</span>
                <button type="button"
                  onClick={() => { setNewProofFile(null); setProofPreview(null); }}
                  className="text-xs text-red-400 hover:text-red-600">
                  ✕ Remove
                </button>
              </div>
            )}
            <input type="file" accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleProofChange}
              className="px-3 py-2 border rounded text-sm w-full" />
          </Field>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving}
              className="bg-[#03023B] text-white px-4 py-2 rounded hover:bg-[#FFDE59] hover:text-black transition disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button"
              onClick={() => { setIsEditing(false); setNewProofFile(null); setProofPreview(null); }}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200 transition">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Lightbox */}
      {lightboxOpen && isImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300"
            onClick={() => setLightboxOpen(false)}>✕</button>
          <img src={`/proof/${currentProof}`} alt="Proof"
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
            onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-400 font-medium">{label}</span>
      <span className="text-sm font-semibold text-[#03023B]">{value}</span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}