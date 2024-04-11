import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, IconButton, Toolbar, useMediaQuery } from '@mui/material';

// project import
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';

// assets
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { isMdScreen, isMobile } from 'utils/helper';
import Logo from 'components/Logo/Logo';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ConfigRouter } from 'config_router';
import { useEffect, useState } from 'react';
const { Title } = Typography;

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const getNameFromPath = (path) => {
  const routeFind = Object.values(ConfigRouter).find((item) => {
    if (item.url.length > path) {
      return item.url.includes(path);
    }
    return path === item.url;
  });
  if (routeFind) {
    return routeFind.name;
  }
  return '';
};
const Header = ({ open, handleDrawerToggle, showLogo }) => {
  const theme = useTheme();
  const location = useLocation();
  const { pathname } = location;
  const { t } = useTranslation();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
  const matchDownXS = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentPage, setCurrentPage] = useState('');
  // const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));

  const iconBackColor = 'grey.100';
  const iconBackColorOpen = 'grey.200';
  useEffect(() => {
    setCurrentPage(getNameFromPath(pathname));
  }, [pathname]);
  // common header
  const mainHeader = (
    <Toolbar>
      {showLogo ? null : (
        <IconButton
          disableRipple
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          color="secondary"
          sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor, ml: { xs: 0, lg: -2 } }}
        >
          {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </IconButton>
      )}
      {showLogo && (
        <div style={{ width: '300px' }}>
          <Logo />
        </div>
      )}
      <div style={{ fontSize: '15px', minWidth: '200px', fontWeight: '500' }}>{t(`${currentPage}`)}</div>
      {/* {(isMdScreen() || isMobile()) && (
        <IconButton
          disableRipple
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          color="secondary"
          sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor, ml: { xs: 0, lg: -2 } }}
        >
          {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </IconButton>
      )} */}
      <HeaderContent />
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`
      // boxShadow: theme.customShadows.z1
    }
  };

  return (
    <>
      {!matchDownMD ? (
        <AppBarStyled open={open} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};

Header.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func
};

export default Header;
