import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardData } from '../services/api';
import { FolderKanban, CheckSquare, Clock, AlertTriangle, ListChecks, CircleCheckBig } from 'lucide-react';

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardData()
      .then((res) => {
        // API returns: { success, role, dashboard: { ... } }
        const data = res.data;
        setRole(data.role);
        setStats(data.dashboard);
      })
      .catch((err) => {
        console.error('Dashboard fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard');
      })
      .finally(() => setLoading(false));
  }, []);

  const getCards = () => {
    if (!stats) return [];

    if (role === 'admin') {
      return [
        { label: 'Total Projects', value: stats.totalProjects ?? 0, icon: <FolderKanban size={20} /> },
        { label: 'Total Tasks', value: stats.totalTasks ?? 0, icon: <CheckSquare size={20} /> },
        { label: 'Completed Tasks', value: stats.completedTasks ?? 0, icon: <CircleCheckBig size={20} /> },
        { label: 'Pending Tasks', value: stats.pendingTasks ?? 0, icon: <Clock size={20} /> },
        { label: 'Overdue Tasks', value: stats.overdueTasks ?? 0, icon: <AlertTriangle size={20} /> },
      ];
    }

    // Member dashboard
    return [
      { label: 'Assigned Tasks', value: stats.assignedTasks ?? 0, icon: <ListChecks size={20} /> },
      { label: 'Completed Tasks', value: stats.completedTasks ?? 0, icon: <CircleCheckBig size={20} /> },
      { label: 'Pending Tasks', value: stats.pendingTasks ?? 0, icon: <Clock size={20} /> },
      { label: 'Overdue Tasks', value: stats.overdueTasks ?? 0, icon: <AlertTriangle size={20} /> },
    ];
  };

  const cards = getCards();

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome, {user?.name?.split(' ')[0] || 'User'}</h1>
          <p className="page-subtitle">
            {role === 'admin' ? 'Admin overview of all projects and tasks' : "Here's your task overview"}
          </p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted-2)' }}>Loading dashboard...</p>
      ) : error ? (
        <p style={{ color: 'var(--muted-2)' }}>Error: {error}</p>
      ) : (
        <div className="stats-grid">
          {cards.map((c, i) => (
            <div className="stat-card" key={i}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="stat-card__label">{c.label}</span>
                <span style={{ color: 'var(--muted)' }}>{c.icon}</span>
              </div>
              <div className="stat-card__value">{c.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
