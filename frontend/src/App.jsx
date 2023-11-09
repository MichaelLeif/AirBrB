import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import { Login } from './components/login'
import { Register } from './components/register'
import { apiCall, getToken } from './helpers/apicalls';
import { NavBar } from './components/navbar'
const Home = () => {
  return <div>
    Home
  </div>
}

const logout = () => {
  apiCall('POST', '/user/auth/logout', {}, getToken(), true)
    .then()
    .catch((err) => {
      console.log(err.error); // TODO CHANGE
    });
}

const Dashboard = () => {
  const navigate = useNavigate();
  return <div>
    Dashboard
    <button onClick={() => {
      localStorage.removeItem('token');
      logout();
      navigate('/');
    }}> Logout </button>
  </div>
}

const ListingOwn = () => {
  <div> own listing </div>
}

function App () {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hosting" element={<Register />}>
            <Route path="listing" element={<ListingOwn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
