import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--muted-2)' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
