import React from 'react'
import { apiCall } from '../helpers/apicalls';
import { ListingReservations } from './listing-booking';

export const setBookingListingData = (listingId, setData) => {
  apiCall('GET', '/bookings', {}, true)
    .then((booking) => {
      const listingReservations = booking.bookings.filter(x => parseInt(x.listingId) === listingId);
      apiCall('GET', '/listings/' + listingId, {}, true)
        .then((listing) => {
          setData({
            title: listing.listing.title,
            publishTime: listing.listing.metadata.publishTime,
            data: listingReservations
          });
          console.log({
            title: listing.listing.title,
            publishTime: listing.listing.metadata.publishTime,
            data: listingReservations
          });
        })
    })
}

export const BookingListingFetch = () => {
  // const params = useParams();
  // const listingId = parseInt(params.id);
  // const [data, setData] = useState(null);

  // if (!data) {
  //   setBookingListingData(listingId, setData);
  // }

  return <ListingReservations />;
}
