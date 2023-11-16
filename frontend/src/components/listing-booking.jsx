import React from 'react'
import { Grid, Sheet, Typography, Table, Chip } from '@mui/joy';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import { apiCall } from '../helpers/apicalls';
import { useNavigate, useParams } from 'react-router-dom';
import { setBookingListingData } from './listing-booking-fetch';
import { twodpPrice } from './my-listings';
import { Loading } from '../helpers/generics';
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');

function createData (user, startDate, endDate, price, status, bookingId) {
  return { user, startDate, endDate, price, status, bookingId };
}

const dollarFormat = (price) => {
  return '$' + twodpPrice(price.toString())
}

const rows = (data) => {
  return data.map(x => createData(x.owner, x.dateRange.start, x.dateRange.end, dollarFormat(x.totalPrice), x.status, x.id));
};

export const checkAccepted = (x) => {
  return x.status.localeCompare('accepted') === 0;
}

const checkDeclined = (x) => {
  return x.status.localeCompare('declined') === 0;
}

const checkPending = (x) => {
  return x.status.localeCompare('pending') === 0;
}

const thisYear = new Date().getFullYear();
const checkYear = (x) => {
  const bookingStart = new Date(x.dateRange.start);
  return bookingStart.getFullYear() === thisYear;
}

export const ListingReservations = () => {
  const params = useParams();
  const listingId = parseInt(params.id);
  const [data, setData] = React.useState(null);

  let title = null;
  let reservationData = null;
  let publishTime = null;
  let pendingData = null;
  let acceptedData = null;
  let declinedData = null;
  let yearlyAccepted = null;
  let yearlyEarnings = null;
  let daysBooked = null;
  let activeSince = null;
  const timeSince = (time) => {
    dayjs.extend(relativeTime);
    return dayjs(time).fromNow();
  }
  // Calculate the yearly earnings - filter by year and accepted
  if (!data) {
    setBookingListingData(listingId, setData);
  } else {
    title = data.title;
    reservationData = data.data;
    publishTime = reservationData.postedOn;
    pendingData = reservationData.filter(checkPending);
    acceptedData = reservationData.filter(checkAccepted);
    declinedData = reservationData.filter(checkDeclined);
    yearlyAccepted = reservationData.filter(x => checkAccepted(x) && checkYear(x));
    yearlyEarnings = yearlyAccepted.reduce((total, curr) => total + curr.totalPrice, 0);
    daysBooked = yearlyAccepted.length;
    activeSince = timeSince(publishTime);
  }

  const navigate = useNavigate();

  const acceptHandler = (bookingId) => {
    apiCall('PUT', '/bookings/accept/' + bookingId, {}, true)
      .then(() => {
        setBookingListingData(listingId, setData);
      });
  }

  const deniedHandler = (bookingId) => {
    apiCall('PUT', '/bookings/decline/' + bookingId, {}, true)
      .then(() => setBookingListingData(listingId, setData));
  }

  const AcceptedChip = () => <Chip color="success"> Accepted </Chip>
  const DeniedChip = () => <Chip color="danger"> Declined </Chip>
  const UnknownChip = () => <Chip color="neutral"> Unknown </Chip>
  const StatusChip = ({ status }) => {
    if (status.localeCompare('accepted') === 0) {
      return <AcceptedChip />
    } else if (status.localeCompare('declined') === 0) {
      return <DeniedChip />
    } else {
      return <UnknownChip />
    }
  }

  const AcceptDelete = ({ bookingId }) => {
    return (
    <div>
      <Chip color="success" onClick={() => acceptHandler(bookingId)}> Accept </Chip>
      <span>&nbsp;or&nbsp;</span>
      <Chip color="danger" onClick={() => deniedHandler(bookingId)}> Decline </Chip>
    </div>
    );
  }

  const ReservationTablePending = ({ data }) => {
    return (
      <Table
          sx={{ '& thead th:nth-of-type(1)': { width: '25%' } }}
          borderAxis="xBetween"
          size="md"
          stickyFooter={false}
          stickyHeader
          variant="plain">
            <thead>
              <tr>
                <th>Reservation by</th>
                <th>Start</th>
                <th>End</th>
                <th>Price</th>
                <th width='160px' >Action</th>
              </tr>
            </thead>
            <tbody>
              {rows(data).map((row, i) => (
                <tr key={i}>
                  <td>{row.user}</td>
                  <td>{row.startDate}</td>
                  <td>{row.endDate}</td>
                  <td>{row.price}</td>
                  <td> <AcceptDelete bookingId={row.bookingId} navigate={navigate}/> </td>
                </tr>
              ))}
            </tbody>
          </Table>
    );
  }

  const ReservationTableStatus = ({ data }) => {
    return (
      <Table
          sx={{ '& thead th:nth-of-type(1)': { width: '25%' } }}
          borderAxis="xBetween"
          size="md"
          stickyFooter={false}
          stickyHeader
          variant="plain">
            <thead>
              <tr>
                <th>Reservation by</th>
                <th>Start</th>
                <th>End</th>
                <th>Price</th>
                <th width='150px'>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows(data).map((row, i) => (
                <tr key={i}>
                  <td>{row.user}</td>
                  <td>{row.startDate}</td>
                  <td>{row.endDate}</td>
                  <td>{row.price}</td>
                  <td> <StatusChip status={row.status}/> </td>
                </tr>
              ))}
            </tbody>
          </Table>
    );
  }

  const ReservationTable = () => {
    return (
      <Tabs aria-label="Basic tabs" defaultValue={0}>
        <TabList>
          <Tab>Pending</Tab>
          <Tab>Accepted</Tab>
          <Tab>Declined</Tab>
        </TabList>
        <TabPanel value={0}>
          { pendingData.length === 0 ? <Typography> No pending bookings. </Typography> : <ReservationTablePending data={pendingData}/> }
        </TabPanel>
        <TabPanel value={1}>
          { acceptedData.length === 0 ? <Typography> No accepted bookings yet. </Typography> : <ReservationTableStatus data={acceptedData}/> }
        </TabPanel>
        <TabPanel value={2}>
        { declinedData.length === 0 ? <Typography> No declined bookings yet. </Typography> : <ReservationTableStatus data={declinedData}/> }
        </TabPanel>
      </Tabs>
    )
  }

  const Booking = () => {
    return (
    <Grid container spacing={2} sx={{ flexGrow: 1, padding: '50px 80px' }}>
      <Grid xs={3}>
        <Sheet sx={{ borderRadius: '8px', minHeight: '90%' }}>
          <Typography level='h3'>{title}</Typography>
          <br/>
          <Typography className='listing-info' level='body-md'><b>Active since</b><br/>{activeSince}</Typography>
          <Typography className='listing-info' level='body-md'> <b>Yearly earnings</b><br/> {dollarFormat(yearlyEarnings)}</Typography>
          <Typography className='listing-info' level='body-md'><b>Days booked in {thisYear}</b><br/>{daysBooked}</Typography>
        </Sheet>
      </Grid>
      <Grid xs={9}>
      <Typography level='h3' sx={{ marginBottom: '15px' }}>Reservations</Typography>
      <ReservationTable/>
      </Grid>
    </Grid>)
  }

  return data ? <Booking /> : <Loading />
}
