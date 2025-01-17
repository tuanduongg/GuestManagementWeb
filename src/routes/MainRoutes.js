import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { ConfigRouter } from 'config_router';
import Concept from 'pages/concept/Concept';

// render - dashboard
// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));
const ListStruck = Loadable(lazy(() => import('pages/list-struck/ListStruck')));
const ListProduct = Loadable(lazy(() => import('pages/list-product/ListProduct')));
const ListGuest = Loadable(lazy(() => import('pages/list-guest/ListGuest')));
const AccountPage = Loadable(lazy(() => import('pages/account')));
const ManagerProduct = Loadable(lazy(() => import('pages/manager-product/ManagerProduct')));
const ManageDevice = Loadable(lazy(() => import('pages/manage-device/ManageDevice')));
const Order = Loadable(lazy(() => import('pages/order/Order')));

// render - utilities

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: ConfigRouter.listGuest.url,
      element: <ListGuest />
    },
    {
      path: ConfigRouter.user.url,
      element: <AccountPage />
    },
    {
      path: ConfigRouter.listProduct.url,
      element: <ListProduct />
    },
    {
      path: ConfigRouter.managementProduct.url,
      element: <ManagerProduct />
    },
    {
      path: ConfigRouter.listOrder.url,
      element: <Order />
    },
    {
      path: ConfigRouter.manageDevice.url,
      element: <ManageDevice />
    },
    {
      path: ConfigRouter.concept.url,
      element: <Concept />
    }
  ]
};

export default MainRoutes;
