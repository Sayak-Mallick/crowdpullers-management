import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';
import ClientPage from './pages/ClientPage';
import CreateClient from './pages/CreateClient';
import EventsPage from './pages/EventsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'clients',
        element: <ClientPage />,
      },
      {
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'clients/create',
        element: <CreateClient />
      }
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
]);
