import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { apiCall } from '../helpers/apicalls';
import { Loading } from '../helpers/generics'
import { ListingReservations } from './listing-booking';

export const BookingListingFetch = () => {
  const params = useParams();
  const listingId = parseInt(params.id);
  const [data, setData] = useState(null);

  if (!data) {
    apiCall('GET', '/bookings', {}, true)
      .then((data) => {
        const listingReservations = data.bookings.filter(x => parseInt(x.listingId) === listingId);
        apiCall('GET', '/listings', {}, true)
          .then((title) => {
            console.log('title', title.listings);
            const listings = title.listings.find(x => parseInt(x.id) === listingId);
            setData({
              title: listings.title,
              data: listingReservations
            })
          })
      })
  }

  return data ? <ListingReservations data={data}/> : <Loading />
}
