import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const TopHeader = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 800, color: 'var(--text-dark)' }}>{getPageTitle()}</h2>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} color="var(--text-gray)" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" className="input-field" placeholder="Search tasks, projects..." style={{ paddingLeft: '3rem', border: 'none', background: '#FFFFFF', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }} />
        </div>
        
        <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '50%', display: 'flex', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', color: 'var(--text-gray)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-blue)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-gray)'}>
          <Bell size={20} />
        </div>
        
        <div style={{ background: '#FFFFFF', padding: '0.5rem 1.25rem 0.5rem 0.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', fontWeight: 'bold', fontSize: '1rem' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>{user.name.split(' ')[0]}</p>
            <span style={{ 
              display: 'inline-block',
              marginTop: '0.15rem',
              fontSize: '0.65rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              color: user.role === 'admin' ? '#4318FF' : '#718096',
              background: user.role === 'admin' ? '#E9E3FF' : '#F7FAFC',
              padding: '0.15rem 0.6rem',
              borderRadius: '9999px'
            }}>
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
