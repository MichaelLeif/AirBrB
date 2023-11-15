import React, { useEffect } from 'react';
import { apiCall, getUser } from '../helpers/apicalls';
import { Card, CardContent, Button } from '@mui/material';
import { Button as JoyButton, Card as JoyCard, AspectRatio, CardContent as JoyCardContent, Sheet, Typography, Box } from '@mui/joy'
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { star } from '../helpers/svg'
import { GoLiveDialog } from './go-live'
import { Loading, LoadingButton } from '../helpers/generics';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import { LineChart } from '@mui/x-charts';
import { checkAccepted } from './listing-booking';

const CreateNewListingCard = styled(Card)({
  backgroundColor: '#f4f4f4',
  border: 'none',
  borderRadius: '8px',
  padding: '0px 20px'
})

const CreateListingButton = styled(Button)({
  textTransform: 'none',
  padding: '5px 20px',
  borderRadius: '8px',
  backgroundColor: '#fdfdfd',
  borderColor: '#000000',
  color: '#000000',
  fontSize: '1rem',
  marginTop: '10px',
  marginBottom: '30px',
  '&:hover': {
    backgroundColor: '#f4f4f4',
    borderColor: '#000000',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#f4f4f4',
    borderColor: '#000000',
  },
});

export const twodpPrice = (price) => {
  if (!price.includes('.')) {
    return price + '.00'
  }
  return price
}

const Rating = ({ reviews }) => {
  if (reviews.length === 0 || reviews == null) {
    return (
      <>
        <Typography fontWeight="lg"> No reviews </Typography>
      </>
    )
  }
  return (
    <div className='rating'>
      <Typography fontWeight="lg">{5}</Typography>
      {star}
      <Typography fontWeight="lg">({reviews} reviews)</Typography>
    </div>
  )
}

const deleteHandler = (id, navigate) => {
  apiCall('DELETE', '/listings/' + id, {}, true);
  navigate('/listings/my');
}

const unpublishHandler = (id, navigate) => {
  apiCall('PUT', '/listings/unpublish/' + id, {}, true);
  navigate('/listings/my');
}

const ListingCard = ({ id, data, navigate }) => {
  const title = data.title;
  const type = data.metadata.type;
  const beds = data.metadata.beds;
  const bathrooms = data.metadata.baths;
  const thumbnail = data.thumbnail;
  const price = data.price
  const reviews = data.reviews;
  const published = data.published;

  return (
    <JoyCard
    orientation="horizontal"
    sx={{
      flexWrap: 'wrap',
      overflow: 'auto',
      margin: '10px 0px'
    }}
    >
    <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
      <img
        src={thumbnail}
        loading="lazy"
        alt="Photo of listing"
      />
    </AspectRatio>
    <JoyCardContent>
      <Typography fontSize="xl" fontWeight="lg">
        {title}
      </Typography>
      <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
        {type}
      </Typography>
      <Sheet
        sx={{
          bgcolor: 'background.level1',
          borderRadius: 'sm',
          p: 1.5,
          my: 1.5,
          display: 'flex',
          gap: 2,
          '& > div': { flex: 1 },
        }}
      >
        <div>
          <Typography level="body-xs" fontWeight="lg">
            Beds
          </Typography>
          <Typography fontWeight="lg">{beds}</Typography>
        </div>
        <div>
          <Typography level="body-xs" fontWeight="lg">
            Bathrooms
          </Typography>
          <Typography fontWeight="lg">{bathrooms}</Typography>
        </div>
        <div>
          <Typography level="body-xs" fontWeight="lg">
            Price
          </Typography>
          <Typography fontWeight="lg">${twodpPrice(price)}</Typography>
        </div>
        <div>
          <Typography level="body-xs" fontWeight="lg">
            Reviews
          </Typography>
          <Rating reviews={reviews}/>
        </div>
      </Sheet>
      <Box sx={{ display: 'flex', gap: 1.5 }} >
            <JoyButton sx={{ flex: 0.5 }} variant="outlined" color="primary" onClick={(e) => navigate('/listings/' + id)}>
              Edit
            </JoyButton>
            { published
              ? (<JoyButton sx={{ flex: 0.5 }} variant="solid" color="primary" onClick={(e) => navigate('/listings/reservations/' + id)}>
                  View reservations
                </JoyButton>)
              : null }
            <JoyButton sx={{ flex: 0.5 }} variant="solid" color="danger" onClick={(e) => deleteHandler(id, navigate)}>
              Delete
            </JoyButton>
            { !published
              ? <GoLiveDialog data={data} listing={id} navigate={navigate}/>
              : <JoyButton sx ={{ flex: 0.5 }} color='warning' onClick={(e) => unpublishHandler(id, navigate)} > Unpublish </JoyButton> }
      </Box>
    </JoyCardContent>
    </JoyCard>
  )
}

export const MyListings = () => {
  const navigate = useNavigate();

  const FirstListing = () => {
    return (
      <CreateNewListingCard id='newListingCard' variant="outlined">
        <CardContent>
          <svg id='houseIcon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19.0001H18V9.15757L12 3.70302L6 9.15757V19.0001ZM19 21.0001H5C4.44772 21.0001 4 20.5524 4 20.0001V11.0001L1 11.0001L11.3273 1.61162C11.7087 1.26488 12.2913 1.26488 12.6727 1.61162L23 11.0001L20 11.0001V20.0001C20 20.5524 19.5523 21.0001 19 21.0001ZM7.5 13.0001H9.5C9.5 14.3808 10.6193 15.5001 12 15.5001C13.3807 15.5001 14.5 14.3808 14.5 13.0001H16.5C16.5 15.4854 14.4853 17.5001 12 17.5001C9.51472 17.5001 7.5 15.4854 7.5 13.0001Z"></path></svg>
          <h2> Create a new listing </h2>
          <p> You don&apos;t have any listings on Airbnb right now. Create a new listing to start getting bookings.</p>
          <CreateListingButton variant="outlined" onClick={(e) => (navigate('/listings/new'))}>Create listing</CreateListingButton>
        </CardContent>
      </CreateNewListingCard>
    )
  }

  const FindMyListings = () => {
    const [listing, setListing] = React.useState('0');
    const [details, setDetails] = React.useState([]);
    const [processed, setProcessed] = React.useState(false);
    useEffect(() => {
      apiCall('GET', '/listings', {}, true)
        .then((data) => {
          const user = getUser();
          const myListings = data.listings.filter(x => x.owner === user);
          setListing(myListings.length);
          if (myListings.length === 0) {
            setProcessed(true);
          }
          myListings.forEach((listing) => {
            apiCall('GET', '/listings/' + listing.id, {}, true)
              .then((dets) => {
                const detail = dets.listing;
                setProcessed(true);
                setDetails(old => [...old, {
                  id: listing.id,
                  detail,
                }])
              })
          })
        })
      return () => {}
    }, []);

    if (!processed) {
      return (
        <LoadingButton loading variant="plain">Loading</LoadingButton>
      )
    }
    const listingElem = (listing === 1) ? listing + ' listing' : listing + ' listings';
    const ListingTitle = () => {
      return (
        <div id='listing-title'>
          <h2> {listingElem} </h2>
          {listing !== 0 ? <JoyButton startDecorator={<Add/>} variant="outlined" onClick={(e) => (navigate('/listings/new'))}> Create listing</JoyButton> : null}
        </div>
      )
    }

    if (listing === 0) {
      return (
        <div>
          <ListingTitle/>
          <FirstListing/>
        </div>
      )
    }

    const ListingDetails = ({ navigate }) => {
      return (
        details.map((listing, i) => {
          const listingDets = listing.detail;
          return (
            <ListingCard key={i} id={listing.id} data={listingDets} navigate={navigate}
            />
          )
        })
      )
    }
    return (
      <div>
        <ListingTitle />
        <ListingDetails navigate={navigate}/>
      </div>
    )
  }

  const checkBeforeToday = (booking) => {
    const now = new Date();
    const then = new Date(booking.dateRange.start);
    return now.getTime() - then.getTime() > 0;
  }

  const daysBetween = (start, finish) => {
    const startSec = new Date(start);
    const finishSec = new Date(finish);
    return Math.round((finishSec.getTime() - startSec.getTime()) / (1000 * 60 * 60 * 24));
  }

  const daysSinceToday = (start) => {
    const startSec = new Date(start);
    const finishSec = new Date();
    return Math.round((finishSec.getTime() - startSec.getTime()) / (1000 * 60 * 60 * 24));
  }

  const findIncome = async () => {
    const listing = await apiCall('GET', '/listings', {}, true)
    const myListings = listing.listings.filter(listing => listing.owner === getUser()).map(x => x.id);
    console.log('mylisting', myListings);
    const booking = await apiCall('GET', '/bookings', {}, true);
    const bookingsAtListings = booking.bookings.filter(booking => checkAccepted(booking) && checkBeforeToday(booking) && myListings.some(x => x === parseInt(booking.listingId)));
    console.log('bookingsatlisting', bookingsAtListings);
    const incomeArray = new Array(31).fill(0);
    console.log(incomeArray);
    bookingsAtListings.forEach((booking) => {
      const start = booking.dateRange.start;
      const end = booking.dateRange.end;
      const numDays = daysBetween(start, end) + 1;
      const pricePerDay = booking.totalPrice / numDays * 1.0;
      const daysFromStart = daysSinceToday(start);
      const daysFromEnd = daysSinceToday(end);
      console.log(pricePerDay);
      for (let i = daysFromEnd; i <= daysFromStart; i++) {
        console.log(i);
        if (i < 0) {
          continue;
        }

        if (i > 30) {
          break;
        }

        incomeArray[i] += pricePerDay;
      }
    })
    return incomeArray;
  }

  const xAxisArray = Array.from(Array(31).keys());
  const ProfitGraph = () => {
    const [data, setData] = React.useState(null);
    if (!data) {
      findIncome()
        .then((data) => {
          setData(data);
        })
    }

    return !data
      ? <Loading />
      : (<LineChart
        xAxis={[{ data: xAxisArray, tickMinStep: 1, tickMaxStep: 1, label: 'Number of days ago' }]}
        series={[
          {
            curve: 'linear',
            data,
          },
        ]}
        height={450}
        yAxis={[{ label: 'Income ($)' }]}
      />)
  }

  return (
    <Tabs aria-label="Basic tabs" defaultValue={0} id='my-listings'>
        <TabList>
          <Tab>My Listings</Tab>
          <Tab>Performance</Tab>
        </TabList>
        <TabPanel value={0}>
        <div>
          <FindMyListings />
        </div>
        </TabPanel>
        <TabPanel value={1}>
          <h3> Profit in the Last Month </h3>
          <ProfitGraph />
        </TabPanel>
    </Tabs>
  );
}
