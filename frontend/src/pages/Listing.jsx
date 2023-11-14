import React from 'react'
import {
  useParams,
  useNavigate
} from 'react-router-dom'
import {
  path
} from './Pages.jsx';
import Rating from '@mui/material/Rating';
import Typography from '@mui/joy/Typography';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import Add from '@mui/icons-material/Add';
import Input from '@mui/joy/Input';
import Divider from '@mui/joy/Divider';

export const Listing = () => {
  const [isLoading, setLoading] = React.useState(true);
  const [listing, setListing] = React.useState({});
  const { listid, checkin, checkout } = useParams();
  const [checkInState, setCheckin] = React.useState(checkin || '');
  const [checkOutState, setCheckout] = React.useState(checkout || '');
  const [booked, setBooked] = React.useState();
  const [review, setReview] = React.useState(false);
  const navigate = useNavigate();
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

  const subheader = {
    fontSize: '20px',
    cursor: 'default'
  }

  const thumbnail = {
    width: '100%',
    height: '100%',
  }

  const infoDiv = {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '15px'
  }

  const infoContainer = {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '20px'
  }

  const checkDate = {
    height: '60%',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '10px',
    boxSizing: 'border-box',
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
        dateRange: {
          checkIn: checkInState,
          checkOut: checkOutState,
          nights
        },
        totalPrice: listing.price * nights
      }
      console.log(body);
      const response = await fetch(path + `/bookings/new/${listid}`, {
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
        console.log('hey');
        setBooked(data.bookingId);
        alert(booked);
      }
    } else {
      navigate('/login');
    }
  }

  const handleReview = async (e) => {
    e.preventDefault();
    alert('review functionality');
    setReview(false);
  }

  const createReviewBox = (prop) => {
    return (
      <div style={reviewBox}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography level='h4'>{prop.user}</Typography>
          <Rating
            name="read-only"
            defaultValue={prop.rating}
            precision={0.5}
            size="small"
            readOnly
          />
        </div>
        <Typography level='body-sm'>{prop.description}</Typography>
      </div>
    )
  }

  return (
    <>
      <div style={wrapper}>
        <div style={firstContainer}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <Typography level="h1">{listing.title}, {listing.metadata.type}</Typography>
            <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
              {listing.address.street}, {listing.address.city}, {listing.address.state}
            </Typography>
          </div>
          <div style={firstContainerFlex}>
            <img style={thumbnail} src={listing.thumbnail} />
          </div>
          <div style={{ width: '100%', height: 'auto' }}>
            <div style={{ border: '1px solid', borderRadius: '20px', boxShadow: 'rgb(0, 0, 0, 0.12) 0px 6px 16px', padding: '20px', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={infoDiv}>
                  <div style={infoContainer}>
                    <Typography level='h1'>Rooms</Typography>
                  </div>
                </div>
                <Divider orientation='vertical' />
                <div style={infoDiv}>
                  <div style={infoContainer}>
                    <Typography level='h1'>Amenities</Typography>
                  </div>
                </div>
                <Divider orientation='vertical' />
                <div style={infoDiv}>
                  {
                    nights > 0
                      ? <Typography level='h2'>${listing.price * nights} <Typography level='h3'>per stay</Typography></Typography>
                      : <Typography level='h2'>${listing.price} <Typography level='h3'>per night</Typography></Typography>
                  }
                  <div style={infoContainer}>
                    <form style={checkDate} onSubmit={(e) => {
                      handleBooking(e);
                    }}
                    >
                      <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                          <FormLabel>CHECK-IN</FormLabel>
                          <Input style={{ width: '100%' }}type='date' placeholder="Placeholder" defaultValue={checkin} onChange={(e) => {
                            setCheckin(e.target.value)
                          }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                          <FormLabel>CHECK-OUT</FormLabel>
                          <Input style={{ width: '100%' }} type='date' defaultValue={checkout} onChange={(e) => {
                            setCheckout(e.target.value);
                          }} />
                        </div>
                      </div>
                      <Button type='submit' style={{ width: '100%' }} color='danger'>
                          RESERVE
                      </Button>
                    </form>
                  </div>
                  <Typography level='h1'>Ratings</Typography>
                  <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                    <Rating
                      name="read-only"
                      defaultValue={
                        listing.reviews.reduce((r, a) => {
                          return r + a.rating
                        }, 0) / listing.reviews.length
                      }
                      precision={0.1}
                      size="medium"
                      readOnly
                    />
                    <span style={subheader}>{
                        listing.reviews.reduce((r, a) => {
                          return r + a.rating
                        }, 0) / listing.reviews.length
                    }/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={secondContainer}>
            <div style={reviewWrapper}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography level='h1'>Reviews</Typography>
                <Button startDecorator={<Add />} color='danger' onClick={(e) => {
                  setReview(true);
                }}>Write a review</Button>
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
          <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={open}
          onClose={() => setReview(false)}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          size='lg'
        >
          <Sheet
            variant="outlined"
            sx={{
              maxWidth: 500,
              borderRadius: 'md',
              p: 3,
              boxShadow: 'lg',
            }}
          >
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <Typography
              component="h1"
              id="modal-title"
              level="h2"
              textColor="inherit"
              fontWeight="lg"
              mb={1}
            >
              Write a review
            </Typography>
            <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '500px', height: '200px', rowGap: '20px' }} onSubmit={(e) => {
              e.preventDefault();
              handleReview(e);
              setReview(false);
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
              <Textarea
                placeholder="Say something nice!"
                style={{ width: '100%', height: '100%' }}
                size='md'
                minRows={2}
                sx={{
                  '&::before': {
                    display: 'none',
                  },
                  '&:focus-within': {
                    outline: '2px solid var(--Textarea-focusedHighlight)',
                    outlineOffset: '2px',
                  },
                }}
              />
              <Button type='submit' color='danger' size='lg'>Submit</Button>
            </form>
          </Sheet>
        </Modal>
      }
    </>
  )
}
