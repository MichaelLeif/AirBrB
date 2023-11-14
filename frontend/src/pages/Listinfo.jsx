import React from 'react';
import {
  Link,
} from 'react-router-dom';
import '@fontsource/inter';
import Rating from '@mui/material/Rating';
import Typography from '@mui/joy/Typography';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Chip from '@mui/joy/Chip';

function Listinfo (props, dateValue, bookingStatus) {
  const item = {
    cursor: 'pointer',
  }
  let nights = 1;

  if (dateValue !== undefined) {
    let timeDuration = new Date(dateValue[1]) - new Date(dateValue[0]);
    timeDuration = timeDuration / (1000 * 3600 * 24);
    nights = timeDuration;
  }

  const BookingStatus = () => {
    if (bookingStatus) {
      console.log(bookingStatus);
      if (bookingStatus === 'accepted') {
        return (
         <Chip color='success' style={{ marginLeft: '30px' }}>Accepted</Chip>
        )
      } else {
        return (
          <Chip color='warning' style={{ marginLeft: '30px' }}>Pending</Chip>
        )
      }
    } else {
      return (
        <>
        </>
      )
    }
  }

  const MakeListing = () => {
    return (
      <>
        <Card variant="outlined" sx={{ width: 300 }}>
          <CardOverflow>
            <AspectRatio ratio="2">
              <img
                src={props.thumbnail}
                loading="lazy"
              />
            </AspectRatio>
          </CardOverflow>
          <CardContent>
            <Typography level="title-md">
              {props.title}
            </Typography>
            <Typography level="body-sm">
              {props.address.street}, {props.address.city}, {props.address.state}
            </Typography>
          </CardContent>
          <CardOverflow variant="soft">
            <Divider inset="context" />
            <CardContent orientation="horizontal">
              <Typography level="body-xs" style={{ marginTop: '5px' }}>${props.price * nights}</Typography>
              <Divider orientation="vertical" />
              <Rating
                name="read-only"
                defaultValue={
                  props.reviews.reduce((r, a) => {
                    return r + a.rating
                  }, 0) / props.reviews.length
                }
                style={{ marginTop: '5px', zIndex: '-1 !important' }}
                precision={0.1}
                size="small"
                readOnly
              />
              <Typography level="body-xs" style={{ marginTop: '6px' }}>{
                props.reviews.reduce((r, a) => {
                  return r + a.rating
                }, 0) / props.reviews.length
              }/5</Typography>
              <BookingStatus />
            </CardContent>
          </CardOverflow>
        </Card>
      </>
    )
  }

  if (dateValue !== undefined) {
    console.log(dateValue);
    return (
      <div key={props.id} style={item}>
        <Link to={`/listing/${props.id}/${dateValue[0]}/${dateValue[1]}`} key={props.id} style={{ textDecoration: 'none', color: 'black' }}>
          <MakeListing />
        </Link>
      </div>
    )
  }

  return (
    <div key={props.id} style={item}>
      {console.log('rerender')}
      <Link to={`/listing/${props.id}`} key={props.id} style={{ textDecoration: 'none', color: 'black' }}>
        <MakeListing />
      </Link>
    </div>
  )
}

export default Listinfo
