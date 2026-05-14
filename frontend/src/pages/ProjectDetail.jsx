import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjectById, getTasksByProject, createTask, updateTaskStatus, deleteTask, addProjectMembers } from '../services/api';
import { showToast } from '../components/Toast';
import Modal from '../components/Modal';
import { Plus, Trash2, ArrowLeft, UserPlus } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
  const [memberEmail, setMemberEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, tRes] = await Promise.all([getProjectById(id), getTasksByProject(id)]);
      setProject(pRes.data.project || pRes.data);
      setTasks(tRes.data.tasks || tRes.data || []);
    } catch { showToast('Failed to load project', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const columns = [
    { key: 'todo', label: 'To Do' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ];

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await createTask({ ...taskForm, projectId: id });
      showToast('Task created!');
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
      fetchData();
    } catch (err) { showToast(err.response?.data?.message || 'Failed', 'error'); }
    finally { setBusy(false); }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      setTasks((prev) => prev.map((t) => t._id === taskId ? { ...t, status } : t));
    } catch { showToast('Failed to update status', 'error'); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try { await deleteTask(taskId); fetchData(); showToast('Task deleted'); }
    catch { showToast('Failed to delete', 'error'); }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await addProjectMembers(id, [memberEmail]);
      showToast('Member added!');
      setShowMemberModal(false);
      setMemberEmail('');
      fetchData();
    } catch (err) { showToast(err.response?.data?.message || 'Failed', 'error'); }
    finally { setBusy(false); }
  };

  if (loading) return <p style={{ color: 'var(--muted-2)', padding: 40 }}>Loading...</p>;
  if (!project) return <p style={{ padding: 40 }}>Project not found</p>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <Link to="/dashboard/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted-2)', marginBottom: 8 }}>
            <ArrowLeft size={14} /> Back to Projects
          </Link>
          <h1 className="page-title">{project.title}</h1>
          <p className="page-subtitle">{project.description}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {isAdmin && (
            <>
              <button className="btn-outline" onClick={() => setShowMemberModal(true)}>
                <UserPlus size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Add Member
              </button>
              <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
                <Plus size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> New Task
              </button>
            </>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div className="kanban__column" key={col.key}>
              <div className="kanban__column-header">
                {col.label}
                <span className="kanban__count">{colTasks.length}</span>
              </div>
              {colTasks.map((t) => (
                <div className="kanban__card" key={t._id}>
                  <div className="kanban__card-title">{t.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--muted-2)', marginBottom: 12 }}>{t.description}</p>
                  <div className="kanban__card-meta">
                    <span className={`badge badge--${t.priority}`}>{t.priority}</span>
                    <span>{new Date(t.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {col.key !== 'todo' && (
                      <button className="btn-outline" style={{ padding: '4px 12px', fontSize: 11 }}
                        onClick={() => handleStatusChange(t._id, col.key === 'completed' ? 'in-progress' : 'todo')}>
                        ← Move Back
                      </button>
                    )}
                    {col.key !== 'completed' && (
                      <button className="btn-outline" style={{ padding: '4px 12px', fontSize: 11 }}
                        onClick={() => handleStatusChange(t._id, col.key === 'todo' ? 'in-progress' : 'completed')}>
                        Move →
                      </button>
                    )}
                    {isAdmin && (
                      <button onClick={() => handleDeleteTask(t._id)}
                        style={{ marginLeft: 'auto', color: 'var(--muted)' }}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {colTasks.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: 24 }}>No tasks</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <Modal title="New Task" onClose={() => setShowTaskModal(false)}>
          <form onSubmit={handleCreateTask}>
            <div className="form-group">
              <label>Title</label>
              <input required value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea required rows={3} value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Assign To (User ID)</label>
              <input required value={taskForm.assignedTo}
                onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })} placeholder="User ID" />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" required value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
            </div>
            <div className="modal__actions">
              <button type="button" className="btn-outline" onClick={() => setShowTaskModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Creating...' : 'Create Task'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <Modal title="Add Member" onClose={() => setShowMemberModal(false)}>
          <form onSubmit={handleAddMember}>
            <div className="form-group">
              <label>Member User ID</label>
              <input required value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} placeholder="User ID" />
            </div>
            <div className="modal__actions">
              <button type="button" className="btn-outline" onClick={() => setShowMemberModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Adding...' : 'Add Member'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
