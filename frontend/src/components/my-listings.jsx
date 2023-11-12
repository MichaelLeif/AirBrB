import React, { useEffect } from 'react';
import { apiCall, getUser } from '../helpers/apicalls';
import { Card, CardContent, Button } from '@mui/material';
import { Button as JoyButton, Card as JoyCard, AspectRatio, CardContent as JoyCardContent, Sheet, Typography, Box } from '@mui/joy'
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { star } from '../helpers/svg'
// import { fileToDataUrl } from '../helpers/image'

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

const LoadingButton = styled(JoyButton)({
  height: '73px',
})

const twodpPrice = (price) => {
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

const ListingCard = ({ id, title, type, beds, bathrooms, thumbnail, reviews, price, navigate }) => {
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
            <JoyButton sx={{ flex: 1 }} variant="outlined" color="primary" onClick={(e) => navigate('/listings/' + id)}>
              Edit
            </JoyButton>
            <JoyButton sx={{ flex: 0.25 }} variant="solid" color="success">
              Go live
            </JoyButton>
            <JoyButton sx={{ flex: 0.25 }} variant="solid" color="danger">
              Delete
            </JoyButton>
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
          console.log('my listing', myListings);
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
          console.log(listingDets);
          return (
            // Change listing.type and reviews
            <ListingCard key={i} id={listing.id} title={listingDets.title} type={'Apartment'} beds={listingDets.metadata.beds} bathrooms={listingDets.metadata.baths} address={listingDets.address} thumbnail={listingDets.thumbnail} price={listingDets.price} reviews={listingDets.reviews} navigate={navigate} />
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

  return (
    <div id='my-listings'>
      <FindMyListings />
    </div>
  );
}
