import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon, Monitor, Bell, Lock, User } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = React.useState('appearance');

  const renderContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Appearance</h3>
            <p style={{ color: 'var(--text-gray)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Customize how TeamSync looks on your device.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Interface Theme</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>Select or customize your interface theme.</p>
                </div>
                
                <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <button 
                    onClick={() => theme === 'dark' && toggleTheme()}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s',
                      background: theme === 'light' ? 'var(--bg-card)' : 'transparent',
                      color: theme === 'light' ? 'var(--accent-blue)' : 'var(--text-gray)',
                      boxShadow: theme === 'light' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    <Sun size={18} /> Light
                  </button>
                  <button 
                    onClick={() => theme === 'light' && toggleTheme()}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s',
                      background: theme === 'dark' ? 'var(--bg-card)' : 'transparent',
                      color: theme === 'dark' ? 'var(--accent-blue)' : 'var(--text-gray)',
                      boxShadow: theme === 'dark' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    <Moon size={18} /> Dark
                  </button>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Compact Mode</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>Reduce whitespace to see more content at once.</p>
                </div>
                <div style={{ width: '44px', height: '24px', background: 'var(--border-light)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', top: '2px', left: '2px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%', transition: 'all 0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Notifications</h3>
            <p style={{ color: 'var(--text-gray)', marginBottom: '2rem', fontSize: '0.95rem' }}>Configure how you receive alerts and updates.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Email Notifications</span>
                <div style={{ width: '44px', height: '24px', background: 'var(--accent-blue)', borderRadius: '12px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '2px', right: '2px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%' }}></div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Push Notifications</span>
                <div style={{ width: '44px', height: '24px', background: 'var(--border-light)', borderRadius: '12px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '2px', left: '2px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Security</h3>
            <p style={{ color: 'var(--text-gray)', marginBottom: '2rem', fontSize: '0.95rem' }}>Manage your password and security settings.</p>
            <button className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>Change Password</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-container fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Settings</h2>
        <p style={{ color: 'var(--text-gray)', fontWeight: 500 }}>Manage your account settings and preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className={`nav-item ${activeTab === 'appearance' ? 'active' : ''}`} 
            style={{ justifyContent: 'flex-start' }}
            onClick={() => setActiveTab('appearance')}
          >
            <Monitor size={20} /> Appearance
          </button>
          <button 
            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} 
            style={{ justifyContent: 'flex-start' }}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={20} /> Notifications
          </button>
          <button 
            className={`nav-item ${activeTab === 'security' ? 'active' : ''}`} 
            style={{ justifyContent: 'flex-start' }}
            onClick={() => setActiveTab('security')}
          >
            <Lock size={20} /> Security
          </button>
        </div>

        {/* Content Area */}
        <div className="card" style={{ padding: '2.5rem', minHeight: '400px' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
