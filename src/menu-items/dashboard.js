// assets
import { CarOutlined, FormOutlined } from '@ant-design/icons';
import { ConfigRouter } from 'config_router';

// icons
const icons = {
  CarOutlined,

  FormOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'guest',
  title: 'Thông tin đăng ký xe',
  type: 'group',
  children: [
    {
      id: ConfigRouter.listStruck,
      title: 'Danh sách đăng ký',
      type: 'item',
      url: ConfigRouter.listStruck,
      icon: icons.CarOutlined,
      breadcrumbs: false
    },
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
