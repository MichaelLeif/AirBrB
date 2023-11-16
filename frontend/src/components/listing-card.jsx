import React from 'react'
import { Rating as Stars } from '@mui/material';
import { AspectRatio, CardContent, Typography, Sheet, Box, Card, Button } from '@mui/joy';
import { GoLiveDialog } from './go-live'
import { twodpPrice } from './my-listings';
import { useNavigate } from 'react-router-dom';

const RatingInfo = ({ reviews }) => {
  const numReviews = reviews.length;
  if (reviews.length === 0 || reviews == null) {
    return (
      <>
        <Typography fontWeight="lg"> No reviews </Typography>
      </>
    )
  }
  const avgRating = reviews.reduce((x, y) => x + y.rating, 0).toFixed(2)
  return (
    <div className='rating'>
      <Stars value={avgRating}/>
      <Typography fontWeight="lg">{numReviews} reviews</Typography>
    </div>
  )
}

export const ListingCard = ({ id, data, editHandler, reservationHandler, deleteHandler, unpublishHandler }) => {
  const navigate = useNavigate();
  const title = data.title;
  const type = data.metadata.type;
  const beds = data.metadata.beds;
  const bathrooms = data.metadata.baths;
  const thumbnail = data.thumbnail;
  const price = data.price
  const reviews = data.reviews;
  const published = data.published;

  return (
    <Card
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
    <CardContent>
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
          <RatingInfo reviews={reviews}/>
        </div>
      </Sheet>
      <Box sx={{ display: 'flex', gap: 1.5 }} >
            <Button sx={{ flex: 0.5 }} variant="outlined" color="primary" onClick={() => editHandler(id)}>
              Edit
            </Button>
            { published
              ? (<Button sx={{ flex: 0.5 }} variant="solid" color="primary" onClick={() => reservationHandler(id)}>
                  View reservations
                </Button>)
              : null }
            <Button sx={{ flex: 0.5 }} variant="solid" color="danger" onClick={() => deleteHandler(id, navigate)}>
              Delete
            </Button>
            { !published
              ? <GoLiveDialog data={data} listing={id}/>
              : <Button sx ={{ flex: 0.5 }} color='warning' onClick={() => unpublishHandler(id, navigate)} > Unpublish </Button> }
      </Box>
    </CardContent>
    </Card>
  )
}
