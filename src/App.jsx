import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Dashboard from './components/Dashboard.jsx';
import Onboarding from './components/Onboarding.jsx';
import Auth from './pages/Auth.jsx';
import Report from './pages/Report.jsx';

export default function App() {
  const [view, setView] = useState('home'); // home, auth, onboarding, study, report
  const [userData, setUserData] = useState(null);
  const [lastSessionData, setLastSessionData] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (locally)
    const savedUser = localStorage.getItem('blinkwise_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserData(user);
      // Sync with backend to get latest data
      import('./utils/api').then(({ getProfile }) => {
        getProfile(user.email).then(profile => {
          if (profile) {
            setUserData(profile);
            localStorage.setItem('blinkwise_user', JSON.stringify(profile));
          }
        });
      });
    } else {
      setView('auth');
    }
  }, []);

  const handleStart = () => {
    if (!userData) setView('auth');
    else if (!userData.age) setView('onboarding');
    else setView('study');
  };

  const handleAuthSuccess = (data) => {
    setUserData(data);
    localStorage.setItem('blinkwise_user', JSON.stringify(data));
    import('./utils/api').then(({ saveProfile }) => saveProfile(data));
    setView('onboarding');
  };

  const handleOnboardingComplete = (data) => {
    const fullData = { ...userData, ...data };
    setUserData(fullData);
    import('./utils/api').then(({ saveProfile }) => saveProfile(fullData));
    setView('study');
  };

  const handleSessionEnd = (sessionData) => {
    setLastSessionData(sessionData);
    import('./utils/api').then(({ saveSession }) => saveSession(userData.email, sessionData));
    setView('report');
  };

  const handleLogout = () => {
    localStorage.removeItem('blinkwise_user');
    setUserData(null);
    setView('auth');
  };

  // Full-screen views
  if (view === 'auth') return <Auth onAuthSuccess={handleAuthSuccess} />;
  if (view === 'onboarding') return <Onboarding onComplete={handleOnboardingComplete} />;
  if (view === 'report') return <Report sessionData={lastSessionData} onBack={() => setView('home')} />;

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary selection:text-white">
      <Navbar userData={userData} onSignInClick={() => setView('auth')} onLogout={handleLogout} />
      
      <main>
        {view === 'home' && <Hero onStart={handleStart} />}
        {view === 'auth' && <Auth onSuccess={handleAuthSuccess} />}
        {view === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}
        {view === 'study' && (
          <div className="container mx-auto px-6 py-12">
            <Dashboard onEnd={handleSessionEnd} />
          </div>
        )}
        {view === 'report' && <Report data={lastSessionData} onBack={() => setView('study')} />}
      </main>
    </div>
  );
}
