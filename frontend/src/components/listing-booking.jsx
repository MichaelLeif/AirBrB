import React from 'react'
import { Grid, Sheet, Typography, Table, Chip } from '@mui/joy';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
// import Button from '@mui/joy/Button';
// import ButtonGroup from '@mui/joy/ButtonGroup';
import { apiCall } from '../helpers/apicalls';
import { useNavigate, useParams } from 'react-router-dom';

function createData (user, startDate, endDate, price, status, bookingId) {
  return { user, startDate, endDate, price, status, bookingId };
}

const dollarFormat = (price) => {
  return '$' + price.toString()
}

const rows = (data) => {
  return data.map(x => createData(x.owner, x.dateRange.start, x.dateRange.end, dollarFormat(x.totalPrice), x.status, x.id));
};

export const ListingReservations = ({ data }) => {
  console.log('parse', data);
  const title = data.title;
  const reservationData = data.data;
  const navigate = useNavigate();
  const listingId = useParams().id;

  const acceptHandler = (bookingId) => {
    apiCall('PUT', '/bookings/accept/' + bookingId, {}, true)
      .then(() => {
        console.log('accept');
        navigate('/listings/reservations/' + listingId)
        console.log('accepted');
      });
  }

  const deniedHandler = (bookingId) => {
    apiCall('PUT', '/bookings/decline/' + bookingId, {}, true)
      .then(() => navigate('/listings/reservations/' + listingId));
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

  const ReservationTable = ({ data, navigate }) => {
    console.log('reservation pending data', data);
    const pendingData = data.filter(x => x.status.localeCompare('pending') === 0);
    const acceptedData = data.filter(x => x.status.localeCompare('accepted') === 0);
    const declinedData = data.filter(x => x.status.localeCompare('declined') === 0);
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

  return (
    <Grid container spacing={2} sx={{ flexGrow: 1, padding: '50px 80px' }}>
      <Grid xs={3}>
        <Sheet sx={{ borderRadius: '8px', minHeight: '90%' }}>
          <Typography level='h3'>{title}</Typography>
        </Sheet>
      </Grid>
      <Grid xs={9}>
      <Typography level='h3' sx={{ marginBottom: '15px' }}>Reservations</Typography>
      <ReservationTable data={reservationData} navigate={navigate}/>
      </Grid>
    </Grid>
  );
}
