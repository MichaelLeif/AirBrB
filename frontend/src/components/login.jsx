import React from 'react'
import { apiCall } from '../helpers/apicalls';
import { Container, TextField, Alert, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { setToken, setUser } from '../helpers/auth';

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

const IDS = {
  emailError: 'login-email-error',
  passwordError: 'login-password-error',
}

export const login = async (email, password, setError) => {
  try {
    const data = await apiCall('POST', '/user/auth/login', { email, password }, true);
    setToken(data.token);
    setUser(email);
    return true;
  } catch (err) {
    setError(err.error);
    return false;
  }
}

export const Login = ({ onSubmit }) => {
  // Use effect state
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const loginHandler = async (e) => {
    const success = await onSubmit(email, password, setError);
    if (success) {
      console.log('DIRECT');
      navigate('/');
    }
  }

  const ErrorMessage = () => {
    return <Error severity="error">{error}</Error>;
  }

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
          <TextField
            required
            aria-required="true"
            aria-invalid={!email.length}
            aria-describedby={!email.length ? 'login-email-error' : 'login-email-error'}
            fullWidth
            id="login-email"
            label="Email"
            type='text'
            value={email}
            onChange={e => setEmail(e.target.value)}
            variant="outlined"
            margin="normal"/> <br/>
          <TextField
            required
            aria-required="true"
            aria-invalid={!password.length}
            aria-describedby={!password.length ? IDS.passwordError : IDS.emailError}
            fullWidth
            id="login-password"
            label="Password"
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"/> <br/>
          <RegisterButton type="submit" variant="contained" disableElevation onClick={loginHandler}>
            Login
          </RegisterButton>
        </div>
      </Container>
    </>
  )
}
