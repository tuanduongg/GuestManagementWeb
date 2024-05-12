// assets
import { LoginOutlined, ProductOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { ConfigRouter } from 'config_router';


// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const goods = {
  id: 'guests',
  title: 'Vật tư tiêu hao',
  type: 'group',
  children: [
    {
      id: ConfigRouter.listProduct.url,
      title: 'Sản phẩm',
      type: 'item',
      url: ConfigRouter.listProduct.url,
      icon: <ProductOutlined />,
      target: false
    },
    {
      id: ConfigRouter.listOrder.url,
      title: 'Hoá đơn',
      type: 'item',
      url: ConfigRouter.listOrder.url,
      icon: <UserOutlined />,
      target: false
    },
  ]
};

export default goods;
