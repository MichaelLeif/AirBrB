import React from 'react';
import {
  path
} from './Pages.jsx';
import { Listinfo } from './Listinfo.jsx'
import ButtonGroup from '@mui/joy/ButtonGroup';
import IconButton from '@mui/joy/IconButton';
import Settings from '@mui/icons-material/Settings';
import Typography from '@mui/joy/Typography';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import Slider from '@mui/joy/Slider';
import Button from '@mui/joy/Button';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import useMediaQuery from '@mui/material/useMediaQuery';

const contentContainer = {
  height: 'auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr)',
  gridTemplateRows: 'auto auto',
  columnGap: '24px',
  rowGap: '50px',
  overflow: 'auto',
}

const searchContainer = {
  position: 'absolute',
  top: '-25px',
  width: '50%',
  height: '150px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: '2000'
}

const container = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '10px 20px',
  boxSizing: 'border-box'
}

const opacityContainer = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '10px 20px',
  boxSizing: 'border-box',
  backgroundColor: 'grey',
  borderRadius: '50px',
  opacity: '0.5'
}

const inputContainer = {
  width: '90%',
  height: '40%',
  display: 'flex',
  alignItems: 'center',
  border: '1px solid',
  borderRadius: '50px',
  boxShadow: 'rgb(0, 0, 0, 0.12) 0px 6px 16px'
}

const dest = {
  width: '29%',
  cursor: 'pointer'
}

const date = {
  width: '22.5%',
  cursor: 'pointer'
}

const input = {
  border: 'none',
  outline: 'none',
  fontWeight: 'bold',
  fontSize: '13px',
  color: 'black',
  cursor: 'pointer'
}

const label = {
  fontWeight: 'bold',
  fontSize: '13px',
  fontFamily: 'Arial'
}

const line = {
  display: 'block',
  borderRight: '1px solid black',
  height: '60%'
}

export const Landing = () => {
  const mobileResponsive = useMediaQuery('only screen and (min-width: 400px) and (max-width: 1000px');
  const [listing, setListings] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [isHover, setHover] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const [filterValue, setFilterValue] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [minPrice, setMinPrice] = React.useState(0);
  const [maxPrice, setMaxPrice] = React.useState(0);
  const [minBedroom, setMinBedroom] = React.useState(0);
  const [maxBedroom, setMaxBedroom] = React.useState(0);
  const [bookings, setBookings] = React.useState([]);
  const [mobileSearch, setMobileSearch] = React.useState(false);

  const wrapper = {
    opacity: open ? '0.2' : '1'
  }

  React.useEffect(async () => {
    let response = await fetch(path + '/listings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    const moreData = [];
    for (const place of data.listings) {
      response = await fetch(path + '/listings/' + place.id, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      });
      const received = await response.json();
      if (received.listing.published) {
        received.listing.id = place.id;
        moreData.push(received.listing);
      }
    }
    console.log(moreData);
    let books;
    if (localStorage.getItem('token')) {
      const response = await fetch(path + '/bookings', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: localStorage.getItem('token')
        }
      });
      const data = await response.json();
      books = data.bookings;
    }
    if (data.error) {
      alert(data.error);
    } else {
      if (filter === 'title') {
        const filtered = await moreData.filter(e => {
          if (!e.title.toLowerCase().includes(filterValue[0].toLowerCase())) {
            if (e.address.city.toLowerCase().includes(filterValue[0].toLowerCase()) || e.address.city.toLowerCase().includes(filterValue[0].toLowerCase()) || e.address.city.toLowerCase().includes(filterValue[0].toLowerCase())) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        });
        setListings(filtered);
      } else if (filter === 'bedroom') {
        const filtered = moreData.filter(e => {
          if (e.metadata.bedroom >= filterValue[0] && e.metadata.bedroom <= filterValue[1]) {
            return true;
          }
          return false;
        })
        setListings(filtered);
      } else if (filter === 'price') {
        const filtered = moreData.filter(e => {
          if (e.price >= filterValue[0] && e.price <= filterValue[1]) {
            return true;
          }
          return false;
        });
        setListings(filtered);
      } else if (filter === 'rating') {
        if (filterValue[0] === 'highest') {
          const filtered = moreData.sort((a, b) => {
            if (a.reviews.length === 0) {
              return 1;
            } else if (b.reviews.length === 0) {
              return -1;
            }
            if ((a.reviews.reduce((r, a) => { return r + a.rating }, 0) / a.reviews.length) > (b.reviews.reduce((r, b) => { return r + b.rating }, 0) / b.reviews.length)) {
              return -1;
            } else {
              return 1;
            }
          });
          setListings(filtered);
        } else if (filterValue[0] === 'lowest') {
          const filtered = moreData.sort((a, b) => {
            if (a.reviews.length === 0) {
              return -1;
            } else if (b.reviews.length === 0) {
              return 1;
            }
            if ((a.reviews.reduce((r, a) => { return r + a.rating }, 0) / a.reviews.length) < (b.reviews.reduce((r, b) => { return r + b.rating }, 0) / b.reviews.length)) {
              return -1;
            } else {
              return 1;
            }
          });
          setListings(filtered);
        }
      } else if (filter === 'date') {
        const filtered = moreData.filter(listing => {
          for (const available of listing.availability) {
            if (new Date(filterValue[0]) >= new Date(available.start) && new Date(filterValue[1]) <= new Date(available.end)) {
              return true;
            }
          }
          return false;
        })
        setListings(filtered);
      } else {
        if (books) {
          data.listings = data.listings.sort((a, b) => a.title.localeCompare(b.title));
          data.listings = data.listings.sort((a, b) => {
            for (const booking of books) {
              if (a.id === parseInt(booking.listingId)) {
                console.log(a);
                if (localStorage.getItem('user') === booking.owner) {
                  return -1;
                }
              } else if (b.id === parseInt(booking.listingId)) {
                if (localStorage.getItem('user') === booking.owner) {
                  return 1;
                }
              }
            }
            return 0;
          });
          setListings(moreData);
          setBookings(books);
        } else {
          const filtered = moreData.sort((a, b) => a.title.localeCompare(b.title))
          setListings(filtered);
        }
      }
      setLoading(false);
    }
  }, [filter, filterValue])

  if (loading) {
    return (
      <>
        <Box sx={contentContainer}>
          LOADING
        </Box>
      </>
    )
  }

  const handleFilter = (e) => {
    e.preventDefault();
    let searchTarget = '';
    let value = [];
    for (const element of e.target) {
      console.log(element);
      if (element.value && element.value !== 'No filter' && element.name) {
        searchTarget = element.name ? element.name : element.id;
        value.push(element.value);
      }
    }
    if ((value[0] !== '0' || value[1] !== '0') && searchTarget === 'bedroom') {
      searchTarget = 'price';
      setMinPrice(0);
      setMaxPrice(0);
    } else if (value[0] === '0' && value[1] === '0' && searchTarget === 'bedroom') {
      value = value.slice(2, 4);
      setMinBedroom(0);
      setMaxBedroom(0);
    } else if (value.includes('highest') || value.includes('lowest')) {
      value = value.slice(4);
      searchTarget = 'rating';
    }
    if (value[0] === '0' && value[1] === '0' && searchTarget !== 'rating') {
      searchTarget = '';
    }
    setListings([]);
    setFilter(searchTarget);
    setFilterValue(value);
  }

  return (
    <>
      <Box sx={wrapper}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={searchContainer}>
            {
              !mobileResponsive
                ? <form style={inputContainer} onSubmit={(e) => {
                  handleFilter(e);
                }}>
                  <Box sx={{ ...dest, ...(isHover === 'title' ? opacityContainer : container) }} onMouseEnter={() => {
                    setHover('title');
                  }} onMouseLeave={() => {
                    setHover('');
                  }}>
                    <label htmlFor='title' style={label}>Where</label>
                    <input name='title' type='text' style={input} placeholder='Search Destinations' defaultValue='' />
                  </Box>
                  <Box name='vl' style={line}></Box>
                  <Box sx={{ ...date, ...(isHover === 'check-in' ? opacityContainer : container) }} onMouseEnter={() => {
                    setHover('check-in');
                  }} onMouseLeave={() => {
                    setHover('');
                  }}>
                    <label htmlFor='check-in' style={label}>Check in </label>
                    <input name='date' type='date' style={input} defaultValue='' />
                  </Box>
                  <Box name='vl' style={line}></Box>
                  <Box sx={{ ...date, ...(isHover === 'check-out' ? opacityContainer : container) }} onMouseEnter={() => {
                    setHover('check-out');
                  }} onMouseLeave={() => {
                    setHover('');
                  }}>
                    <label htmlFor='check-out' style={label}>Check out </label>
                    <input name='date' type='date' style={input} defaultValue='' />
                  </Box>
                  <Box name='vl' style={line}></Box>
                  <ButtonGroup variant='plain' style={{ margin: '0 5px' }}>
                    <IconButton onClick={(e) => {
                      setOpen(true);
                    }}>
                      Filter
                      <Settings />
                    </IconButton>
                  </ButtonGroup>
                  <Button type='submit' size="md" variant={'solid'} color="danger" style={{ borderRadius: '50px', height: '100%', width: '100%' }}>
                    Search
                  </Button>
                </form>
                : <Button
                  color='danger'
                  sx={{ marginTop: '150px', zIndex: '-10000', ...mobileSearch && { display: 'none' } }}
                  onClick={(e) => {
                    setMobileSearch(true);
                  }}
                >Search</Button>
            }
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: '36px', width: '100%', margin: '0 30px', marginBottom: '50px', rowGap: '50px' }}>
            {
              listing.map((e) => {
                let status;
                if (bookings) {
                  for (const booking of bookings) {
                    if (status === 'accepted') {
                      break;
                    }
                    if (localStorage.getItem('user') === booking.owner && e.id === parseInt(booking.listingId)) {
                      status = booking.status;
                    }
                  }
                }
                return Listinfo(e, filter === 'date' ? filterValue : undefined, status);
              })
            }
          </Box>
        </Box>
      </Box>
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={mobileSearch}
          onClose={() => setMobileSearch(false)}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          size='lg'
        >
          <Sheet
            variant="outlined"
            sx={{
              maxWidth: 400,
              borderRadius: 'md',
              p: 3,
              boxShadow: 'lg',
            }}
          >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h1"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Search
          </Typography>
          <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} onSubmit={(e) => {
            e.preventDefault();
            handleFilter(e);
            setMobileSearch(false);
          }}>
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', columnGap: '20px', marginBottom: '20px' }}>
              <FormControl>
                <FormLabel>Where</FormLabel>
                <Input
                  name='title'
                  placeholder='Search Destination'
                  style={{ width: '100%' }}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                  }}
                />
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', rowGap: '20px', marginBottom: '20px' }}>
              <FormControl>
                <FormLabel>CHECK-IN</FormLabel>
                <Input
                  name='date'
                  type='date'
                  style={{ width: '100%' }}
                  onChange={(e) => {
                    setMinBedroom(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>CHECK-OUT</FormLabel>
                <Input
                  name='date'
                  type='date'
                  style={{ width: '100%' }}
                  onChange={(e) => {
                    setMaxBedroom(e.target.value);
                  }}
                />
              </FormControl>
            </Box>
            <ButtonGroup variant='plain' style={{ margin: '0 5px', marginBottom: '10px' }}>
              <IconButton onClick={(e) => {
                setMobileSearch(false);
                setOpen(true);
              }}>
                Filter
                <Settings />
              </IconButton>
            </ButtonGroup>
            <Button type='submit' color='danger' size='lg'>Search</Button>
          </form>
        </Sheet>
      </Modal>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        size='lg'
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 400,
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h1"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Advanced search
          </Typography>
          <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} onSubmit={(e) => {
            e.preventDefault();
            handleFilter(e);
            setOpen(false);
          }}>
            <Typography
            style={{ marginBottom: '20px' }}
            >
              Price
            </Typography>
            <Box sx={{ width: 350 }}>
              <Slider
                defaultValue={[0, 0]}
                max={50000}
                getAriaValueText={(value) => {
                  return `$${value}`
                }}
                color="danger"
                onChange={(e) => {
                  setMinPrice(e.target.value[0]);
                  setMaxPrice(e.target.value[1]);
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', columnGap: '20px', marginBottom: '20px' }}>
              <FormControl>
                <FormLabel>Min</FormLabel>
                <Input
                  name='price'
                  startDecorator={'$'}
                  value={minPrice}
                  style={{ width: '100px' }}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Max</FormLabel>
                <Input
                  name='price'
                  startDecorator={'$'}
                  value={maxPrice}
                  style={{ width: '100px' }}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                  }}
                />
              </FormControl>
            </Box>
            <Typography
            style={{ marginBottom: '20px' }}
            >
              Bedroom
            </Typography>
            <Box sx={{ width: 350 }}>
              <Slider
                defaultValue={[0, 0]}
                max={50}
                getAriaValueText={(value) => {
                  return `$${value}`
                }}
                color="danger"
                onChange={(e) => {
                  setMinBedroom(e.target.value[0]);
                  setMaxBedroom(e.target.value[1]);
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', columnGap: '20px', marginBottom: '20px' }}>
              <FormControl>
                <FormLabel>Min</FormLabel>
                <Input
                  name='bedroom'
                  value={minBedroom}
                  style={{ width: '100px' }}
                  onChange={(e) => {
                    setMinBedroom(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Max</FormLabel>
                <Input
                  name='bedroom'
                  value={maxBedroom}
                  style={{ width: '100px' }}
                  onChange={(e) => {
                    setMaxBedroom(e.target.value);
                  }}
                />
              </FormControl>
            </Box>
            <Select
              placeholder="Rating"
              size="md"
              variant="outlined"
              style={{ marginBottom: '20px' }}
              defaultValue='No filter'
              name='rating'
              >
              <Option value='no-filter'>No filter</Option>
              <Option value='highest'>Highest</Option>
              <Option value='lowest'>Lowest</Option>
            </Select>
            <Button type='submit' color='danger' size='lg'>Search</Button>
          </form>
        </Sheet>
      </Modal>
    </>
  )
}
