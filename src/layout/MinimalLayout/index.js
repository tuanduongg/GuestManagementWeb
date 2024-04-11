import { ConfigRouter } from 'config_router';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    checkProfile();
  }, []);
  const checkProfile = async () => {
    const rest = await restApi.get(RouterAPI.profile);
    if (rest?.status === 200) {
      navigate(ConfigRouter.listGuest.url);
    }
  };
  return (
    <>
      <Outlet />
    </>
  );
};

export default MinimalLayout;
