import React from 'react'
import Avatar from '@mui/material/Avatar';
import logo from '../assets/airbnb-logo.png';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate, Link } from 'react-router-dom';
import { apiCall, getToken } from '../helpers/apicalls';

const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    apiCall('POST', '/user/auth/logout', {}, true)
      .then(() => {
        localStorage.removeItem('token');
      })
  }

  const userValid = getToken();
  const LogoutButton = () => {
    return (
    <MenuItem
      component={Link} to='/login' onClick={() => logout()}>
        Logout
    </MenuItem>)
  }

  const RegisterOrLogin = () => {
    return (
      <div>
        <MenuItem component={Link} to='/register'>
          Sign up
        </MenuItem>
        <MenuItem component={Link} to='/login'>
          Login
        </MenuItem>
      </div>
    );
  }

  const ShowListings = () => {
    return (
      <div>
        <MenuItem component={Link} to='/'>
          All listings
        </MenuItem>
        <MenuItem component={Link} to='/listings/my'>
          Your listings
        </MenuItem>
        <Divider />
      </div>
    );
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar src="/broken-image.jpg" />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {!userValid ? <RegisterOrLogin/> : null}
        {userValid ? <ShowListings/> : null}
        {userValid ? <LogoutButton/> : null}
      </Menu>
    </React.Fragment>
  );
}

const Logo = () => {
  const navigate = useNavigate();
  return (
  <img id='logo' src={logo} onClick={() => navigate('/')} alt='airbnb logo and name'/>);
}

export const NavBar = () => {
  return (
    <>
      <div id='nav-bar'>
        <Logo />
        <AccountMenu />
      </div>
    </>
  )
}
