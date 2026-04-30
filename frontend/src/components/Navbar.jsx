import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-navbar" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h2 style={{ margin: 0, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
          TeamSync
        </h2>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/dashboard" style={{ color: isActive('/dashboard') ? '#fff' : 'var(--text-secondary)', fontWeight: isActive('/dashboard') ? 600 : 400 }}>Dashboard</Link>
          <Link to="/projects" style={{ color: isActive('/projects') ? '#fff' : 'var(--text-secondary)', fontWeight: isActive('/projects') ? 600 : 400 }}>Projects</Link>
          <Link to="/tasks" style={{ color: isActive('/tasks') ? '#fff' : 'var(--text-secondary)', fontWeight: isActive('/tasks') ? 600 : 400 }}>Tasks</Link>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontWeight: 600, color: '#fff' }}>{user.name}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{user.role}</span>
        </div>
        <button className="btn btn-danger" onClick={logout} style={{ padding: '0.5rem 1rem' }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
