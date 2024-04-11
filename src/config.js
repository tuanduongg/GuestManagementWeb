// ==============================|| THEME CONFIG  ||============================== //

const config = {
  defaultPath: '/',
  fontFamily: `'Public Sans', sans-serif`,
  i18n: 'en',
  miniDrawer: false,
  container: true,
  mode: 'light',
  presetColor: 'default',
  themeDirection: 'ltr',
  dateFormat: 'DD/MM/YYYY',
  hourFormat: 'HH:mm',
  colorLogo: '#005494',
  urlImageSever: process.env.REACT_APP_PREFIX_IMAGE + '/'
};

export default config;
export const drawerWidth = 250;
