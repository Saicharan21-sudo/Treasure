import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { UserProvider } from './context/UserContext';
import { WorkoutProvider } from './context/WorkoutContext';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import CursorGlow from './components/CursorGlow';
import ParticleField from './components/ParticleField';
import LoadingScreen from './components/LoadingScreen';
import Celebration from './components/Celebration';
import './App.css';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BodyMap = lazy(() => import('./pages/BodyMap'));
const WorkoutPlans = lazy(() => import('./pages/WorkoutPlans'));
const WorkoutSession = lazy(() => import('./pages/WorkoutSession'));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <UserProvider>
      <WorkoutProvider>
        <Router>
          <div className="app">
            <CursorGlow />
            <ParticleField />
            <Navbar />
            <Celebration />
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/body-map" element={<BodyMap />} />
                <Route path="/plans" element={<WorkoutPlans />} />
                <Route path="/workout/:planId" element={<WorkoutSession />} />
              </Routes>
            </Suspense>
            <MobileNav />
          </div>
        </Router>
      </WorkoutProvider>
    </UserProvider>
  );
}

export default App;
