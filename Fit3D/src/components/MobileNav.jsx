import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import AuthModal from './AuthModal';
import './MobileNav.css';

const NAV_ITEMS = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/body-map', icon: '🧬', label: 'Body Map' },
  { path: '/plans', icon: '🏋️', label: 'Workouts' },
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
];

export default function MobileNav() {
  const location = useLocation();
  const { isAuthenticated } = useUser();
  const [showAuth, setShowAuth] = useState(false);

  const handleClick = (path, e) => {
    if ((path === '/dashboard') && !isAuthenticated) {
      e.preventDefault();
      setShowAuth(true);
    }
  };

  return (
    <>
      <nav className="mobile-nav">
        {NAV_ITEMS.map(item => (
          <Link key={item.path} to={item.path}
            className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={(e) => handleClick(item.path, e)}>
            <span className="mobile-nav-icon">{item.icon}</span>
            <span className="mobile-nav-label">{item.label}</span>
            {location.pathname === item.path && <span className="mobile-nav-indicator" />}
          </Link>
        ))}
      </nav>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
