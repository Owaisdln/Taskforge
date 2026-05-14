import { useState, useEffect } from 'react';
import { getProjects, getTasksByProject, updateTaskStatus } from '../services/api';
import { showToast } from '../components/Toast';
import { CheckSquare } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllTasks = async () => {
    try {
      const projRes = await getProjects();
      const projects = projRes.data.projects || projRes.data || [];
      
      // Fetch all tasks for all projects CONCURRENTLY instead of sequentially
      const taskPromises = projects.map(async (p) => {
        try {
          const tRes = await getTasksByProject(p._id);
          const pTasks = tRes.data.tasks || tRes.data || [];
          return pTasks.map((t) => ({ ...t, projectTitle: p.title }));
        } catch {
          return [];
        }
      });

      const results = await Promise.all(taskPromises);
      const allTasks = results.flat();
      
      setTasks(allTasks);
    } catch {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks((prev) => prev.map((t) => t._id === taskId ? { ...t, status: newStatus } : t));
      showToast('Task status updated successfully!');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update status', 'error');
    }
  };

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
                  <td>
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t._id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--border)',
                        background: 'transparent',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
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
