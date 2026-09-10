import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AuthModal from './AuthModal';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, isAuthenticated, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCTA = () => {
    setMenuOpen(false);
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setShowAuth(true);
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-fit">FIT</span><span className="logo-3d">3D</span>
          </Link>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/body-map" className={`nav-link ${location.pathname === '/body-map' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}>Body Map</Link>
            <Link to="/plans" className={`nav-link ${location.pathname === '/plans' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}>Workouts</Link>
            <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}>Dashboard</Link>
            
            {isAuthenticated ? (
              <div className="nav-profile" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="nav-avatar">{user.name?.[0]?.toUpperCase() || '?'}</div>
                <span className="nav-user-name">{user.name?.split(' ')[0]}</span>
                {showDropdown && (
                  <div className="nav-dropdown glass-card">
                    <div className="dropdown-header">
                      <span className="dropdown-name">{user.name}</span>
                      <span className="dropdown-email">{user.email}</span>
                    </div>
                    <hr className="dropdown-divider" />
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setShowDropdown(false)}>📊 Dashboard</Link>
                    <Link to="/plans" className="dropdown-item" onClick={() => setShowDropdown(false)}>🏋️ Workouts</Link>
                    <button className="dropdown-item logout" onClick={() => { logout(); setShowDropdown(false); }}>🚪 Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <button className="nav-cta neon-btn" onClick={handleCTA}>
                Start Training
              </button>
            )}
          </div>
          <button className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
