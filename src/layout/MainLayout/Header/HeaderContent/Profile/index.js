import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Cascader } from 'antd';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  IconButton,
  Paper,
  Popper,
  Stack,
  Tab,
  Tabs,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import './profile.style.css';

// assets
import { IdcardOutlined, LogoutOutlined, CheckOutlined, TranslationOutlined, RedoOutlined } from '@ant-design/icons';
import { logout } from 'utils/helper';
import { OPTION_LANGUAGE } from './profile.service';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`
  };
}

const getDataUser = () => {
  const dataString = localStorage.getItem('DATA_USER');
  if (dataString) {
    const dataObj = JSON.parse(dataString);
    return dataObj;
  }
  return {};
};

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const [value, setValue] = useState(0);
  const [valueLanguage, setValueLanguage] = useState(['vn']);
  const [dataUser, setDataUser] = useState(getDataUser());
  const [itemSelect, setItemSelect] = useState('');
  const theme = useTheme();

  const handleLogout = async () => {
    logout();
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef?.current && anchorRef?.current?.contains(event?.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, item) => {
    setItemSelect(item);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const iconBackColorOpen = 'grey.300';


  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar alt="profile user" sx={{ width: 32, height: 32 }}>
            {dataUser?.username ? dataUser?.username[0] : ''}
          </Avatar>
          <Typography variant="subtitle1">{dataUser?.username}</Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 250
                  }
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar alt="profile user" sx={{ width: 32, height: 32 }}>
                              {dataUser?.username ? dataUser?.username[0] : ''}
                            </Avatar>
                            <Stack>
                              <Typography variant="h6">{dataUser?.username}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {dataUser?.role?.ROLE_NAME}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                    {open && (
                      <>
                        {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize'
                              }}
                              icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Cá nhân"
                              {...a11yProps(0)}
                            />
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize'
                              }}
                              icon={<SettingOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Cài đặt"
                              {...a11yProps(1)}
                            />
                          </Tabs>
                        </Box> */}
                        <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
                          {/* <ListItemButton selected={itemSelect === 'profile'} onClick={(event) => handleListItemClick(event, 'profile')}>
                            <ListItemIcon>
                              <IdcardOutlined />
                            </ListItemIcon>
                            <ListItemText primary="Trang cá nhân" />
                          </ListItemButton> */}

                          <ListItemButton
                            selected={itemSelect === 'changepassword'}
                            onClick={(event) => handleListItemClick(event, 'changepassword')}
                          >
                            <ListItemIcon>
                              <RedoOutlined />
                            </ListItemIcon>
                            <ListItemText primary="Đổi mật khẩu" />
                          </ListItemButton>
                          <Cascader
                            value={valueLanguage}
                            placement={'left'}
                            options={[
                              {
                                value: 'vn',
                                label: (
                                  <>
                                    {valueLanguage && valueLanguage.includes('vn') && <CheckOutlined style={{ color: '#1677ff' }} />} Việt
                                    Nam
                                  </>
                                )
                              },
                              {
                                value: 'ko',
                                label: (
                                  <>
                                    {valueLanguage && valueLanguage.includes('ko') && <CheckOutlined style={{ color: '#1677ff' }} />} Korean
                                  </>
                                )
                              },
                              {
                                value: 'en',
                                label: (
                                  <>
                                    {valueLanguage && valueLanguage.includes('en') && <CheckOutlined style={{ color: '#1677ff' }} />}{' '}
                                    English
                                  </>
                                )
                              }
                            ]}
                            onChange={(_, selectedOptions) => {
                              const value = selectedOptions[0].value;
                              setValueLanguage([value]);
                            }}
                          >
                            <ListItemButton
                              selected={itemSelect === 'language'}
                              onClick={(event) => handleListItemClick(event, 'language')}
                            >
                              <ListItemIcon>
                              <TranslationOutlined />
                              </ListItemIcon>
                              <ListItemText primary="Ngôn ngữ" />
                            </ListItemButton>
                          </Cascader>
                          <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                              <LogoutOutlined />
                            </ListItemIcon>
                            <ListItemText primary="Đăng xuất" />
                          </ListItemButton>
                        </List>
                        {/* <TabPanel value={value} index={0} dir={theme.direction}>
                          <ProfileTab handleLogout={handleLogout} />
                        </TabPanel> */}
                        {/* <TabPanel value={value} index={1} dir={theme.direction}>
                          <SettingTab />
                        </TabPanel> */}
                      </>
                    )}
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
