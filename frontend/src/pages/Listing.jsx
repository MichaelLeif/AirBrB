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
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Alert from '@mui/joy/Alert';
import IconButton from '@mui/joy/IconButton';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box } from '@mui/material';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import {
  wifiSVG, safeSVG, tvSVG, alarmSVG,
  airconSVG, kitchenSVG, fireplaceSVG, parkingSVG, washingSVG
} from '../helpers/svg';
import AspectRatio from '@mui/joy/AspectRatio';
import useMediaQuery from '@mui/material/useMediaQuery';

export const Listing = () => {
  const mobileResponsive = useMediaQuery('only screen and (min-width: 400px) and (max-width: 1000px');
  const [isLoading, setLoading] = React.useState(true);
  const [listing, setListing] = React.useState({});
  const { listid, accepted, checkin, checkout } = useParams();
  const [checkInState, setCheckin] = React.useState(checkin || '');
  const [checkOutState, setCheckout] = React.useState(checkout || '');
  const [review, setReview] = React.useState(false);
  const [booked, setBooked] = React.useState(false);
  const [reviewError, setReviewError] = React.useState(false);
  const [bookingError, setBookingError] = React.useState(false);
  const navigate = useNavigate();
  let nights = 0;
  let rating = 0;

  const wrapper = {
    display: 'flex',
    padding: '30px 10%',
    justifyContent: 'center',
    alignItems: 'center',
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

  const thumbnail = {
    width: '100%',
    height: '100%',
  }

  const infoDiv = {
    width: mobileResponsive ? '100%' : '30%',
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
    flexDirection: mobileResponsive ? 'column' : 'row',
    justifyContent: 'space-between',
    rowGap: '30px',
    marginTop: '20px',
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
      <Box>
        LOADING...
      </Box>
    )
  }

  const handleBooking = async (e) => {
    console.log('make booking');
    e.preventDefault();
    if (localStorage.getItem('token')) {
      let isAvailable = false;
      for (const available of listing.availability) {
        if (new Date(checkInState) >= new Date(available.start) && new Date(checkOutState) <= new Date(available.end)) {
          isAvailable = true;
          break;
        }
      }
      if (!isAvailable) {
        setBookingError(true);
        setTimeout(() => {
          setBookingError(false);
        }, 5000);
        return;
      }
      const body = {
        dateRange: {
          start: checkInState,
          end: checkOutState,
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
        setBooked(true);
        setTimeout(() => {
          setBooked(false);
        }, 4000);
      }
    } else {
      navigate('/login');
    }
  }

  const handleReview = async (e) => {
    e.preventDefault();
    if (accepted === 'true') {
      let id;
      let response = await fetch(path + '/bookings', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      })
      const bookings = await response.json();
      for (const booking of bookings.bookings) {
        if (localStorage.getItem('user') === booking.owner && parseInt(booking.listingId) === parseInt(listid)) {
          id = booking.id;
          break;
        }
      }
      response = await fetch(path + `/listings/${listid}/review/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: localStorage.getItem('token')
        },
        body: JSON.stringify({ review: { name: localStorage.getItem('user'), rating: parseInt(rating), description: e.target[11].value } })
      })
      let data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        response = await fetch(path + `/listings/${listid}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        });
        data = await response.json();
        setListing(data.listing);
        setReview(false);
      }
    } else {
      if (!localStorage.getItem('token')) {
        navigate('/login');
      } else {
        setReviewError(true);
        setReview(false);
        setTimeout(() => {
          setReviewError(false);
        }, 4000);
      }
    }
  }

  const Svg = (feature) => {
    console.log(feature);
    if (feature === 'Wifi') {
      return wifiSVG;
    } else if (feature === 'Air Conditioner') {
      return airconSVG;
    } else if (feature === 'Fireplace') {
      return fireplaceSVG;
    } else if (feature === 'Parking') {
      return parkingSVG;
    } else if (feature === 'TV') {
      return tvSVG;
    } else if (feature === 'Kitchen Essentials') {
      return kitchenSVG;
    } else if (feature === 'Washing Machine') {
      return washingSVG;
    } else if (feature === 'Smoke Alarm') {
      return alarmSVG;
    } else if (feature === 'Safe') {
      return safeSVG;
    }
  }

  const Amenities = ({ props }) => {
    if (!listing.metadata.amenities) {
      return (
        <Typography>
          There are no amenities for this listing
        </Typography>
      )
    }
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', rowGap: '20px' }}>
        {
          listing.metadata.amenities.map((feature) => {
            return (
              <Card key={feature} variant="soft" color="neutral" sx={{ width: '37%', height: 'auto' }}>
                <CardContent sx={{ width: '50%' }}>
                  <AspectRatio minHeight="50px" maxHeight="100px" sx={{ width: '50%' }}>
                    {
                      Svg(feature)
                    }
                  </AspectRatio>
                  <Typography>{feature}</Typography>
                </CardContent>
              </Card>
            )
          })
        }
      </Box>
    )
  }

  const SleepingArrangement = (room) => {
    const order = [];
    if (room.single) {
      order.push(`${room.single} single bed` + (room.single > 1 ? 's' : ''));
    }
    if (room.double) {
      order.push(`${room.double} double bed` + (room.double > 1 ? 's' : ''));
    }
    if (room.queen) {
      order.push(`${room.queen} queen bed` + (room.queen > 1 ? 's' : ''));
    }
    if (room.king) {
      order.push(`${room.king} king bed` + (room.king > 1 ? 's' : ''));
    }
    if (room.sofaBed) {
      order.push(`${room.sofaBed} sofa bed` + (room.sofaBed > 1 ? 's' : ''));
    }
    return order.join(', ');
  }

  const Rooms = ({ props }) => {
    if (!listing.metadata.amenities) {
      return (
        <Typography>
          There are no amenities for this listing
        </Typography>
      )
    }
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', rowGap: '20px' }}>
        {
          listing.metadata.sleepingArrangement.map((bedroom) => {
            return (
              <Card key={bedroom.i} variant="soft" color="neutral" sx={{ width: '37%', height: 'auto' }}>
                <CardContent sx={{ width: '100%' }}>
                  <Typography level="title-md">Bedroom {bedroom.i}</Typography>
                  <Typography level='body-sm'>{SleepingArrangement(bedroom)}</Typography>
                </CardContent>
              </Card>
            )
          })
        }
      </Box>
    )
  }

  const ReviewErrorPopUp = ({ reviewError }) => {
    if (reviewError) {
      return (
        <Box sx={{ position: 'fixed', top: '0', width: '100%' }}>
          <Alert
          startDecorator={<WarningIcon />}
          variant="soft"
          color='danger'
          endDecorator={
            <IconButton variant="soft" color='danger'>
              <CloseRoundedIcon onClick={(e) => setReviewError(false)} />
            </IconButton>
          }
          >
            <Box>
              <Box>Review Error</Box>
              <Typography level="body-sm" color='success'>
                Your booking must be accepted to review this listing!
              </Typography>
            </Box>
          </Alert>
        </Box>
      )
    } else {
      return (
        <></>
      )
    }
  }

  const BookingErrorPopUp = ({ bookingError }) => {
    if (bookingError) {
      return (
        <Box sx={{ position: 'fixed', top: '0', width: '100%' }}>
          <Alert
          startDecorator={<WarningIcon />}
          variant="soft"
          color='danger'
          endDecorator={
            <IconButton variant="soft" color='danger'>
              <CloseRoundedIcon onClick={(e) => setBookingError(false)} />
            </IconButton>
          }
          >
            <Box>
              <Box>Booking Error</Box>
              <Typography level="body-sm" color='success'>
                Your booking is out of the availability range. Please book within the range or use the search filter to see available listings.
              </Typography>
            </Box>
          </Alert>
        </Box>
      )
    } else {
      return (
        <></>
      )
    }
  }

  const BookingPopUp = ({ booked }) => {
    if (booked) {
      return (
        <Box sx={{ position: 'fixed', top: '0', width: '100%' }}>
          <Alert
          startDecorator={<CheckCircleIcon />}
          variant="soft"
          color='success'
          endDecorator={
            <IconButton variant="soft" color='success'>
              <CloseRoundedIcon onClick={(e) => setBooked(false)} />
            </IconButton>
          }
          >
            <Box>
              <Box>Booking Confirmation</Box>
              <Typography level="body-sm" color='success'>
                Your booking was successful!
              </Typography>
            </Box>
          </Alert>
        </Box>
      )
    } else {
      return (
        <></>
      )
    }
  }

  return (
    <>
      <Box sx={wrapper}>
        <Box sx={firstContainer}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <Typography level="h1">{listing.title}{listing.metadata.type && `, ${listing.metadata.type}`}</Typography>
            <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
              {listing.address.address}, {listing.address.city}, {listing.address.state}
            </Typography>
          </Box>
          <Box sx={firstContainerFlex}>
            <img style={thumbnail} src={listing.thumbnail} />
          </Box>
          <Box sx={{ width: '100%', height: 'auto' }}>
            <Box sx={{ border: '1px solid', borderRadius: '20px', boxShadow: 'rgb(0, 0, 0, 0.12) 0px 6px 16px', padding: '20px', overflow: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', ...mobileResponsive ? { flexDirection: 'column' } : { flexDirection: 'row' } }}>
                <Box sx={infoDiv}>
                  <Box sx={infoContainer}>
                    <Typography level='h1'>Rooms</Typography>
                    <Rooms props={listing}/>
                  </Box>
                </Box>
                <Divider orientation={mobileResponsive ? 'horizontal' : 'vertical'} />
                <Box sx={infoDiv}>
                  <Box sx={infoContainer}>
                    <Typography level='h1'>Amenities</Typography>
                    <Amenities props={listing}/>
                  </Box>
                </Box>
                <Divider orientation={mobileResponsive ? 'horizontal' : 'vertical'} />
                <Box sx={infoDiv}>
                  {
                    nights > 0
                      ? <Typography level='h2'>${listing.price * nights} <Typography level='h3'>per stay</Typography></Typography>
                      : <Typography level='h2'>${listing.price} <Typography level='h3'>per night</Typography></Typography>
                  }
                  <Box sx={infoContainer}>
                    <form style={checkDate} onSubmit={(e) => {
                      handleBooking(e);
                    }}
                    >
                      <Box sx={{ display: 'flex', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                          <FormLabel>CHECK-IN</FormLabel>
                          <Input name="check-in" style={{ width: '100%' }}type='date' placeholder="Placeholder" defaultValue={checkin} onChange={(e) => {
                            setCheckin(e.target.value)
                          }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                          <FormLabel>CHECK-OUT</FormLabel>
                          <Input name="check-out" style={{ width: '100%' }} type='date' defaultValue={checkout} onChange={(e) => {
                            setCheckout(e.target.value);
                          }} />
                        </Box>
                      </Box>
                      {
                        localStorage.getItem('user') === listing.owner
                          ? <Button type='submit' style={{ width: '100%' }} color='danger' disabled='true'>
                              RESERVE
                          </Button>
                          : <Button type='submit' style={{ width: '100%' }} color='danger' >
                            RESERVE
                          </Button>
                      }
                    </form>
                  </Box>
                  <Typography level='h1'>Ratings</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                    <Rating
                      name="read-only"
                      value={
                        (listing.reviews.reduce((r, a) => {
                          return r + a.rating
                        }, 0) / listing.reviews.length).toFixed(2)
                      }
                      precision={0.1}
                      size="medium"
                      readOnly
                    />
                    <Typography>{
                      (!listing.reviews.length
                        ? 0
                        : listing.reviews.reduce((r, a) => {
                          return r + a.rating
                        }, 0) / listing.reviews.length).toFixed(2)
                      }/5</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={secondContainer}>
            <Box sx={reviewWrapper}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography level='h1'>Reviews</Typography>
                <CreateReviewButton
                  onClick={(e) => setReview(true)}
                  mobileResponsive={mobileResponsive}
                />
              </Box>
              <Box sx={reviewContainer}>
                <ReviewBox
                  Populate={() => {
                    return listing.reviews.length !== 0
                      ? listing.reviews.map((prop, index) => {
                        return (
                          <CreateReviewBox key={index} prop={prop} mobileResponsive={mobileResponsive} />
                        )
                      })
                      : <Typography> There are currently no reviews</Typography>
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <BookingErrorPopUp bookingError={bookingError} />
      <ReviewErrorPopUp reviewError={reviewError} />
      <BookingPopUp booked={booked} />
      <ReviewPopUp review={review}
      onClose={() => setReview(false)}
      onSubmit={(e) => {
        e.preventDefault();
        handleReview(e);
        setReview(false);
      }}
      onChange={(e) => {
        rating = e.target.value;
      }}
      />
    </>
  )
}

export const CreateReviewBox = ({ prop, mobileResponsive }) => {
  const sx = {
    width: '40%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column'
  }
  return (
    <Box sx={sx}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography level='h4'>{prop.name}</Typography>
        <Rating
          name="read-only"
          defaultValue={prop.rating}
          precision={0.5}
          size="small"
          readOnly
          sx={{ marginTop: '7px', ...mobileResponsive && { marginLeft: '30px' } }}
        />
      </Box>
      <Typography level='body-sm'>{prop.description}</Typography>
    </Box>
  )
}

export const ReviewBox = ({ Populate }) => {
  return (
    <Populate />
  )
}

export const ReviewPopUp = ({ review, onClose, onSubmit, onChange }) => {
  return (
    <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={review}
        onClose={onClose}
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
        <ModalClose role='close' variant="plain" sx={{ m: 1 }} />
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
        <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '500px', height: '200px', rowGap: '20px' }} onSubmit={onSubmit}>
          <Rating
            name="half-rating"
            defaultValue={0}
            precision={0.5}
            size="large"
            onChange={onChange}
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
  )
}

export const CreateReviewButton = ({ onClick, mobileResponsive }) => {
  return (
    <Button
      startDecorator={<Add />}
      color='danger'
      sx={{ ...mobileResponsive && { width: '100px' } }}
      onClick={onClick}
    >Write a review
    </Button>
  )
}
