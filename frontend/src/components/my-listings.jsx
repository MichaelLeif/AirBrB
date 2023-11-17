import React, { useEffect } from 'react';
import { apiCall } from '../helpers/apicalls';
import { getUser } from '../helpers/auth';
import { Card, CardContent, Button } from '@mui/material';
import { Button as JoyButton } from '@mui/joy'
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { ListingCard } from './listing-card';
import { CenteredDiv, Loading, LoadingButton } from '../helpers/generics';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import { LineChart } from '@mui/x-charts';
import { checkAccepted } from './listing-booking';
import useMediaQuery from '@mui/material/useMediaQuery';

const CreateNewListingCard = styled(Card)({
  backgroundColor: '#f4f4f4',
  border: 'none',
  borderRadius: '8px',
  padding: '0px 20px',
  '& h2, & p': {
    margin: '10px 0px',
  },
  '& svg': {
    marginTop: '30px',
  },
  '& button': {
    marginBottom: '10px',
  }
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

const deleteListing = (id, navigate) => {
  apiCall('DELETE', '/listings/' + id, {}, true);
  navigate('/listings/my');
}

const unpublishListing = (id, navigate) => {
  apiCall('PUT', '/listings/unpublish/' + id, {}, true);
  navigate('/listings/my');
}

export const MyListings = () => {
  const navigate = useNavigate();
  const tablet = useMediaQuery('only screen and (min-width: 600px) and (max-width: 900px');
  const mobile = useMediaQuery('only screen and (max-width: 600px');

  const FirstListing = () => {
    return (
      <CreateNewListingCard variant="outlined">
        <CardContent>
          <svg height='40px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19.0001H18V9.15757L12 3.70302L6 9.15757V19.0001ZM19 21.0001H5C4.44772 21.0001 4 20.5524 4 20.0001V11.0001L1 11.0001L11.3273 1.61162C11.7087 1.26488 12.2913 1.26488 12.6727 1.61162L23 11.0001L20 11.0001V20.0001C20 20.5524 19.5523 21.0001 19 21.0001ZM7.5 13.0001H9.5C9.5 14.3808 10.6193 15.5001 12 15.5001C13.3807 15.5001 14.5 14.3808 14.5 13.0001H16.5C16.5 15.4854 14.4853 17.5001 12 17.5001C9.51472 17.5001 7.5 15.4854 7.5 13.0001Z"></path></svg>
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
        <CenteredDiv>
          <h2> {listingElem} </h2>
          {listing !== 0 ? <JoyButton startDecorator={<Add/>} variant="outlined" onClick={(e) => (navigate('/listings/new'))}> Create listing</JoyButton> : null}
        </CenteredDiv>
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

    const ListingDetails = () => {
      return (
        details.map((listing, i) => {
          const listingDets = listing.detail;
          return (
            <ListingCard key={i} id={listing.id} data={listingDets} editHandler={(id) => navigate('/listings/' + id)}
            reservationHandler={(id) => navigate('/listings/reservations/' + id)} deleteHandler = {(id, navigate) => deleteListing(id, navigate)}
            unpublishHandler = {(id, navigate) => unpublishListing(id, navigate)} mobile={mobile} tablet={tablet}
            />
          )
        })
      )
    }
    return (
      <div>
        <ListingTitle />
        <ListingDetails/>
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
    const booking = await apiCall('GET', '/bookings', {}, true);
    const bookingsAtListings = booking.bookings.filter(booking => checkAccepted(booking) && checkBeforeToday(booking) && myListings.some(x => x === parseInt(booking.listingId)));
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

  const paddingSides = mobile ? '10px' : '80px'
  return (
    <Tabs sx={{ paddingTop: '30px', paddingBottom: '30px', paddingRight: paddingSides, paddingLeft: paddingSides, backgroundColor: 'white' }} aria-label="Listing and performance tabs" defaultValue={0} id="my-listings">
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
