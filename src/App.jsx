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
    import('./utils/api').then(({ getProfile }) => {
      getProfile().then(profile => {
        if (profile && profile.name) setUserData(profile);
      });
    });
  }, []);

  const handleStart = () => {
    if (!userData) setView('auth');
    else if (!userData.age) setView('onboarding');
    else setView('study');
  };

  const handleAuthSuccess = (data) => {
    setUserData(data);
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
    import('./utils/api').then(({ saveSession }) => saveSession(sessionData));
    setView('report');
  };

  // Full-screen views
  if (view === 'auth') return <Auth onAuthSuccess={handleAuthSuccess} />;
  if (view === 'onboarding') return <Onboarding onComplete={handleOnboardingComplete} />;
  if (view === 'report') return <Report sessionData={lastSessionData} onBack={() => setView('home')} />;

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary selection:text-white">
      <Navbar userData={userData} onSignInClick={() => setView('auth')} />
      
      <main>
        {view === 'home' && <Hero onStart={handleStart} />}
        {view === 'study' && (
          <div className="container mx-auto px-6 py-12">
            <Dashboard onEnd={handleSessionEnd} />
          </div>
        )}
      </main>
    </div>
  );
}
