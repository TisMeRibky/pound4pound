import React, { useState, useEffect } from 'react';
import CreateMember from './CreateMember'; 

export default function MemberProfiles({ user }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch('/api/members', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setMembers(data.data));
  }, []);

  return (
    <div className="flex">
      <main className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-4">Member Profiles</h1>

        {/* Here’s where you render the CreateMember form */}
        <CreateMember token={localStorage.getItem('token')} />

        {/* Example members table */}
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td className="border p-2">{member.first_name} {member.last_name}</td>
                <td className="border p-2">{member.email}</td>
                <td className="border p-2">{member.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}