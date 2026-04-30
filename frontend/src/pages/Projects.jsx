import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
    if (user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { title, description, members: selectedMembers });
      setTitle('');
      setDescription('');
      setSelectedMembers([]);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project', error);
      alert('Error creating project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project', error);
        alert('Error deleting project');
      }
    }
  };

  return (
    <div className="page-container fade-in">
      
      <div style={{ display: 'grid', gridTemplateColumns: user.role === 'admin' ? '1fr 2.5fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
        
        {user.role === 'admin' && (
          <div className="card">
            <h3 style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>Create New Project</h3>
            
            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-gray)', fontWeight: 600 }}>PROJECT TITLE</label>
                <input type="text" className="input-field" placeholder="E.g. Website Redesign" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-gray)', fontWeight: 600 }}>DESCRIPTION</label>
                <textarea className="input-field" placeholder="Brief description of the project" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-gray)', fontWeight: 600 }}>ASSIGN MEMBERS</label>
                <select multiple className="input-field" value={selectedMembers} onChange={(e) => setSelectedMembers(Array.from(e.target.selectedOptions, option => option.value))} style={{ minHeight: '120px', padding: '0.75rem' }}>
                  {users.map(u => (
                    <option key={u._id} value={u._id} style={{ padding: '0.5rem', borderRadius: '6px', marginBottom: '4px', fontWeight: 500 }}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>Create Project</button>
            </form>
          </div>
        )}

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>All Projects</h3>
          {projects.length === 0 ? (
            <p style={{ color: 'var(--text-gray)', textAlign: 'center', padding: '2rem', fontWeight: 500 }}>No projects found. {user.role === 'admin' ? 'Create one to get started.' : ''}</p>
          ) : (
            <>
              <div className="list-header" style={{ gridTemplateColumns: '2fr 3fr 2fr' }}>
                <span>Project Name</span>
                <span>Description</span>
                <span>Members</span>
              </div>
              {projects.length > 0 && [...projects].reverse().map(project => (
                <div key={project._id} className="list-row" style={{ gridTemplateColumns: '2fr 3fr 2fr' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{project.title}</span>
                  <span style={{ color: 'var(--text-gray)', paddingRight: '1rem', fontWeight: 500 }}>{project.description || 'No description'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {project.members && project.members.length > 0 ? project.members.map(m => (
                        <span key={m._id} style={{ background: '#F1F5F9', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', color: 'var(--text-dark)', fontWeight: 600 }}>
                          {m.name.split(' ')[0]}
                        </span>
                      )) : (
                        <span style={{ color: 'var(--text-gray)', fontSize: '0.8rem', fontWeight: 500 }}>None</span>
                      )}
                    </div>
                    {user.role === 'admin' && (
                      <button onClick={() => handleDeleteProject(project._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger-text)', padding: '0.25rem' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
