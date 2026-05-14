import { useState, useEffect } from 'react';
import { getProjects, getTasksByProject } from '../services/api';
import { showToast } from '../components/Toast';
import { CheckSquare } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const projRes = await getProjects();
        const projects = projRes.data.projects || projRes.data || [];
        const allTasks = [];
        for (const p of projects) {
          try {
            const tRes = await getTasksByProject(p._id);
            const pTasks = tRes.data.tasks || tRes.data || [];
            pTasks.forEach((t) => allTasks.push({ ...t, projectTitle: p.title }));
          } catch {}
        }
        setTasks(allTasks);
      } catch {
        showToast('Failed to load tasks', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAllTasks();
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Tasks</h1>
          <p className="page-subtitle">{tasks.length} task{tasks.length !== 1 ? 's' : ''} across all projects</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted-2)' }}>Loading...</p>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon"><CheckSquare size={48} /></div>
          <p className="empty-state__text">No tasks found</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, border: '1px solid rgba(30,30,30,0.06)' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t._id}>
                  <td style={{ fontWeight: 700 }}>{t.title}</td>
                  <td>{t.projectTitle}</td>
                  <td><span className={`badge badge--${t.status}`}>{t.status}</span></td>
                  <td><span className={`badge badge--${t.priority}`}>{t.priority}</span></td>
                  <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
