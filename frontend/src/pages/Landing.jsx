import React from 'react';
import {
  path
} from './Pages.jsx';
import Listinfo from './Listinfo.jsx'
import ButtonGroup from '@mui/joy/ButtonGroup';
import IconButton from '@mui/joy/IconButton';
import Settings from '@mui/icons-material/Settings';
import '@fontsource/inter';
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

const contentContainer = {
  height: 'auto',
  padding: '150px 70px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr)',
  gridTemplateRows: 'auto auto',
  columnGap: '24px',
  rowGap: '50px',
  overflow: 'auto'
}

const searchContainer = {
  position: 'fixed',
  top: '0',
  width: '100%',
  height: '150px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
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
  width: '42%',
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

  const wrapper = {
    opacity: open ? '0.2' : '1'
  }

  React.useEffect(async () => {
    const response = await fetch(path + '/listings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      if (!filter) {
        data.listings = data.listings.sort((a, b) => a.title.localeCompare(b.title))
        setListings(data.listings);
        setLoading(false);
      }
    }
  }, [])

  React.useEffect(async () => {
    const response = await fetch(path + '/listings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    const moreData = [];
    for (const place of data.listings) {
      const response = await fetch(path + '/listings/' + place.id, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      });
      const received = await response.json();
      moreData.push(received.listing);
    }
    if (data.error) {
      alert(data.error);
    } else {
      if (filter === 'title') {
        data.listings = await data.listings.filter(e => {
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
        setListings(data.listings);
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
            if (a.reviews.reduce((r, a) => { return r + a.rating }, 0) > b.reviews.reduce((r, b) => { return r + b.rating }, 0)) {
              return -1;
            } else {
              return 1;
            }
          });
          setListings(filtered);
        } else if (filterValue[0] === 'lowest') {
          const filtered = moreData.sort((a, b) => {
            if (a.reviews.reduce((r, a) => { return r + a.rating }, 0) < b.reviews.reduce((r, b) => { return r + b.rating }, 0)) {
              return -1;
            } else {
              return 1;
            }
          });
          setListings(filtered);
        }
      } else if (filter === 'date') {
        alert('date filter');
        setListings(data.listings);
      } else {
        data.listings = data.listings.sort((a, b) => a.title.localeCompare(b.title))
        setListings(data.listings);
      }
    }
  }, [filter, filterValue])

  if (loading) {
    return (
      <>
        <div style={contentContainer}>
          LOADING
        </div>
      </>
    )
  }

  const handleFilter = (e) => {
    e.preventDefault();
    let searchTarget = '';
    let value = [];
    for (const element of e.target) {
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
      <div style={wrapper}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={searchContainer}>
            <form style={inputContainer} onSubmit={(e) => {
              handleFilter(e);
            }}>
              <div style={{ ...dest, ...(isHover === 'title' ? opacityContainer : container) }} onMouseEnter={() => {
                setHover('title');
              }} onMouseLeave={() => {
                setHover('');
              }}>
                <label htmlFor='title' style={label}>Where</label>
                <input id='title' name='title' type='text' style={input} placeholder='Search Destinations' defaultValue='' />
              </div>
              <div name='vl' style={line}></div>
              <div style={{ ...date, ...(isHover === 'check-in' ? opacityContainer : container) }} onMouseEnter={() => {
                setHover('check-in');
              }} onMouseLeave={() => {
                setHover('');
              }}>
                <label htmlFor='check-in' style={label}>Check in </label>
                <input id='date' name='check-in' type='date' style={input} defaultValue='' />
              </div>
              <div name='vl' style={line}></div>
              <div style={{ ...date, ...(isHover === 'check-out' ? opacityContainer : container) }} onMouseEnter={() => {
                setHover('check-out');
              }} onMouseLeave={() => {
                setHover('');
              }}>
                <label htmlFor='check-out' style={label}>Check out </label>
                <input id='date' name='check-out' type='date' style={input} defaultValue='' />
              </div>
              <div name='vl' style={line}></div>
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
          </div>
        </div>
        <div style={contentContainer}>
          {
            listing.map((e) => {
              return Listinfo(e, filter === 'check-in' || filter === 'check-out' ? filterValue : undefined);
            })
          }
        </div>
      </div>
      {
        open &&
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
              <Box sx={{ width: 400 }}>
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
              <div style={{ display: 'flex', width: '100%', justifyContent: 'center', columnGap: '20px', marginBottom: '20px' }}>
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
              </div>
              <Typography
              style={{ marginBottom: '20px' }}
              >
                Bedroom
              </Typography>
              <Box sx={{ width: 400 }}>
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
              <div style={{ display: 'flex', width: '100%', justifyContent: 'center', columnGap: '20px', marginBottom: '20px' }}>
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
              </div>
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
      }
    </>
  )
}
