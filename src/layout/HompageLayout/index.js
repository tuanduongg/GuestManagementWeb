import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { ConfigRouter } from 'config_router';
import Header from 'layout/MainLayout/Header/index';
import BackGround from '../../assets/images/background/background_homepage.jpg';
// ==============================|| MAIN LAYOUT ||============================== //

const HomePageLayout = () => {
  // const classes = useStyles();
  const navigate = useNavigate();
  useEffect(() => {
    console.log('vaooooo');
    checkProfile();
  }, []);
  const checkProfile = async () => {
    const rest = await restApi.get(RouterAPI.profile);
    if (rest?.status !== 200) {
      navigate(ConfigRouter.login.url);
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* <Header showLogo={true} /> */}
      {/* <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 }, marginTop: '40px' }}>
        <Outlet />
      </Box> */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BackGround})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default HomePageLayout;
