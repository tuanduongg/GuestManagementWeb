// assets
import { LoginOutlined, ProfileOutlined, UserOutlined, RedoOutlined } from '@ant-design/icons';
import { ConfigRouter } from 'config_router';
// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'pages',
  title: 'sidebar_manage_acc',
  type: 'group',
  children: [
    {
      id: ConfigRouter.user,
      title: 'sibar_acc',
      type: 'item',
      url: ConfigRouter.user,
      icon: <ProfileOutlined />,
      target: false
    }
    // {
    //   id: ConfigRouter.pwRecovery,
    //   title: 'Lấy lại mật khẩu',
    //   type: 'item',
    //   url: ConfigRouter.pwRecovery,
    //   icon: icons.RedoOutlined,
    //   target: false
    // }
  ]
};

export default pages;
