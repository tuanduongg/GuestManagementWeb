// assets
import { LoginOutlined, ProfileOutlined, UserOutlined, RedoOutlined } from '@ant-design/icons';
import { ConfigRouter } from 'config_router';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  UserOutlined,
  RedoOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const guest = {
  id: 'guests',
  title: 'Thông tin đăng ký khách',
  type: 'group',
  children: [
    {
      id: ConfigRouter.listGuest,
      title: 'Danh sách đăng ký',
      type: 'item',
      url: ConfigRouter.listGuest,
      icon: icons.UserOutlined,
      target: false
    }
  ]
};

export default guest;
