import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { LogoutOutlined, UserOutlined, RedoOutlined, IdcardOutlined } from '@ant-design/icons';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ handleLogout }) => {
  const theme = useTheme();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
      <ListItemButton selected={selectedIndex === 'profile'} onClick={(event) => handleListItemClick(event, 'profile')}>
        <ListItemIcon>
          <IdcardOutlined />
        </ListItemIcon>
        <ListItemText primary="Trang cá nhân" />
      </ListItemButton>

      <ListItemButton selected={selectedIndex === 'changepassword'} onClick={(event) => handleListItemClick(event, 'changepassword')}>
        <ListItemIcon>
          <RedoOutlined />
        </ListItemIcon>
        <ListItemText primary="Đổi mật khẩu" />
      </ListItemButton>
      <ListItemButton danger selected={selectedIndex === 2} onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Đăng xuất" />
      </ListItemButton>
    </List>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func
};

export default ProfileTab;
