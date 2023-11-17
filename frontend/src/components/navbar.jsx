import React, { useContext } from 'react'
import Avatar from '@mui/material/Avatar';
import logo from '../assets/airbnb-logo.png';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate, Link } from 'react-router-dom';
import { apiCall } from '../helpers/apicalls';
import { styled } from '@mui/material/styles';
import { LoginContext } from '../loginContext';

const AccountMenu = () => {
  const { userLoggedIn, setUserLoggedIn } = useContext(LoginContext)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    apiCall('POST', '/user/auth/logout', {}, true);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserLoggedIn(false);
  }

  const LogoutButton = () => {
    return (
    <MenuItem
      component={Link} to='/login' id="logout-tab" onClick={() => logout()}>
        Logout
    </MenuItem>)
  }

  const RegisterOrLogin = () => {
    return (
      <div>
        <MenuItem id="register-tab" component={Link} to='/register'>
          Sign up
        </MenuItem>
        <MenuItem id="login-tab" component={Link} to='/login'>
          Login
        </MenuItem>
      </div>
    );
  }

  const ShowListings = () => {
    return (
      <div>
        <MenuItem id="all-listings-tab" component={Link} to='/'>
          All listings
        </MenuItem>
        <MenuItem id="my-listings-tab"component={Link} to='/listings/my'>
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
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {!userLoggedIn ? <RegisterOrLogin/> : null}
        {userLoggedIn ? <ShowListings/> : null}
        {userLoggedIn ? <LogoutButton/> : null}
      </Menu>
    </React.Fragment>
  );
}

const HoverableLogo = styled('img')(() => ({
  '&:hover': {
    cursor: 'pointer'
  },
  height: '40px',
}))

const Logo = () => {
  const navigate = useNavigate();
  return (
  <HoverableLogo id='logo' src={logo} onClick={() => navigate('/')} alt='airbnb logo and name'/>);
}

const NavBarDisplay = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxSizing: 'content-box',
  height: '80px',
  padding: '10px 80px',
  borderBottom: '1px solid rgb(233, 233, 233)',
})

export const NavBar = () => {
  return (
    <>
      <NavBarDisplay>
        <Logo />
        <AccountMenu />
      </NavBarDisplay>
    </>
  )
}
