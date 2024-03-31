import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { ConfigRouter } from 'config_router';

// render - dashboard
// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));
const ListStruck = Loadable(lazy(() => import('pages/list-struck/ListStruck')));
const HomePage = Loadable(lazy(() => import('pages/homepage/HomePage')));
const ListGuest = Loadable(lazy(() => import('pages/list-guest/ListGuest')));
const AccountPage = Loadable(lazy(() => import('pages/account')));

// render - utilities

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: ConfigRouter.listGuest,
      element: <ListGuest />
    },
    {
      path: ConfigRouter.user,
      element: <AccountPage />
    }
  ]
};

export default MainRoutes;
