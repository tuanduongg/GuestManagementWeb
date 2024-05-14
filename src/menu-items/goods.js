// assets
import { LoginOutlined, ProductOutlined, UserOutlined, ShoppingCartOutlined,InsertRowAboveOutlined } from '@ant-design/icons';
import { ConfigRouter } from 'config_router';


// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const goods = {
  id: 'guests',
  title: 'consumables',
  type: 'group',
  children: [
    {
      id: ConfigRouter.listProduct.url,
      title: 'listProduct',
      type: 'item',
      url: ConfigRouter.listProduct.url,
      icon: <ProductOutlined />,
      target: false
    },
    {
      id: ConfigRouter.listOrder.url,
      title: 'order',
      type: 'item',
      url: ConfigRouter.listOrder.url,
      icon: <UserOutlined />,
      target: false
    },
    {
      id: ConfigRouter.managementProduct.url,
      title: 'manageProduct',
      type: 'item',
      url: ConfigRouter.managementProduct.url,
      icon: <InsertRowAboveOutlined />,
      target: false
    },
    
  ]
};

export default goods;
