import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Mail, Shield, User, Plus, X } from 'lucide-react';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useContext(AuthContext);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', { name, email, password });
      setShowAddModal(false);
      setName('');
      setEmail('');
      setPassword('');
      fetchMembers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add member');
    }
  };

  return (
    <div className="page-container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 800, color: 'var(--text-dark)' }}>Team Members</h1>
            <span style={{ background: '#FFFFFF', padding: '0.4rem 1rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-blue)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>{members.length} Total</span>
          </div>
          <p style={{ color: 'var(--text-gray)', margin: '0.25rem 0 0 0', fontSize: '0.95rem', fontWeight: 500 }}>Manage your organization's members and roles.</p>
        </div>
        {user.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add Member
          </button>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="card modal-content" style={{ maxWidth: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800 }}>Add New Member</h2>
              <X size={24} style={{ cursor: 'pointer', color: 'var(--text-gray)' }} onClick={() => setShowAddModal(false)} />
            </div>
            
            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-gray)' }}>FULL NAME</label>
                <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-gray)' }}>EMAIL ADDRESS</label>
                <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-gray)' }}>TEMPORARY PASSWORD</label>
                <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn" style={{ flex: 1, background: '#F1F5F9', color: 'var(--text-dark)' }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {members.map((member) => (
          <div key={member._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', fontWeight: 800, fontSize: '1.25rem' }}>
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{member.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-gray)', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.1rem' }}>
                  <Mail size={14} />
                  {member.email}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem',
                padding: '0.4rem 1rem', 
                borderRadius: '12px', 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                textTransform: 'uppercase',
                background: member.role === 'admin' ? '#E9E3FF' : '#F7FAFC',
                color: member.role === 'admin' ? '#4318FF' : '#718096'
              }}>
                {member.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                {member.role}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-gray)', fontWeight: 600 }}>
                Joined {new Date(member.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
