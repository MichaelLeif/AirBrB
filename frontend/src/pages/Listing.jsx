import React from 'react'
import {
  useParams
} from 'react-router-dom'
import {
  path
} from './Pages.jsx';

function Listing () {
  const [isLoading, setLoading] = React.useState(true);
  const [listing, setListing] = React.useState({});
  const { listid, checkin, checkout } = useParams();
  const [checkInState, setCheckin] = React.useState(checkin || '');
  const [checkOutState, setCheckout] = React.useState(checkout || '');
  const [booked, setBooked] = React.useState();
  let nights = 0;

  const wrapper = {
    padding: '50px 200px'
  }

  const firstContainer = {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: '30px'
  }

  const firstContainerFlex = {
    width: '100%',
    height: '500px',
    display: 'flex',
    flexDirection: 'row'
  }

  const title = {
    width: '100%',
    height: '40px',
    fontSize: '30px',
    fontWeight: 'bold',
    cursor: 'default'
  }

  const subheader = {
    fontSize: '20px',
    cursor: 'default'
  }

  const thumbnail = {
    width: '75%',
    height: '100%',
  }

  const bookDiv = {
    width: '25%',
    borderRadius: '20px',
    border: '1px solid',
    boxShadow: 'rgb(0, 0, 0, 0.12) 0px 6px 16px',
    marginLeft: '5%',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '15px'
  }

  const dateBook = {
    width: '100%',
    height: '20%',
  }

  const checkDate = {
    height: '60%',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid',
    borderRadius: '8px',
  }

  const dateInput = {
    border: 'none',
    outline: 'none',
    cursor: 'pointer'
  }

  const checkIn = {
    padding: '10px 5px',
  }

  const checkOut = {
    borderLeft: '1px solid',
    height: '100%',
    padding: '10px 5px',
    boxSizing: 'border-box',
  }

  const reserveButton = {
    width: '100%',
    height: '100%',
    fontSize: '20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px'
  }

  const listingInfo = {
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '20px'
  }

  const secondContainer = {
    width: '100%',
    height: 'auto'
  }

  const reviewWrapper = {
    border: '1px solid',
    borderRadius: '20px',
    boxShadow: 'rgb(0, 0, 0, 0.12) 0px 6px 16px',
    padding: '20px',
    overflow: 'auto'
  }

  const reviewContainer = {
    height: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '20px',
  }

  const reviewBox = {
    width: '50%',
    height: 'auto'
  }

  React.useEffect(async () => {
    const response = await fetch(path + `/listings/${listid}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
    if (data.error) {
      alert(data.error);
    } else {
      setListing(data.listing);
      setLoading(false);
    }
  }, []);

  if (checkInState && checkOutState) {
    let timeDuration = new Date(checkOutState) - new Date(checkInState);
    timeDuration = timeDuration / (1000 * 3600 * 24);
    nights = timeDuration;
  }

  if (isLoading) {
    return (
      <div>
        LOADING...
      </div>
    )
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    if (localStorage.getItem('token')) {
      const body = {
        range: {
          checkIn: checkInState,
          checkOut: checkOutState,
          nights
        },
        price: listing.price * nights
      }
      const response = await fetch(path + `/booking/new/${listid}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: localStorage.getItem('token')
        },
        body: JSON.stringify(body)
      })
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setBooked(data.bookingId);
        alert(booked);
      }
    } else {
      alert('bring to login page');
    }
  }

  return (
    <div style={wrapper}>
      <div style={firstContainer}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <span style={title}>{listing.title}, {listing.metadata.type}</span>
          <span style={subheader}>{listing.address.street}, {listing.address.suburb}, {listing.address.city}</span>
        </div>
        <div style={firstContainerFlex}>
          <img style={thumbnail} src={listing.thumbnail} />
          <div style={bookDiv}>
            {
              nights > 0
                ? <span style={title}>${listing.price * nights} <span style={subheader}>per stay</span></span>
                : <span style={title}>${listing.price} <span style={subheader}>per night</span></span>
            }
            <div style={dateBook}>
              <form style={checkDate} onSubmit={(e) => {
                handleBooking(e);
              }}>
                <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                  <div style ={checkIn}>
                    <label htmlFor='check-in'>CHECK-IN</label>
                    <input id='check-in' type='date' style={dateInput} defaultValue={checkin} onChange={(e) => {
                      setCheckin(e.target.value);
                    }}/>
                  </div>
                  <div style={checkOut}>
                    <label htmlFor='check-out'>CHECK-OUT</label>
                    <input id='check-out' type='date' style={dateInput} defaultValue={checkout} onChange={(e) => {
                      setCheckout(e.target.value);
                    }} />
                  </div>
                </div>
                <div>
                  <button style={reserveButton}>
                    RESERVE
                  </button>
                </div>
              </form>
            </div>
            <div style={listingInfo}>
              <span style={title}>Rooms</span>
              <span style={subheader}>Bed: {listing.metadata.bed !== undefined ? listing.metadata.bed : 0}</span>
              <span style={subheader}>Bedrooms: {listing.metadata.bedroom !== undefined ? listing.metadata.bedroom : 0}</span>
              <span style={subheader}>Bathrooms: {listing.metadata.bathroom !== undefined ? listing.metadata.bathroom : 0}</span>
              <span style={title}>Amenities</span>
              {
                listing.metadata.amenities
                  ? listing.metadata.amenities.map((k) => {
                    return (
                      <span key='amenity' style={subheader}>{k}</span>
                    )
                  })
                  : <span style={subheader}>No amenities are available at this stay</span>
              }
              <span style={title}>Ratings</span>
            </div>
          </div>
        </div>
        <div style={secondContainer}>
          <div style={reviewWrapper}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={title}>Reviews</span>
              <button>Create a review</button>
            </div>
            <div style={reviewContainer}>
              <div style={reviewBox}>
                HI
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Listing
