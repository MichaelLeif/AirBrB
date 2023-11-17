import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login, login } from './components/login'
import { Register } from './components/register'
import { NavBar } from './components/navbar'
import { MyListings } from './components/my-listings'
import { NewListing } from './components/new-listing'
import { EditListingFetch } from './components/listing-edit-fetch';
import { ListingDataContext } from './listingDataContext';
import { LoginContext } from './loginContext';
import { ListingReservations } from './components/listing-booking';
import { Listing } from './pages/Listing'
import { Landing } from './pages/Landing'
import { getToken } from './helpers/auth';

function App () {
  const [listingData, setListingData] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(getToken());

  return (
    <>
      <BrowserRouter>
        <ListingDataContext.Provider value={{ listingData, setListingData }}>
          <LoginContext.Provider value={{ userLoggedIn, setUserLoggedIn }}>
            <NavBar />
            <Routes>
              <Route path='/' element={<Landing />} />
              <Route path='/login' element={<Login onSubmit={login}/>} />
              <Route path='/register' element={<Register />} />
              <Route path='/hosting' element={<Register />}/>
              <Route path='/listings/:id' element={<EditListingFetch />} />
              <Route path='/listings/reservations/:id' element={<ListingReservations />}/>
              <Route path='/listings/my' element={<MyListings />}/>
              <Route path='/listings/new' element={<NewListing />}/>
              <Route path='/listing/:listid/:accepted/:checkin?/:checkout?/' element={<Listing />} />
            </Routes>
          </LoginContext.Provider>
        </ListingDataContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
