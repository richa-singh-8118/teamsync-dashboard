import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [role, setRole] = useState('member'); // New role state
  const { signup } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only send adminKey if role is admin
      await signup(name, email, password, role === 'admin' ? adminKey : '');
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', background: 'var(--bg-main)' }}>
      <div className="card" style={{ padding: '3rem', width: '100%', maxWidth: '480px', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--accent-blue)', borderRadius: '12px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckSquare size={20} color="#fff" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-dark)' }}>TeamSync</h1>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>Create an account</h2>
        <p style={{ color: 'var(--text-gray)', marginBottom: '2rem', fontSize: '0.95rem', fontWeight: 500 }}>Join the team and manage your tasks.</p>
        
        {/* Role Toggle */}
        <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '12px', marginBottom: '2rem' }}>
          <button 
            type="button"
            onClick={() => setRole('member')}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, transition: 'all 0.2s', background: role === 'member' ? '#fff' : 'transparent', color: role === 'member' ? 'var(--accent-blue)' : 'var(--text-gray)', boxShadow: role === 'member' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}
          >
            Member
          </button>
          <button 
            type="button"
            onClick={() => setRole('admin')}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, transition: 'all 0.2s', background: role === 'admin' ? '#fff' : 'transparent', color: role === 'admin' ? 'var(--accent-blue)' : 'var(--text-gray)', boxShadow: role === 'admin' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-gray)', fontWeight: 700, textTransform: 'uppercase' }}>Full Name</label>
            <input type="text" className="input-field" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-gray)', fontWeight: 700, textTransform: 'uppercase' }}>Email Address</label>
            <input type="email" className="input-field" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-gray)', fontWeight: 700, textTransform: 'uppercase' }}>Password</label>
            <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {role === 'admin' && (
            <div className="fade-in">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-gray)', fontWeight: 700, textTransform: 'uppercase' }}>Admin Secret Key</label>
              <input type="password" className="input-field" placeholder="Enter secret key" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} required />
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', padding: '1rem', fontSize: '1rem' }}>Create Account</button>
        </form>
        
        <p style={{ marginTop: '2.5rem', color: 'var(--text-gray)', fontSize: '0.9rem', fontWeight: 500 }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
