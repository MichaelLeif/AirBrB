import React from 'react';
import {
  Link,
} from 'react-router-dom';
import {
  path
} from './Pages.jsx';

const contentContainer = {
  height: 'auto',
  padding: '150px 70px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr)',
  gridTemplateRows: 'auto auto',
  columnGap: '24px',
  rowGap: '100px',
  overflow: 'auto'
}

const searchContainer = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '150px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
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
  width: '88%',
  height: '40%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  border: '1px solid',
  borderRadius: '50px',
  boxShadow: 'rgb(0, 0, 0, 0.12) 0px 6px 16px'
}

const dest = {
  width: '15%',
  cursor: 'pointer'
}

const bed = {
  width: '7%',
  cursor: 'pointer'
}

const bedRoom = {
  width: '10%',
  cursor: 'pointer'
}

const date = {
  width: '11%',
  cursor: 'pointer'
}

const price = {
  width: '12%',
  cursor: 'pointer'
}

const rating = {
  width: '9%',
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

function makeListing (props, dateValue) {
  const item = {
    height: '380px',
    cursor: 'pointer',
  }

  const img = {
    width: '100%',
    height: '80%',
    borderRadius: '20px',
  }

  const flex = {
    display: 'flex',
    flexDirection: 'column'
  }

  const grid = {
    display: 'grid',
    marginTop: '20px',
    marginLeft: '5px',
    columnGap: '20px',
    gridTemplateColumns: '85% 15%',
    gridTemplateRows: '25% 25% 25% 25%',
    gridTemplateAreas:
      `
      'Name Rating'
      'Address1 .'
      'Address2 .'
      'Price .'
      `,
  }

  const ListInfo = () => {
    return (
      <div style={flex}>
        <img style={img} src={props.thumbnail} />
        <div style={grid}>
          <span style={{ gridArea: 'Name' }}>{props.title}</span>
          <span style={{ gridArea: 'Address1' }}>{props.address.street}</span>
          <span style={{ gridArea: 'Address2' }}>{props.address.suburb}</span>
          <span style={{ gridArea: 'Price' }}>${props.price}</span>
          <span style={{ gridArea: 'Rating' }}>{
            props.reviews.reduce((r, a) => {
              return r + a.number
            }, 0) / props.reviews.length
          }</span>
        </div>
      </div>
    )
  }

  if (dateValue !== undefined) {
    return (
      <div key={props.id} style={item}>
        <Link to={`/listing/${props.id}/${dateValue[0]}/${dateValue[1]}`} key={props.id} style={{ textDecoration: 'none', color: 'black' }}>
          <ListInfo />
        </Link>
      </div>
    )
  }

  return (
    <div key={props.id} style={item}>
      <Link to={`/listing/${props.id}`} key={props.id} style={{ textDecoration: 'none', color: 'black' }}>
        <ListInfo />
      </Link>
    </div>
  )
}

function Landing () {
  const [listing, setListings] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [isHover, setHover] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const [filterValue, setFilterValue] = React.useState([]);

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
        data.listings = data.listings.sort((a, b) => a.title.localeCompare(b.title));
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
      } else if (filter === 'bed') {
        const filtered = moreData.filter(e => {
          if (e.metadata.bed >= filterValue[0] && e.metadata.bed <= filterValue[1]) {
            return true;
          }
          return false;
        })
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
      } else if (filter === 'ratings') {
        console.log(filterValue);
        if (filterValue[0] === 'Highest') {
          const filtered = moreData.sort((a, b) => {
            if (a.reviews.reduce((r, a) => { return r + a.number }, 0) > b.reviews.reduce((r, a) => { return r + b.number }, 0)) {
              return 1;
            } else {
              return -1;
            }
          });
          setListings(filtered);
        } else if (filterValue[0] === 'Lowest') {
          const filtered = moreData.sort((a, b) => {
            if (a.reviews.reduce((r, a) => { return r + a.number }, 0) < b.reviews.reduce((r, a) => { return r + b.number }, 0)) {
              return -1;
            } else {
              return 1;
            }
          });
          setListings(filtered);
        }
      } else {
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
    const value = [];
    for (const element of e.target) {
      if (element.value && element.value !== 'No filter') {
        searchTarget = element.id;
        value.push(element.value);
      }
    }
    setListings([]);
    setFilter(searchTarget);
    setFilterValue(value);
  }

  return (
    <div>
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
          <div style={{ ...bed, ...(isHover === 'min-bed' ? opacityContainer : container) }} onMouseEnter={() => {
            setHover('min-bed');
          }} onMouseLeave={() => {
            setHover('');
          }}>
            <label htmlFor='min-bed' style={label}>Min bed</label>
            <input id='bed' name='min-bed' type='number' style={input} placeholder='0' defaultValue=''/>
          </div>
          <div name='vl' style={line}></div>
          <div style={{ ...bed, ...(isHover === 'max-bed' ? opacityContainer : container) }} onMouseEnter={() => {
            setHover('max-bed');
          }} onMouseLeave={() => {
            setHover('');
          }}>
            <label htmlFor='max-bed' style={label}>Max bed</label>
            <input id='bed' name='max-bed' type='number' style={input} placeholder='0' defaultValue=''/>
          </div>
          <div name='vl' style={line}></div>
          <div style={{ ...bedRoom, ...(isHover === 'min-bedroom' ? opacityContainer : container) }} onMouseEnter={() => {
            setHover('min-bedroom');
          }} onMouseLeave={() => {
            setHover('');
          }}>
            <label htmlFor='min-bedroom' style={label}>Min bedroom</label>
            <input id='bedroom' name='min-bedroom' type='number' style={input} placeholder='0' defaultValue=''/>
          </div>
          <div name='vl' style={line}></div>
          <div style={{ ...bedRoom, ...(isHover === 'max-bedroom' ? opacityContainer : container) }} onMouseEnter={() => {
            setHover('max-bedroom');
          }} onMouseLeave={() => {
            setHover('');
          }}>
            <label htmlFor='max-bedroom' style={label}>Max bedroom</label>
            <input id='bedroom' name='max-bedroom' type='number' style={input} placeholder='0' defaultValue=''/>
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
          <div style={{ ...price, ...(isHover === 'min-price' ? opacityContainer : container) }} onMouseEnter={() => {
            setHover('min-price');
          }} onMouseLeave={() => {
            setHover('');
          }}>
            <label htmlFor='min-price' style={label}>Min price </label>
            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-start' }}>
              <span style={{ paddingTop: '2.8px' }}>$</span>
              <input id='price' name='min-price' type='number' style={{ ...input, width: '100%' }} placeholder='0' defaultValue='' />
            </div>
          </div>
          <div name='vl' style={line}></div>
          <div style={{ ...price, ...(isHover === 'max-price' ? opacityContainer : container) }} onMouseEnter={() => {
            setHover('max-price');
          }} onMouseLeave={() => {
            setHover('');
          }}>
            <label htmlFor='max-price' style={label}>Max price </label>
            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-start' }}>
              <span style={{ paddingTop: '2.8px' }}>$</span>
              <input id='price' name='max-price' type='number' style={{ ...input, width: '100%' }} placeholder='0' defaultValue='' />
            </div>
          </div>
          <div name='vl' style={line}></div>
          <div style={{ ...rating, ...(isHover === 'rating' ? opacityContainer : container) }} onMouseEnter={() => {
            setHover('rating');
          }} onMouseLeave={() => {
            setHover('');
          }}>
            <label htmlFor='ratings' style={label}>Ratings </label>
            <select id='ratings' name='ratings' style={{ border: 'none' }}>
              <option defaultValue=''>No filter</option>
              <option defaultValue='low'>Lowest</option>
              <option defaultValue='high'>Highest</option>
            </select>
          </div>
          <div style={container}>
            <button type='submit' style={{ height: '100%', borderRadius: '50px', border: 'none', cursor: 'pointer' }}>Search</button>
          </div>
        </form>
      </div>
      <div style={contentContainer}>
        {
          listing.map((e) => {
            console.log(e);
            return makeListing(e, filter === 'date' ? filterValue : undefined);
          })
        }
      </div>
    </div>
  )
}

export default Landing
