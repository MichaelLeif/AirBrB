import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { apiCall } from '../helpers/apicalls'
import {
  SvgIcon, Input, Button, FormHelperText, FormControl, Card, Grid,
  AccordionGroup, AccordionSummary, AccordionDetails, Accordion, Stack,
  Select, Option, ButtonGroup
} from '@mui/joy'
import { LocationOn, InfoOutlined } from '@mui/icons-material';

import Link from '@mui/joy/Link';
import { fileToDataUrl } from '../helpers/image';

import {
  houseSVG, apartmentSVG, boatSVG, treehouseSVG, ryokanSVG,
  hotelSVG, bnbSVG, mansionSVG, tentSVG, wifiSVG, safeSVG, tvSVG, alarmSVG,
  airconSVG, kitchenSVG, fireplaceSVG, parkingSVG, washingSVG
} from '../helpers/svg'
import { ListingDataContext, useContext } from '../listingDataContext';

export const ErrorInfo = ({ children }) => {
  return (
    <FormHelperText>
      <InfoOutlined />
      {children}
    </FormHelperText>
  );
}

const PriceError = () => {
  return <ErrorInfo> Please provide your price to 2 dp. </ErrorInfo>
}

const RoundButton = styled(Button)(() => ({
  borderRadius: '50%/50%',
  fontSize: '1rem',
  minHeight: 'none',
  width: '35px',
  height: '35px',
}));

export const SelectCard = styled(Card)((theme) => ({
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px;',
  borderRadius: '8px',
  height: '80px',
  variant: 'outlined',
  '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
  '&:active': { backgroundColor: '#ffffff' },
}));

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const InputFileUpload = (photo, setPhoto) => {
  return (
    <Button
      component="label"
      role={undefined}
      tabIndex={-1}
      variant="outlined"
      color="neutral"
      startDecorator={
        <SvgIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
        </SvgIcon>
      }
    >
      Upload a photo
      <VisuallyHiddenInput type="file" onChange={(e) => {
        const files = Array.from(e.target.files);
        setPhoto(old => [...old, {
          photo: files[0],
        }]);
      }} />
    </Button>
  );
}

const loadPhotos = (photos) => {
  return Promise.all(photos.map(async (photo, i) => {
    return (<img key={i} height='200px' src={await fileToDataUrl(photo.photo)} alt='listing photo uploaded'/>)
  }))
}

export const EditListing = ({ listingId }) => {
  const navigate = useNavigate();
  const { listingData, setListingData } = useContext(ListingDataContext);
  const data = listingData.find(x => x.id === listingId).data;
  console.log('refresh');

  const [title, setTitle] = React.useState(data.title);
  const [address, setAddress] = React.useState(data.address.address);
  const [city, setCity] = React.useState(data.address.city);
  const [state, setState] = React.useState(data.address.state);
  const [price, setPrice] = React.useState(data.price);
  const [type, setType] = React.useState(data.metadata.type);
  const [bedrooms, setBedrooms] = React.useState(data.metadata.bedrooms);
  const [baths, setBaths] = React.useState(data.metadata.baths);
  const [photo, setPhoto] = React.useState([]);// thumbnail
  const [amenities, setAmenities] = React.useState(data.metadata.amenities);
  let sleepingArrangement = React.useState(data.metadata.sleepingArrangement)[0];
  const allData = () => {
    const beds = sleepingArrangement.reduce((accumulator, currentValue) =>
      accumulator + currentValue.single + currentValue.double +
      currentValue.queen + currentValue.king + currentValue.sofaBed, 0);
    return {
      title,
      address: {
        address,
        city,
        state
      },
      price,
      thumbnail: photo[0],
      metadata: {
        type,
        baths,
        bedrooms,
        beds,
        sleepingArrangement,
        amenities
      }
    }
  }

  const handlerSave = () => {
    setListingData(old => {
      old = old.filter(x => x.id !== listingId);
      return [...old, {
        id: listingId,
        data: allData()
      }];
    });
    navigate('/listings/my');
  }

  const handlerUpdate = () => {
    apiCall('PUT', '/listings/' + listingId, allData(), true)
      .then(() => {
        setListingData(old => {
          old = old.filter(x => x.id !== listingId);
          return [...old, {
            id: listingId,
            data: allData()
          }];
        });
        navigate('/listings/my');
      })
  }

  const LoadPhoto = () => {
    let success = true;
    const [pic, loadPic] = React.useState('');
    useEffect(() => {
      loadPhotos(photo)
        .then((data) => {
          if (success) {
            loadPic(data);
          }
        });
      return () => {
        success = false;
      }
    }, [photo]);
    return (
      <>
        <h3> Upload photos of your listing </h3>
        <div>
          {pic}
        </div>
        {InputFileUpload(photo, setPhoto)}
        <br/>
        <br/>
        <hr/>
      </>
    );
  }

  const SleepingArrangements = () => {
    const [sleepArr, setSleepArr] = React.useState([]);
    const bedroomArray = Array.from({ length: bedrooms }, (_, i) => i + 1)
    return bedroomArray.map((i) => {
      let bedroomSleepingDetails = sleepingArrangement.filter(x => x.i === i);
      bedroomSleepingDetails = bedroomSleepingDetails.length === 0 ? [] : bedroomSleepingDetails[0];
      const [single, setSingle] = React.useState(bedroomSleepingDetails.single == null ? 0 : bedroomSleepingDetails.single);
      const [double, setDouble] = React.useState(bedroomSleepingDetails.double == null ? 0 : bedroomSleepingDetails.double);
      const [queen, setQueen] = React.useState(bedroomSleepingDetails.queen == null ? 0 : bedroomSleepingDetails.queen);
      const [king, setKing] = React.useState(bedroomSleepingDetails.king == null ? 0 : bedroomSleepingDetails.king);
      const [sofaBed, setSofaBed] = React.useState(bedroomSleepingDetails.sofaBed == null ? 0 : bedroomSleepingDetails.sofaBed);
      const bed = {
        i,
        single,
        double,
        queen,
        king,
        sofaBed
      }

      useEffect(() => {
        let isMounted = true;
        if (isMounted) {
          sleepingArrangement = sleepingArrangement.filter(x => {
            return x.i !== sleepArr.i && x.i !== undefined
          });
          sleepingArrangement.push(sleepArr);
        }
        return () => { isMounted = false }
      }
      , [sleepArr])

      useEffect(() => {
        let isMounted = true;
        if (isMounted) setSleepArr(bed);
        return () => { isMounted = false }
      }, [single, double, queen, king, sofaBed]);

      return (
        <div key={i}>
          <AccordionGroup size="md" color="success" transition=
          {{
            initial: '0.3s ease-out',
            expanded: '0.2s ease',
          }}>
            <Accordion>
              <AccordionSummary>Bedroom {i}</AccordionSummary>
              <AccordionDetails>
                <BasicFeatures title='Single' feature={single} setFeature={setSingle} minSize={0}/>
                <BasicFeatures title='Double' feature={double} setFeature={setDouble} minSize={0}/>
                <BasicFeatures title='Queen' feature={queen} setFeature={setQueen} minSize={0}/>
                <BasicFeatures title='King' feature={king} setFeature={setKing} minSize={0}/>
                <BasicFeatures title='Sofa Bed' feature={sofaBed} setFeature={setSofaBed} minSize={0}/>
              </AccordionDetails>
            </Accordion>
          </AccordionGroup>
        </div>
      )
    })
  }

  const SomethingWrongError = () => {
    return (
      <FormControl error>
        <ErrorInfo>Something went wrong</ErrorInfo>
      </FormControl>
    )
  }

  const priceCheck = (price) => {
    const check = price.match(/^[0-9]+\.[0-9]{2}$/) != null || price.match(/^[0-9]+$/) != null || price.length === 0;
    return check;
  }

  const PlaceTypeCard = ({ svg, title }) => {
    const selectColor = (title.localeCompare(type) === 0 ? '#ededed' : null)
    return (
      <Grid xs={4}>
        <SelectCard
          // color={shade}
          sx={{ backgroundColor: selectColor }}
        >
          {svg}
          <Link
            overlay
            underline="none"
            onClick={() => {
              setType(title);
              console.log('clicked on', title);
            }}
            sx={{ color: 'text.tertiary' }}
          >
            {title}
          </Link>
        </SelectCard>
      </Grid>
    )
  }

  const AmenitiesCard = ({ svg, title }) => {
    const selectColor = amenities.includes(title) ? '#ededed' : null;
    return (
      <Grid xs={4}>
        <SelectCard
          sx={{ backgroundColor: selectColor }}
        >
          {svg}
          <Link
            overlay
            underline="none"
            onClick={() => {
              console.log('clicked on', title);
              if (amenities.includes(title)) {
                setAmenities(old => {
                  old = old.filter(x => x.localeCompare(title) !== 0)
                  console.log('remove', title);
                  return old;
                })
              } else {
                setAmenities(old => {
                  return [title, ...old];
                })
              }
            }}
            sx={{ color: 'text.tertiary' }}
          >
            {title}
          </Link>
        </SelectCard>
      </Grid>
    )
  }

  const BasicFeatures = ({ title, feature, setFeature, minSize }) => {
    return (
      <div className='basicFeature'>
          <p> {title} </p>
          <div className='modifyFeature'>
            <RoundButton variant='outlined' disabled = {feature <= minSize} onClick={(e) => setFeature(parseInt(feature) - 1)}> - </RoundButton>
            <p> {feature} </p>
            <RoundButton variant='outlined' onClick={(e) => setFeature(parseInt(feature) + 1)}> + </RoundButton>
          </div>
        </div>
    )
  }

  return (
    <div id='my-listings'>
      <Container maxWidth="sm">
        <Link color="neutral" level="body-sm" underline="always" onClick={(e) => navigate('/listings/my')}> Back to your listings </Link>
        <h3> Give your listing a title. </h3>
        <Input name='title' placeholder="Name of listing" value={title} size="lg" onChange={(e) => {
          console.log('reset title to', e.target.value);
          setTitle(e.target.value);
        }}/>

        <h3> Where is your listing located? </h3>
        <Input
          placeholder="Listing address"
          size="lg"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx = {{ marginBottom: '5px' }}
          startDecorator={
            <Button variant="soft" color="neutral" startDecorator={<LocationOn />}></Button>
          }
        />

        <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={0.5}
        >
          <Input
            placeholder="City or suburb"
            size="lg"
            value={city}
            sx = {{ width: '75%' }}
            onChange={(e) => setCity(e.target.value)}
          />
          <Select sx = {{ width: '25%' }} size="lg" value={state} onChange={(e) => {
            console.log('change to', e.target.innerText);
            setState(e.target.innerText)
          }}>
            <Option value="NSW">NSW</Option>
            <Option value="VIC">VIC</Option>
            <Option value="QLD">QLD</Option>
            <Option value="SA">SA</Option>
            <Option value="WA">WA</Option>
            <Option value="TAS">TAS</Option>
            <Option value="NT">NT</Option>
            <Option value="ACT">ACT</Option>
          </Select>
        </Stack>

        <h3> How much is it to stay at your listing per night? </h3>
        <FormControl error = {!priceCheck(price)}>
          <Input
          size="lg"
          placeholder="Amount"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          startDecorator={'$'}
          />
          {!priceCheck(price) ? PriceError() : null}
        </FormControl>

        <h3> Which of these best describes your place? </h3>
        <Grid container spacing={2}>
          <PlaceTypeCard svg={houseSVG} title='House'/>
          <PlaceTypeCard svg={apartmentSVG} title='Apartment' />
          <PlaceTypeCard svg={bnbSVG} title='Bed & Breakfast' />
          <PlaceTypeCard svg={hotelSVG} title='Hotel' />
          <PlaceTypeCard svg={treehouseSVG} title='Treehouse' />
          <PlaceTypeCard svg={mansionSVG} title='Mansion' />
          <PlaceTypeCard svg={tentSVG} title='Tent' />
          <PlaceTypeCard svg={ryokanSVG} title='Ryokan' />
          <PlaceTypeCard svg={boatSVG} title='Boat' />
        </Grid>

        <h3> Share some basic details about the place </h3>
        <BasicFeatures title='Bedrooms' feature={bedrooms} setFeature={setBedrooms} minSize={0}/>
        <hr/>
        <BasicFeatures title='Baths' feature={baths} setFeature={setBaths} minSize={1}/>

        <h3> Sleeping arrangements </h3>
        <SleepingArrangements/>

        <h3> Select all the amenities at your listing </h3>
        <Grid container spacing={2}>
          <AmenitiesCard svg={wifiSVG} title='Wifi'/>
          <AmenitiesCard svg={airconSVG} title='Air Conditioner'/>
          <AmenitiesCard svg={fireplaceSVG} title='Fireplace'/>
          <AmenitiesCard svg={parkingSVG} title='Parking'/>
          <AmenitiesCard svg={tvSVG} title='TV'/>
          <AmenitiesCard svg={kitchenSVG} title='Kitchen Essentials'/>
          <AmenitiesCard svg={washingSVG} title='Washing Machine'/>
          <AmenitiesCard svg={alarmSVG} title='Smoke Alarm'/>
          <AmenitiesCard svg={safeSVG} title='Safe'/>
        </Grid>

        <br/>
        <LoadPhoto />
        <br/>
        <ButtonGroup spacing='10px'>
          <Button variant='outlined' onClick={(e) => {
            handlerSave();
          }}>Save</Button>
          <Button variant='solid' color='primary' onClick={(e) => { handlerUpdate() }}>Update listing</Button>
        </ButtonGroup>
        <SomethingWrongError />
      </Container>
    </div>
  );
}
