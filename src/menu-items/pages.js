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

const pages = {
  id: 'pages',
  title: 'Thông tin tài khoản',
  type: 'group',
  children: [
    {
      id: ConfigRouter.user,
      title: 'Người dùng',
      type: 'item',
      url: ConfigRouter.user,
      icon: icons.UserOutlined,
      target: false
    },
    {
      id: ConfigRouter.pwRecovery,
      title: 'Lấy lại mật khẩu',
      type: 'item',
      url: ConfigRouter.pwRecovery,
      icon: icons.RedoOutlined,
      target: false
    }
  ]
};

export default pages;
