import { apiCall } from '../helpers/apicalls';

export const setBookingListingData = (listingId, setData) => {
  apiCall('GET', '/bookings', {}, true)
    .then((booking) => {
      const listingReservations = booking.bookings.filter(x => parseInt(x.listingId) === listingId);
      apiCall('GET', '/listings/' + listingId, {}, true)
        .then((listing) => {
          setData({
            title: listing.listing.title,
            data: listingReservations
          });
          console.log({
            title: listing.listing.title,
            data: listingReservations
          });
        })
    })
}
