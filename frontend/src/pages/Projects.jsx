import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, createProject, deleteProject } from '../services/api';
import { showToast } from '../components/Toast';
import Modal from '../components/Modal';
import { Plus, Trash2, ArrowRight, FolderKanban } from 'lucide-react';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', deadline: '' });
  const [busy, setBusy] = useState(false);
  const isAdmin = user?.role === 'admin';

  const fetchProjects = () => {
    setLoading(true);
    getProjects()
      .then((res) => setProjects(res.data.projects || res.data || []))
      .catch(() => showToast('Failed to load projects', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await createProject(form);
      showToast('Project created!');
      setShowModal(false);
      setForm({ title: '', description: '', deadline: '' });
      fetchProjects();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create project', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      showToast('Project deleted');
      fetchProjects();
    } catch (err) {
      showToast('Failed to delete project', 'error');
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            New Project
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted-2)' }}>Loading...</p>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon"><FolderKanban size={48} /></div>
          <p className="empty-state__text">No projects yet</p>
          {isAdmin && (
            <button className="btn-primary" onClick={() => setShowModal(true)}>Create First Project</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {projects.map((p) => (
            <div className="service-card" key={p._id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 className="service-card__title" style={{ marginBottom: 0 }}>{p.title}</h3>
                <span className={`badge badge--${p.status}`}>{p.status}</span>
              </div>
              <p className="service-card__text" style={{ flex: 1 }}>{p.description}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted-2)' }}>
                <span>Deadline: {new Date(p.deadline).toLocaleDateString()}</span>
                <span>{p.members?.length || 0} member{(p.members?.length || 0) !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center' }}>
                <Link to={`/dashboard/projects/${p._id}`} className="service-card__cta">
                  Open <ArrowRight size={14} />
                </Link>
                {isAdmin && (
                  <button onClick={() => handleDelete(p._id)} style={{ color: 'var(--muted)', marginLeft: 'auto' }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="New Project" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea required rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input type="date" required value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div className="modal__actions">
              <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={busy}>
                {busy ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
