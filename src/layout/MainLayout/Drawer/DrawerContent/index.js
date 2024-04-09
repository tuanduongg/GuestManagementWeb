// project import
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import React, { useEffect, useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import menuItems from '../../../../menu-items/index.js';
import { useTranslation } from 'react-i18next';
import config from 'config';
import { drawerWidth } from 'config';
import { useLocation, useNavigate } from 'react-router-dom';
import { activeItem, openDrawer } from 'store/reducers/menu';
import { useDispatch } from 'react-redux';
import { ConfigRouter } from 'config_router';
import { useSelector } from 'react-redux';
import { isMobile } from 'utils/helper';

// ==============================|| DRAWER CONTENT ||============================== //

//menuItems?.items.map((item)=>{

// })
// console.log('menuitems', menuItems);

const DrawerContent = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openKeys, setOpenKeys] = useState();
  const { drawerOpen, openItem } = useSelector((state) => state.menu);

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type
    };
  }
  useEffect(() => {
    dispatch(activeItem({ openItem: [pathname] }));
    const itemFind = menuItems.items.find((nav) => {
      const checkChild = nav.children.filter((child) => child.id === pathname);
      return checkChild.length > 0;
    });
    if (itemFind) {
      setOpenKeys([itemFind?.id]);
    } else {
      setOpenKeys([]);
    }
  }, [pathname]);
  const itemCustoms = menuItems.items?.map((item) => {
    switch (item?.type) {
      case 'group': {
        let childrenItem = item?.children.map((children) => {
          return getItem(t(children?.title), children?.id, children?.icon);
        });
        const itemCu = getItem(t(item?.title), item?.id, item?.icon, childrenItem, 'group');
        return itemCu;
      }
      case 'collapse': {
        let childrenItem = item?.children.map((children) => {
          return getItem(t(children?.title), children?.id, children?.icon);
        });
        const itemCu = getItem(t(item?.title), item?.id, item?.icon, childrenItem);
        return itemCu;
      }

      default:
        break;
    }
  });

  const onClick = (e) => {
    if (e.key) {
      dispatch(activeItem({ openItem: [e.key] }));
      navigate(e.key);
      if (isMobile()) {
        dispatch(openDrawer({ drawerOpen: false }));
      }
    }
  };
  return (
    <SimpleBar
      sx={{
        '& .simplebar-content': {
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Menu
        onClick={onClick}
        style={{
          width: drawerWidth ?? 250,
          height: '90vh'
        }}
        selectedKeys={openItem}
        onOpenChange={(openKeys) => {
          setOpenKeys(openKeys);
        }}
        openKeys={openKeys}
        mode="inline"
        items={itemCustoms}
      />
    </SimpleBar>
  );
};

export default DrawerContent;
