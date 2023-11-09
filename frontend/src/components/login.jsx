import React from 'react'
import { apiCall } from '../helpers/apicalls';
import { Container, TextField, Alert, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const Error = styled(Alert)({
  margin: '10px 0px;'
})

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

export const Login = () => {
  // Use effect state
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const setToken = (token) => {
    localStorage.setItem('token', token);
  }

  const login = async () => {
    try {
      const data = await apiCall('POST', '/user/auth/login', { email, password }, true);
      setToken(data.token);
      return true;
    } catch (err) {
      console.log('Bad request');
      setError(err.error);
      return false;
    }
  }

  const ErrorMessage = () => {
    return <Error severity="error">{error}</Error>;
  }
  const navigate = useNavigate();

  return (
    <>
      <Container maxWidth="sm" className='login-box'>
        <div>
          <div className='login-title'>
            <h3> Login </h3>
          </div>
          <hr/>
          <h2> Welcome to AirBnb </h2>
          {error ? <ErrorMessage/> : null}
          <TextField fullWidth id="login-email" label="Email" type='text' value={email} onChange={e => setEmail(e.target.value)} variant="outlined" margin="normal"/> <br/>
          <TextField fullWidth id="login-password" label="Password" type='password' value={password} onChange={e => setPassword(e.target.value)} variant="outlined" margin="normal"/> <br/>
          <RegisterButton variant="contained" disableElevation onClick={async () => {
            const success = await login();
            if (success) {
              console.log('DIRECT');
              navigate('/');
            }
          }}>
            Login
          </RegisterButton>
        </div>
      </Container>
    </>
  )
}
