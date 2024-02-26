// assets
import { CarOutlined, FormOutlined, UserOutlined } from '@ant-design/icons';
import { ConfigRouter } from 'config_router';

// icons
const icons = {
  CarOutlined,
  UserOutlined,
  FormOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'guest',
  title: 'Quản lý đăng ký khách',
  type: 'group',
  children: [
    {
      id: ConfigRouter.listGuest,
      title: 'Danh sách đăng ký khách',
      type: 'item',
      url: ConfigRouter.listGuest,
      icon: icons.UserOutlined,
      target: false
    },
    // {
    //   id: ConfigRouter.listStruck,
    //   title: 'Danh sách đăng ký xe',
    //   type: 'item',
    //   url: ConfigRouter.listStruck,
    //   icon: icons.CarOutlined,
    //   breadcrumbs: false
    // },
    {
      id: ConfigRouter.addListStruck,
      title: 'Đăng ký xe',
      type: 'item',
      url: ConfigRouter.addListStruck,
      icon: icons.FormOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
