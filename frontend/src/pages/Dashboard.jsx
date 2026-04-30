import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { BarChart2, Briefcase, Clock, Users, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [metrics, setMetrics] = useState({ totalTasks: 0, completedTasks: 0, inProgressTasks: 0, overdueTasks: 0, totalProjects: 0 });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchMetrics();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const { data } = await api.get('/dashboard');
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics', error);
    }
  };


  return (
    <div className="page-container fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button onClick={() => { fetchTasks(); fetchProjects(); fetchMetrics(); }} style={{ background: 'white', border: '1px solid var(--border-light)', padding: '0.5rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, color: 'var(--text-gray)' }}>
          <Clock size={16} /> Refresh Data
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', marginBottom: '0.25rem', fontWeight: 600 }}>Total Projects</p>
            <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800 }}>{metrics.totalProjects}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--success-text)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              <TrendingUp size={14} /> {metrics.totalProjects > 0 ? 'Active & Growing' : 'Start a project'}
            </p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: 'var(--success-bg)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <BarChart2 size={24} color="var(--success-text)" />
          </div>
          <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', marginBottom: '0.25rem', fontWeight: 600 }}>Total Tasks</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800 }}>{metrics.totalTasks}</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--success-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
            <TrendingUp size={14} /> +12% this month
          </p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#FFF3E0', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Clock size={24} color="#EA580C" />
          </div>
          <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', marginBottom: '0.25rem', fontWeight: 600 }}>In Progress</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800 }}>{metrics.inProgressTasks}</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--success-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
            <TrendingUp size={14} /> On track
          </p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: 'var(--danger-bg)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Users size={24} color="var(--danger-text)" />
          </div>
          <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', marginBottom: '0.25rem', fontWeight: 600 }}>Overdue</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800 }}>{metrics.overdueTasks}</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--danger-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
            <TrendingDown size={14} /> Requires attention
          </p>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Project Summary Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Project Summary</h3>
            <select style={{ padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-light)', outline: 'none', fontWeight: 600, color: 'var(--text-gray)', cursor: 'pointer' }}>
              <option>This month</option>
            </select>
          </div>
          
          <div className="list-header">
            <span>Name</span>
            <span>Manager</span>
            <span>Due Date</span>
            <span>Status</span>
          </div>
          
          {projects.length > 0 ? (
            [...projects].reverse().slice(0, 5).map(project => (
              <div key={project._id} className="list-row">
                <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{project.title}</span>
                <span style={{ fontWeight: 500 }}>{project.admin?.name || 'Admin'}</span>
                <span style={{ color: 'var(--text-gray)', fontWeight: 500 }}>Ongoing</span>
                <span><span className="status-badge status-todo">On Track</span></span>
              </div>
            ))
          ) : tasks.length > 0 ? (
            tasks.slice(0, 5).map(task => {
              const isOverdue = task.status !== 'done' && task.status !== 'submitted' && task.dueDate && new Date(task.dueDate) < new Date();
              let badgeClass = (task.status === 'done' || task.status === 'submitted') ? 'status-done' : (task.status === 'in-progress' ? 'status-warning' : 'status-todo');
              let badgeText = (task.status === 'done' || task.status === 'submitted') ? 'Completed' : (task.status === 'in-progress' ? 'On Going' : 'To Do');
              
              if (isOverdue) {
                badgeClass = 'status-danger';
                badgeText = 'Delayed';
              }
              
              return (
                <div key={task._id} className="list-row">
                  <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{task.title}</span>
                  <span style={{ fontWeight: 500 }}>{task.assignedTo?.name || 'Unassigned'}</span>
                  <span style={{ color: 'var(--text-gray)', fontWeight: 500 }}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                  <span><span className={`status-badge ${badgeClass}`}>{badgeText}</span></span>
                </div>
              );
            })
          ) : (
            <p style={{ color: 'var(--text-gray)', padding: '3rem 0', textAlign: 'center', fontWeight: 500 }}>No summary available.</p>
          )}
        </div>

        {/* Right side - Today Task */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Today's Tasks</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {tasks.filter(t => t.status !== 'done' && t.status !== 'submitted').length > 0 ? tasks.filter(t => t.status !== 'done' && t.status !== 'submitted').slice(0, 5).map(task => (
              <div key={task._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem', background: '#F8FAFC', borderRadius: '16px', border: '1px solid transparent', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-blue)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: task.status === 'in-progress' ? '#EA580C' : 'var(--accent-blue)', flexShrink: 0 }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.2rem 0', fontWeight: 700, fontSize: '0.95rem' }}>{task.title}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-gray)', fontWeight: 500 }}>{task.project?.title || 'No Project'}</p>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>{task.progress || 0}%</div>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${task.progress || 0}%`, height: '100%', background: 'var(--accent-blue)', transition: 'width 0.5s ease' }}></div>
                </div>
              </div>
            )) : (
              <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', textAlign: 'center', padding: '2rem 0', fontWeight: 500 }}>All caught up for today!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
