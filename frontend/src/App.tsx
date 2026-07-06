import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

type Route = '/' | '/dashboard';

function App() {
  const [route, setRoute] = useState<Route>(() => {
    const hash = window.location.hash.replace('#', '') || '/';
    return hash === '/dashboard' ? '/dashboard' : '/';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setRoute(hash === '/dashboard' ? '/dashboard' : '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function navigate(to: Route) {
    window.location.hash = to;
    setRoute(to);
  }

  return route === '/dashboard' ? <DashboardPage navigate={navigate} /> : <LoginPage navigate={navigate} />;
}

export default App;
