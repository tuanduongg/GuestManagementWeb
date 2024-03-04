import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { ConfigRouter } from 'config_router';

// render - dashboard
// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));
const ListStruck = Loadable(lazy(() => import('pages/list-struck/ListStruck')));
const CarRegister = Loadable(lazy(() => import('pages/car-register/CarRegister')));
const ListGuest = Loadable(lazy(() => import('pages/list-guest/ListGuest')));
const Account = Loadable(lazy(() => import('pages/account/Account')));

// render - utilities

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    // {
    //   path: ConfigRouter.listStruck,
    //   element: <ListStruck />
    // },
    {
      path: ConfigRouter.listGuest,
      element: <ListGuest />
    },
    // {
    //   path: ConfigRouter.addListStruck,
    //   element: <CarRegister />
    // },
    {
      path: ConfigRouter.user,
      element: <Account />
    }
    // {
    //   path: 'dashboard',
    //   children: [
    //     {
    //       path: 'default',
    //       element: <DashboardDefault />
    //     }
    //   ]
    // },
  ]
};

export default MainRoutes;
