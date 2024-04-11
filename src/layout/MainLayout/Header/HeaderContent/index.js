// material-ui
import { Box } from '@mui/material';

// project import
import Profile from './Profile';
import Notification from './Notification';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  // const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      <Box sx={{ width: '100%', ml: 1 }} />
      <Profile />
    </>
  );
};

export default HeaderContent;
