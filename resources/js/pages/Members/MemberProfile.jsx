import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function MemberProfile({ onSuccess }) {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    status: ''
  });
  const [message, setMessage] = useState('');

  // Fetch member data
  useEffect(() => {
    fetch(`/api/members/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Fetched member:', data);
        setMember(data);
        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          status: data.status
        });
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Update failed');
        return;
      }
      setMember(data);
      setMessage('Member updated successfully! ✅');

      setTimeout(() => setMessage(''), 3000);

      setIsEditing(false);  
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

    const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
        const res = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        });

        let data = {};
        if (res.status !== 204) {  // 204 = No Content
        data = await res.json().catch(() => ({}));
        }

        alert(data.message || 'Member deleted successfully!');
        navigate(-1);
        if (onSuccess) onSuccess();

    } catch (err) {
        console.error(err);
        alert('Server error. Could not delete member.');
    }
    };

  if (!member) return <div className="p-5">Loading...</div>;

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <button 
        className="mb-4 text-blue-500 hover:underline" 
        onClick={() => navigate(-1)}
      >
        ← Back to Members
      </button>

      <h1 className="text-2xl font-bold mb-2">{member.first_name} {member.last_name}</h1>
      <p className="text-gray-600 mb-4">Status: {member.status}</p>

      {message && (
        <p className="text-green-600 mb-4 text-center">{message}</p>
      )}

      {isEditing ? (
        <form className="space-y-3" onSubmit={handleUpdate}>
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border px-3 py-2 rounded w-full"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Save
          </button>
        </form>
      ) : (
        <div className="space-y-2">
          <p>Email: {member.email}</p>
          <p>Phone: {member.phone}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-3"
            onClick={() => setIsEditing(true)}
          >
            Edit Member
          </button>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-3"
            onClick={handleDelete}
            >
            Delete Member
            </button>
        </div>
      )}
    </div>
  );
}