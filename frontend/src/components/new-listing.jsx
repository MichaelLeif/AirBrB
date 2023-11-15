import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../helpers/apicalls';
import { LoadPhoto } from '../helpers/image';

import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocationOn, InfoOutlined } from '@mui/icons-material';
import {
  Input, Button, FormHelperText, FormControl, Card, Grid,
  AccordionGroup, AccordionSummary, AccordionDetails, Accordion, Stack,
  Select, Option, Link
} from '@mui/joy'

import {
  houseSVG, apartmentSVG, boatSVG, treehouseSVG, ryokanSVG,
  hotelSVG, bnbSVG, mansionSVG, tentSVG, wifiSVG, safeSVG, tvSVG, alarmSVG,
  airconSVG, kitchenSVG, fireplaceSVG, parkingSVG, washingSVG
} from '../helpers/svg'

import BreadCrumbs from './breadcrumbs';

export const ErrorInfo = ({ children }) => {
  return (
    <FormHelperText>
      <InfoOutlined />
      {children}
    </FormHelperText>
  );
}

const PriceError = () => {
  return <ErrorInfo> Please provide your price to 2dp. </ErrorInfo>
}

const RoundButton = styled(Button)(() => ({
  borderRadius: '50%/50%',
  fontSize: '1rem',
  minHeight: 'none',
  width: '35px',
  height: '35px',
}));

export const SelectCard = styled(Card)(() => ({
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

let sleepingArrangement = [];

export const NewListing = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [state, setState] = React.useState('NSW');
  const [city, setCity] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [type, setType] = React.useState('');
  const [bedrooms, setBedrooms] = React.useState('1');
  const [baths, setBaths] = React.useState('1');
  const [photo, setPhoto] = React.useState([]);
  const [amenities, setAmenities] = React.useState([]);

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
        sleepingArrangement = sleepingArrangement.filter(x => {
          return x.i !== sleepArr.i && x.i !== undefined
        });
        sleepingArrangement.push(sleepArr);
      }
      , [sleepArr])

      useEffect(() => setSleepArr(bed), [single, double, queen, king, sofaBed]);

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
        <ErrorInfo> {errorMsg} </ErrorInfo>
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

  const createListing = () => {
    const beds = sleepingArrangement.reduce((accumulator, currentValue) =>
      accumulator + currentValue.single + currentValue.double + currentValue.queen + currentValue.king + currentValue.sofaBed,
    0);
    apiCall('POST', '/listings/new', {
      title,
      address: {
        address,
        city,
        state,
      },
      price,
      thumbnail: photo[0].photo,
      metadata: {
        type,
        baths: parseInt(baths),
        bedrooms: parseInt(bedrooms),
        beds,
        sleepingArrangement,
        amenities,
        photos: photo,
        more: 123,
      }
    }, true)
      .then(() => {
        navigate('/listings/my')
      })
      .catch((err) => setErrorMsg(err.error))
  }

  const SubmitButton = styled(Button)(() => ({
    margin: '5px 0px 30px 0px'
  }))

  return (
    <div id='my-listings'>
      <Container maxWidth="sm">
        <BreadCrumbs navigate={navigate}> Create Listing </BreadCrumbs>

        {/* <h3> Upload a JSON file of your listing. </h3> */}

        {/* <OrDivider/> */}
        <h3> Give your listing a title. </h3>
        <Input required placeholder="Name of listing" value={title} size="lg" onChange={(e) => setTitle(e.target.value)}/>

        <h3> Where is your listing located? </h3>
        <Input
          placeholder="Listing address"
          size="lg"
          fullWidth
          required
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
            required
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
          required
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
        <SleepingArrangements />

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
        <LoadPhoto photo={photo} setPhoto={setPhoto}> Upload photos of your listing </LoadPhoto> <br/>
        <SubmitButton onClick={(e) => { createListing() }}>Create new listing</SubmitButton>
        { errorMsg.length !== 0 ? SomethingWrongError() : null }
      </Container>
    </div>
  );
}
