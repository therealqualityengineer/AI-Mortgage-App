import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomersListPage from './pages/CustomersListPage';
import AddCustomerPage from './pages/AddCustomerPage';
import ViewCustomerPage from './pages/ViewCustomerPage';
import EditCustomerPage from './pages/EditCustomerPage';
import type { Route } from './types/route';

function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function navigate(to: Route) {
    const hash = routeToHash(to);
    window.location.hash = hash;
    setRoute(to);
  }

  function render() {
    switch (route.name) {
      case 'login':
        return <LoginPage navigate={navigate} />;
      case 'dashboard':
        return <DashboardPage navigate={navigate} />;
      case 'customers-list':
        return <CustomersListPage navigate={navigate} />;
      case 'customer-add':
        return <AddCustomerPage navigate={navigate} />;
      case 'customer-view':
        return <ViewCustomerPage id={route.id} navigate={navigate} />;
      case 'customer-edit':
        return <EditCustomerPage id={route.id} navigate={navigate} />;
      default:
        return <LoginPage navigate={navigate} />;
    }
  }

  return render();
}

function parseHash(hash: string): Route {
  // Robust normalization: handle "#", "#/foo", "#foo", "foo", etc.
  let p = (hash || '').replace(/^#/, '');
  if (!p.startsWith('/')) p = '/' + p;
  const path = p.toLowerCase();

  if (path === '/' || path === '') return { name: 'login' };
  if (path === '/dashboard') return { name: 'dashboard' };
  if (path === '/customers' || path === '/customers/') return { name: 'customers-list' };
  if (path === '/customers/new') return { name: 'customer-add' };

  const viewMatch = path.match(/^\/customers\/([0-9a-f-]{36})$/i);
  if (viewMatch) {
    return { name: 'customer-view', id: viewMatch[1] };
  }

  const editMatch = path.match(/^\/customers\/([0-9a-f-]{36})\/edit$/i);
  if (editMatch) {
    return { name: 'customer-edit', id: editMatch[1] };
  }

  return { name: 'dashboard' };
}

function routeToHash(route: Route): string {
  switch (route.name) {
    case 'login': return '/';
    case 'dashboard': return '/dashboard';
    case 'customers-list': return '/customers';
    case 'customer-add': return '/customers/new';
    case 'customer-view': return `/customers/${route.id}`;
    case 'customer-edit': return `/customers/${route.id}/edit`;
    default: return '/dashboard';
  }
}

export default App;
