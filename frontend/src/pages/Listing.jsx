import React from 'react'
import {
  useParams
} from 'react-router-dom'
import {
  path
} from './Pages.jsx';
import Rating from '@mui/material/Rating';

function Listing () {
  const [isLoading, setLoading] = React.useState(true);
  const [listing, setListing] = React.useState({});
  const { listid, checkin, checkout } = useParams();
  const [checkInState, setCheckin] = React.useState(checkin || '');
  const [checkOutState, setCheckout] = React.useState(checkout || '');
  const [booked, setBooked] = React.useState();
  const [review, setReview] = React.useState(false);
  let nights = 0;
  let rating = 0;

  const wrapper = {
    padding: '50px 200px',
    opacity: review ? '0.2' : '1'
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
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    rowGap: '30px',
    marginTop: '20px',
  }

  const reviewBox = {
    width: '40%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column'
  }

  const reviewPopupWrapper = {
    position: 'fixed',
    top: '0',
    width: '100%',
    height: '750px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const reviewPopUpContainer = {
    width: '40%',
    height: '50%',
    border: '1px solid',
    borderRadius: '20px',
    padding: '10px 10px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  }

  const reviewPopUp = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
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

  const handleReview = async (e) => {
    e.preventDefault();
    setReview(false);
  }

  const createReviewBox = (prop) => {
    return (
      <div style={reviewBox}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={subheader}>{prop.user}</span>
          <Rating
            name="read-only"
            defaultValue={prop.number}
            precision={0.5}
            size="small"
            readOnly
          />
        </div>
        <span>{prop.text}</span>
      </div>
    )
  }
  console.log(listing);
  return (
    <>
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
                <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                  <Rating
                    name="read-only"
                    defaultValue={
                      listing.reviews.reduce((r, a) => {
                        return r + a.number
                      }, 0) / listing.reviews.length
                    }
                    precision={0.1}
                    size="medium"
                    readOnly
                  />
                  <span style={subheader}>{
                      listing.reviews.reduce((r, a) => {
                        return r + a.number
                      }, 0) / listing.reviews.length
                  }/5</span>
                </div>
              </div>
            </div>
          </div>
          <div style={secondContainer}>
            <div style={reviewWrapper}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={title}>Reviews</span>
                <button onClick={(e) => {
                  setReview(true);
                }}>Create a review</button>
              </div>
              <div style={reviewContainer}>
                {
                  listing.reviews.map((prop) => {
                    return createReviewBox(prop);
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        review &&
          <div style={reviewPopupWrapper}>
            <div style={reviewPopUpContainer}>
              <div style={reviewPopUp}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ ...title, marginLeft: '20px', marginTop: '10px' }}>Write a review</span>
                  <button style={{ alignSelf: 'flex-start', width: 'auto', height: 'auto', border: 'none', outline: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '20px' }} onClick={(e) => {
                    setReview(false);
                  }}>🆇</button>
                </div>
                <form style={{ width: '100%', height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', rowGap: '20px', boxSizing: 'border-box' }} onSubmit={(e) => {
                  handleReview(e);
                }}>
                  <Rating
                    name="half-rating"
                    defaultValue={0}
                    precision={0.5}
                    size="large"
                    onChange={(e) => {
                      rating = e.target.value;
                      console.log(rating);
                    }}
                  />
                  <textarea style={{ height: '100%' }}></textarea>
                  <button type='submit' style={{ cursor: 'pointer' }}>Submit</button>
                </form>
              </div>
            </div>
          </div>
      }
    </>
  )
}

export default Listing
