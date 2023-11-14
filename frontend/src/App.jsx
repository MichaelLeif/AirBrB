import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Login } from './components/login'
import { Register } from './components/register'
import { apiCall, getToken } from './helpers/apicalls';
import { NavBar } from './components/navbar'
import { MyListings } from './components/my-listings'
import { NewListing } from './components/new-listing'
import { EditListingFetch } from './components/listing-edit-fetch';
import { ListingDataContext } from './listingDataContext';
import { BookingListingFetch } from './components/listing-booking-fetch';
import { Listing } from './pages/Listing'
import { Landing } from './pages/Landing'

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

function App () {
  const [listingData, setListingData] = useState([]);

  return (
    <>
      <BrowserRouter>
        <ListingDataContext.Provider value={{ listingData, setListingData }}>
          <NavBar />
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/hosting' element={<Register />}/>
            <Route path='/listings/:id' element={<EditListingFetch />} />
            <Route path='/listings/reservations/:id' element={<BookingListingFetch />}/>
            <Route path='/listings/my' element={<MyListings />}/>
            <Route path='/listings/new' element={<NewListing />}/>
            <Route path='/listing/:listid/:checkin?/:checkout?' element={<Listing />} />
          </Routes>
        </ListingDataContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
