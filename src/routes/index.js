import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import HomePageLayout from 'layout/HompageLayout';
import AuthLogin from 'pages/authentication/auth-forms/AuthLogin';
import { ConfigRouter } from 'config_router';
import Loadable from 'components/Loadable';
import { lazy } from 'react';

// import HomePage from 'pages/homepage/HomePage';
const HomePage = Loadable(lazy(() => import('pages/homepage/HomePage')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([
    MainRoutes,
    LoginRoutes,
    {
      path: '/',
      element: <HomePageLayout />,
      children: [
        {
          path: ConfigRouter.homePage.url,
          element: <HomePage />
        }
      ]
    }
  ]);
}
