import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login, login } from './components/login'
import { Register } from './components/register'
import { NavBar } from './components/navbar'
import { MyListings } from './components/my-listings'
import { NewListing } from './components/new-listing'
import { EditListingFetch } from './components/listing-edit-fetch';
import { ListingDataContext } from './listingDataContext';
import { BookingListingFetch } from './components/listing-booking-fetch';
import { Listing } from './pages/Listing'
import { Landing } from './pages/Landing'

function App () {
  const [listingData, setListingData] = useState([]);

  return (
    <>
      <BrowserRouter>
        <ListingDataContext.Provider value={{ listingData, setListingData }}>
          <NavBar />
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/login' element={<Login onSubmit={login}/>} />
            <Route path='/register' element={<Register />} />
            <Route path='/hosting' element={<Register />}/>
            <Route path='/listings/:id' element={<EditListingFetch />} />
            <Route path='/listings/reservations/:id' element={<BookingListingFetch />}/>
            <Route path='/listings/my' element={<MyListings />}/>
            <Route path='/listings/new' element={<NewListing />}/>
            <Route path='/listing/:listid/:accepted/:checkin?/:checkout?/' element={<Listing />} />
          </Routes>
        </ListingDataContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
