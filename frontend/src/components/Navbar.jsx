import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="nav" id="main-nav">
      <Link to="/" className="nav__logo">Task Forge</Link>
      <div className="nav__links">
        <Link to="/" className="nav__link">Home</Link>
        <a href="#philosophy" className="nav__link">Philosophy</a>
        <a href="#services" className="nav__link">Services</a>
        {user ? (
          <Link to="/dashboard" className="nav__cta">Dashboard</Link>
        ) : (
          <Link to="/login" className="nav__cta">Get Started</Link>
        )}
      </div>
      <div className="nav__hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </div>
    </nav>
  );
}
