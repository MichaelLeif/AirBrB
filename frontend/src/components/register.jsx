import React from 'react'
import { apiCall } from '../helpers/apicalls';
import { Container, TextField, Alert, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const RegisterButton = styled(Button)({
  textTransform: 'none',
  padding: '10px 0px',
  borderRadius: '5px',
  backgroundColor: '#e00c64',
  fontSize: '1rem',
  marginTop: '10px',
  marginBottom: '30px',
  width: '100%',
  '&:hover': {
    backgroundColor: '#e00c64',
    borderColor: '#e00c64',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#e00c64',
    borderColor: '#e00c64',
  },
});

const Error = styled(Alert)({
  margin: '10px 0px;'
})

export const Register = () => {
  // Use effect state
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const setToken = (token) => {
    localStorage.setItem('token', token);
  }

  const setUser = (user) => {
    localStorage.setItem('user', user);
  }

  const register = () => {
    if (!passwordsMatch(password, confirmPassword)) {
      return;
    }
    apiCall('POST', '/user/auth/register', { name, email, password }, true)
      .then((data) => {
        setToken(data.token);
        setUser(email);
        navigate('/');
      })
      .catch((err) => {
        console.log('Bad request');
        setError(err.error);
      })
  }

  const passwordsMatch = (p1, p2) => {
    if (p1 !== p2) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  }

  const ErrorMessage = () => {
    return <Error severity="error">{error}</Error>;
  }

  return (
    <>
    <Container maxWidth="sm" className='login-box'>
      <div>
        <div className='login-title'>
          <h3> Register </h3>
        </div>
        <hr/>
        <h2> Welcome to AirBnb </h2>
        {error ? <ErrorMessage/> : null}
        <TextField fullWidth id="login-name" label="Name" type='text' value={name} onChange={e => setName(e.target.value)} variant="outlined" margin="normal"/> <br/>
        <TextField fullWidth id="login-email" label="Email" type='text' value={email} onChange={e => setEmail(e.target.value)} variant="outlined" margin="normal"/> <br/>
        <TextField fullWidth id="login-password" label="Password" type='password' value={password} onChange={e => setPassword(e.target.value)} variant="outlined" margin="normal"/> <br/>
        <TextField fullWidth id="login-confirm-password" label="Confirm your password" type='password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} variant="outlined" margin="normal"/> <br/>
        <RegisterButton variant="contained" disableElevation onSubmit={() => register()}>
          Register
        </RegisterButton>
      </div>
    </Container>
    </>
  )
}
