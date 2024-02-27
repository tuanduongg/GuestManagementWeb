// material-ui
import { useTheme } from '@mui/material/styles';
import { CardMedia, Typography, Stack } from '@mui/material';
import LOGO from '../../assets/images/logo/favilogo.png';
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <img src={LOGO} alt="Seowonintech" width="40" />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
          HANOI SEOWONINTECH
        </Typography>
      </Stack>
    </>
  );
};

export default Logo;
