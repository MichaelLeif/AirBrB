import React, { useContext } from 'react'
import { apiCall } from '../helpers/apicalls';
import { TextField, Alert, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../loginContext';
import { AuthBox, AuthTitle, Line } from '../helpers/generics';
import { setToken, setUser } from '../helpers/auth';
import { Link } from '@mui/joy';
const RegisterButton = styled(Button)({
  textTransform: 'none',
  padding: '10px 0px',
  borderRadius: '5px',
  backgroundColor: '#e00c64',
  fontSize: '1rem',
  marginTop: '10px',
  marginBottom: '10px',
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
  const { userLoggedIn, setUserLoggedIn } = useContext(LoginContext)
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  console.log(userLoggedIn);

  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && window.location.href.match('http://localhost:3000/register')) {
      register(name, email, password, confirmPassword);
    }
  })

  const register = (name, email, password, confirmPassword) => {
    console.log(register)
    if (!passwordsMatch(password, confirmPassword)) {
      return;
    }
    apiCall('POST', '/user/auth/register', { name, email, password }, true)
      .then((data) => {
        setToken(data.token);
        setUser(email);
        setUserLoggedIn(true);
        navigate('/');
      })
      .catch((err) => {
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
    <AuthBox maxWidth="sm">
      <div>
        <AuthTitle>
          <h3> Register </h3>
        </AuthTitle>
        <Line/>
        <h2> Welcome to AirBnb </h2>
        {error ? <ErrorMessage/> : null}
        <TextField
          required
          aria-required="true"
          aria-invalid={!name.length}
          aria-describedby={!name.length ? 'register-name-error' : 'register-name'}
          fullWidth
          id="register-name"
          label="Name"
          type='text'
          value={name}
          onChange={e => setName(e.target.value)}
          variant="outlined"
          margin="normal"/> <br/>
        <TextField
          required
          aria-required="true"
          aria-invalid={!email.length}
          aria-describedby={!email.length ? 'register-email-error' : 'register-email'}
          fullWidth
          id="register-email"
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
          aria-describedby={!password.length ? 'register-password-error' : 'register-password'}
          fullWidth
          id="register-password"
          label="Password"
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          variant="outlined"
          margin="normal"/> <br/>
        <TextField
          required
          aria-required="true"
          aria-invalid={!confirmPassword.length}
          aria-describedby={!confirmPassword.length ? 'register-confirmPassword-error' : 'register-confirmPassword'}
          fullWidth
          id="login-confirm-password"
          label="Confirm your password"
          type='password'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          variant="outlined"
          margin="normal"/> <br/>
        <RegisterButton variant="contained" disableElevation onClick={() => register(name, email, password, confirmPassword)}>
          Register
        </RegisterButton>
        <p>
          <b>Already have an account? </b>
          <Link onClick={() => navigate('/login')} >
            Click here
          </Link>
        </p>
      </div>
    </AuthBox>
  )
}
