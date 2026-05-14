import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, User } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = [
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/dashboard/projects', icon: <FolderKanban size={18} />, label: 'Projects' },
    { to: '/dashboard/tasks', icon: <CheckSquare size={18} />, label: 'My Tasks' },
  ];

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar__logo">Task Forge</div>
      <nav className="sidebar__nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/dashboard'}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            {l.icon}
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__user">
        <div className="sidebar__avatar">{initials}</div>
        <div className="sidebar__user-info">
          <div className="sidebar__user-name">{user?.name || 'User'}</div>
          <div className="sidebar__user-role">{user?.role || 'member'}</div>
        </div>
        <button onClick={handleLogout} title="Logout" style={{ color: 'rgba(246,246,246,0.5)' }}>
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
