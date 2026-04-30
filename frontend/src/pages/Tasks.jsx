import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Calendar, User, MessageSquare, Check, X, Send } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Create Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Update/Submit Form
  const [updateMessage, setUpdateMessage] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
    if (user.role === 'admin') {
      fetchProjects();
      fetchUsers();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
      if (selectedTask) {
        const updatedSelected = data.find(t => t._id === selectedTask._id);
        if (updatedSelected) setSelectedTask(updatedSelected);
      }
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

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { title, description, project: projectId, assignedTo, dueDate });
      setTitle('');
      setDescription('');
      setProjectId('');
      setAssignedTo('');
      setDueDate('');
      setShowCreateModal(false);
      fetchTasks();
    } catch (error) {
      console.error('Error creating task', error);
      alert('Error creating task');
    }
  };

  const handleUpdateStatusAndProgress = async (taskId, newStatus, newProgress) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus, progress: newProgress });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const handleAddUpdate = async (taskId) => {
    if (!updateMessage) return;
    try {
      await api.post(`/tasks/${taskId}/update`, { message: updateMessage });
      setUpdateMessage('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding update', error);
    }
  };

  const handleSubmitTask = async (taskId) => {
    try {
      await api.post(`/tasks/${taskId}/submit`, { notes: submissionNotes, link: submissionLink });
      setSubmissionNotes('');
      setSubmissionLink('');
      fetchTasks();
    } catch (error) {
      console.error('Error submitting task', error);
    }
  };

  const renderKanbanCard = (task) => {
    const isOverdue = task.status !== 'completed' && task.status !== 'submitted' && task.dueDate && new Date(task.dueDate) < new Date();
    
    return (
      <div key={task._id} className="card" style={{ marginBottom: '1rem', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', padding: '1.25rem', borderLeft: isOverdue ? '4px solid var(--danger-text)' : 'none' }} onClick={() => setSelectedTask(task)}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: 'var(--text-dark)', fontWeight: 700 }}>{task.title}</h4>
        
        <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 500 }}>
          {task.description}
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1, background: '#F1F5F9', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${task.progress || 0}%`, background: 'var(--accent-blue)', height: '100%' }}></div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-gray)', fontWeight: 700 }}>{task.progress || 0}%</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-gray)', fontWeight: 600 }}>
            <User size={14} /> {task.assignedTo?.name?.split(' ')[0] || 'Unassigned'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-gray)', fontWeight: 600 }}>
            <Calendar size={14} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
          </div>
        </div>
      </div>
    );
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'submitted');

  return (
    <div className="page-container fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
        {user.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} /> New Task
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, overflow: 'hidden', paddingBottom: '1rem' }}>
        
        {/* Kanban Board Area */}
        <div style={{ flex: 1, display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingRight: selectedTask ? '0' : '1rem' }}>
          
          <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--info-text)' }}></div>
              <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>To Do</h3>
              <span style={{ background: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-gray)', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>{todoTasks.length}</span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
              {todoTasks.map(renderKanbanCard)}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--warning-text)' }}></div>
              <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>In Progress</h3>
              <span style={{ background: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-gray)', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>{inProgressTasks.length}</span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
              {inProgressTasks.map(renderKanbanCard)}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success-text)' }}></div>
              <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Done</h3>
              <span style={{ background: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-gray)', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>{completedTasks.length}</span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
              {completedTasks.map(renderKanbanCard)}
            </div>
          </div>

        </div>

        {/* Selected Task Details Sidebar */}
        {selectedTask && (
          <div className="card fade-in" style={{ width: '400px', flexShrink: 0, overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setSelectedTask(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-gray)' }}>
              <X size={20} />
            </button>
            
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', paddingRight: '2rem', fontWeight: 800 }}>{selectedTask.title}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span className={`status-badge status-${selectedTask.status === 'submitted' ? 'done' : selectedTask.status === 'completed' ? 'done' : selectedTask.status === 'in-progress' ? 'warning' : 'todo'}`}>
                {selectedTask.status.toUpperCase()}
              </span>
            </div>

            <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-gray)', lineHeight: 1.6, fontWeight: 500 }}>
              {selectedTask.description}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: '#F8FAFC', padding: '1.25rem', borderRadius: '16px' }}>
              <div>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: 'var(--text-gray)', fontWeight: 600, textTransform: 'uppercase' }}>Project</p>
                <p style={{ margin: 0, fontWeight: 700 }}>{selectedTask.project?.title}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: 'var(--text-gray)', fontWeight: 600, textTransform: 'uppercase' }}>Due Date</p>
                <p style={{ margin: 0, fontWeight: 700 }}>{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: 'var(--text-gray)', fontWeight: 600, textTransform: 'uppercase' }}>Assigned To</p>
                <p style={{ margin: 0, fontWeight: 700 }}>{selectedTask.assignedTo?.name}</p>
              </div>
            </div>

            {/* Admin or Assignee Controls */}
            {(user.role === 'admin' || user._id === selectedTask.assignedTo._id) && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>Update Progress ({selectedTask.progress || 0}%)</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={selectedTask.progress || 0} 
                    onChange={(e) => handleUpdateStatusAndProgress(selectedTask._id, selectedTask.status, e.target.value)}
                    style={{ flex: 1, accentColor: 'var(--accent-blue)' }}
                    disabled={selectedTask.status === 'submitted' || selectedTask.status === 'completed'}
                  />
                  <select 
                    value={selectedTask.status}
                    onChange={(e) => handleUpdateStatusAndProgress(selectedTask._id, e.target.value, selectedTask.progress)}
                    className="input-field"
                    style={{ width: '130px', padding: '0.4rem 0.5rem' }}
                    disabled={selectedTask.status === 'submitted'}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    {user.role === 'admin' && <option value="completed">Completed</option>}
                  </select>
                </div>
              </div>
            )}

            {/* Submission Section for Member */}
            {user._id === selectedTask.assignedTo._id && selectedTask.status !== 'submitted' && selectedTask.status !== 'completed' && (
              <div style={{ marginBottom: '2rem', background: '#FFF3E0', padding: '1.25rem', borderRadius: '16px', border: '1px solid #FFE0B2' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E65100', fontWeight: 700 }}><Check size={16} /> Submit Task</h4>
                <textarea 
                  className="input-field" 
                  placeholder="Submission notes..." 
                  value={submissionNotes} 
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  style={{ marginBottom: '0.5rem' }}
                  rows="2"
                />
                <input 
                  type="url" 
                  className="input-field" 
                  placeholder="Link (e.g. GitHub, Google Doc)" 
                  value={submissionLink} 
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  style={{ marginBottom: '0.75rem' }}
                />
                <button className="btn btn-primary" onClick={() => handleSubmitTask(selectedTask._id)} style={{ width: '100%', background: '#E65100', boxShadow: '0 4px 15px rgba(230, 81, 0, 0.2)' }}>Submit for Review</button>
              </div>
            )}

            {/* Submission Details View */}
            {(selectedTask.status === 'submitted' || selectedTask.status === 'completed') && selectedTask.submission?.submittedAt && (
              <div style={{ marginBottom: '2rem', background: 'var(--success-bg)', padding: '1.25rem', borderRadius: '16px' }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem', color: 'var(--success-text)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                  <Check size={16} /> Task Submitted
                </h4>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}><strong>Notes:</strong> {selectedTask.submission.notes || 'None'}</p>
                {selectedTask.submission.link && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}><strong>Link:</strong> <a href={selectedTask.submission.link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)' }}>{selectedTask.submission.link}</a></p>}
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-gray)' }}>Submitted on: {new Date(selectedTask.submission.submittedAt).toLocaleString()}</p>
                
                {user.role === 'admin' && selectedTask.status === 'submitted' && (
                  <button className="btn btn-primary" onClick={() => handleUpdateStatusAndProgress(selectedTask._id, 'completed', 100)} style={{ width: '100%', marginTop: '1rem', background: 'var(--success-text)', boxShadow: 'none' }}>Approve & Mark Completed</button>
                )}
              </div>
            )}

            {/* Updates / Comments */}
            <div>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}><MessageSquare size={16} /> Updates & Logs</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                {selectedTask.updates && selectedTask.updates.length > 0 ? selectedTask.updates.map((update, i) => (
                  <div key={i} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{update.addedBy?.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-gray)', fontWeight: 500 }}>{new Date(update.timestamp).toLocaleString()}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dark)', fontWeight: 500 }}>{update.message}</p>
                  </div>
                )) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', margin: 0, fontWeight: 500 }}>No updates yet.</p>
                )}
              </div>

              {(user.role === 'admin' || user._id === selectedTask.assignedTo._id) && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Add an update..." 
                    value={updateMessage} 
                    onChange={(e) => setUpdateMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddUpdate(selectedTask._id)}
                  />
                  <button className="btn btn-primary" style={{ padding: '0 1rem' }} onClick={() => handleAddUpdate(selectedTask._id)}>
                    <Send size={16} />
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Create Modal overlay */}
      {showCreateModal && user.role === 'admin' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button onClick={() => setShowCreateModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-gray)' }}><X size={20} /></button>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Create New Task</h3>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-gray)' }}>TASK TITLE</label>
                <input type="text" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-gray)' }}>DESCRIPTION</label>
                <textarea className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-gray)' }}>PROJECT</label>
                  <select className="input-field" value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
                    <option value="" disabled hidden>Select Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-gray)' }}>ASSIGNEE</label>
                  <select className="input-field" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
                    <option value="" disabled hidden>Assign To</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-gray)' }}>DUE DATE</label>
                <input type="date" className="input-field" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Create Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
