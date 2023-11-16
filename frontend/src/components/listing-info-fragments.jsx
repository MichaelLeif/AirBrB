import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Button, Grid, Card, Link, FormControl, FormLabel, FormHelperText, Input, Stack,
  Select, Option, AccordionGroup, AccordionSummary, AccordionDetails, Accordion
} from '@mui/joy'
import { LocationOn, InfoOutlined } from '@mui/icons-material';
import {
  houseSVG, apartmentSVG, boatSVG, treehouseSVG, ryokanSVG,
  hotelSVG, bnbSVG, mansionSVG, tentSVG, wifiSVG, safeSVG, tvSVG, alarmSVG,
  airconSVG, kitchenSVG, fireplaceSVG, parkingSVG, washingSVG
} from '../helpers/svg'
import { errorMessage } from './new-listing'
import ReportIcon from '@mui/icons-material/Report';
import Box from '@mui/joy/Box';
import Alert from '@mui/joy/Alert';
import Typography from '@mui/joy/Typography';

export const ErrorInfo = ({ children }) => {
  return (
    <FormHelperText>
      <InfoOutlined />
      {children}
    </FormHelperText>
  );
}

export const Footer = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline'
}))

export const RoundButton = styled(Button)(() => ({
  borderRadius: '50%/50%',
  fontSize: '1rem',
  minHeight: 'none',
  width: '35px',
  height: '35px',
}))

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

const OrDividerGrid = styled(Grid)(() => ({
  alignItems: 'center',
  '& > hr': { flexGrow: '1' },
  '& > span': { padding: '0px 8px' }
}))

export const OrDivider = () => {
  return (
    <OrDividerGrid container spacing={2}>
      <hr/>
      <span>or</span>
      <hr/>
    </OrDividerGrid>
  )
}

const AmenitiesCard = ({ amenities, setAmenities, svg, title }) => {
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

export const Amenities = ({ amenities, setAmenities }) => {
  return (
    <section>
      <FormControl>
        <FormLabel sx={{ fontSize: '1.1rem', margin: '30px 0px 10px 0px' }}> Select all the amenities at your listing. </FormLabel>
      </FormControl>
      <Grid container spacing={2}>
        <AmenitiesCard amenities={amenities} setAmenities={setAmenities} svg={wifiSVG} title='Wifi'/>
        <AmenitiesCard amenities={amenities} setAmenities={setAmenities} svg={airconSVG} title='Air Conditioner'/>
        <AmenitiesCard amenities={amenities} setAmenities={setAmenities} svg={fireplaceSVG} title='Fireplace'/>
        <AmenitiesCard amenities={amenities} setAmenities={setAmenities} svg={parkingSVG} title='Parking'/>
        <AmenitiesCard amenities={amenities} setAmenities={setAmenities} svg={tvSVG} title='TV'/>
        <AmenitiesCard amenities={amenities} setAmenities={setAmenities} svg={kitchenSVG} title='Kitchen Essentials'/>
        <AmenitiesCard amenities={amenities} setAmenities={setAmenities} svg={washingSVG} title='Washing Machine'/>
        <AmenitiesCard amenities={amenities} setAmenities={setAmenities} svg={alarmSVG} title='Smoke Alarm'/>
        <AmenitiesCard amenities={amenities} setAmenities={setAmenities} svg={safeSVG} title='Safe'/>
      </Grid>
    </section>
  )
}

export const BasicFeatures = ({ title, feature, setFeature, minSize }) => {
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

export const Features = ({ bedrooms, setBedrooms, baths, setBaths }) => {
  return (
    <div>
      <FormControl>
        <FormLabel sx={{ fontSize: '1.1rem', margin: '20px 0px 0px 0px' }}> Share some basic details about the place. </FormLabel>
      </FormControl>
      <BasicFeatures title='Bedrooms' feature={bedrooms} setFeature={setBedrooms} minSize={1}/>
      <hr/>
      <BasicFeatures title='Bathrooms' feature={baths} setFeature={setBaths} minSize={1}/>
    </div>
  )
}

const PlaceTypeCard = ({ type, setType, svg, title }) => {
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

export const Type = ({ type, setType, badInputs, setBadInputs }) => {
  return (
    <section>
      <FormControl error={type !== undefined && type.length === 0}>
        <FormLabel required sx={{ fontSize: '1.1rem', margin: '10px 0px' }}> Which of these best describes your place? </FormLabel>
        {badInputs.type && <FormHelperText>
          <InfoOutlined />
          {badInputs.type}
        </FormHelperText>}
      </FormControl>
      <Grid container spacing={2}>
        <PlaceTypeCard type={type} setType={setType} svg={houseSVG} title='House'/>
        <PlaceTypeCard type={type} setType={setType} svg={apartmentSVG} title='Apartment' />
        <PlaceTypeCard type={type} setType={setType} svg={bnbSVG} title='Bed & Breakfast' />
        <PlaceTypeCard type={type} setType={setType} svg={hotelSVG} title='Hotel' />
        <PlaceTypeCard type={type} setType={setType} svg={treehouseSVG} title='Treehouse' />
        <PlaceTypeCard type={type} setType={setType} svg={mansionSVG} title='Mansion' />
        <PlaceTypeCard type={type} setType={setType} svg={tentSVG} title='Tent' />
        <PlaceTypeCard type={type} setType={setType} svg={ryokanSVG} title='Ryokan' />
        <PlaceTypeCard type={type} setType={setType} svg={boatSVG} title='Boat' />
    </Grid>
    </section>
  )
}

const priceCheck = (price) => {
  const check = price.match(/^[0-9]+\.[0-9]{2}$/) != null || price.match(/^[0-9]+$/) != null || price.length === 0;
  return check;
}

const PriceError = () => {
  return <ErrorInfo> Please provide your price as an integer or to 2dp. </ErrorInfo>
}

export const Price = ({ price, setPrice, badInputs, setBadInputs }) => {
  return (
    <FormControl required error = {badInputs.price.length || !priceCheck(price)}>
      <FormLabel sx={{ fontSize: '1.1rem', margin: '10px 0px' }}> How much is it to stay at your listing per night? </FormLabel>
      <Input
      size="lg"
      required
      placeholder="Amount"
      value={price}
      onChange={(e) => changeHandler(e, 'price', setPrice, setBadInputs)}
      startDecorator={'$'}
      />
      {badInputs.price && <FormHelperText>
          <InfoOutlined />
          {badInputs.price}
        </FormHelperText>}
      {!priceCheck(price) ? PriceError() : null}
    </FormControl>
  )
}

export const SomethingWrongError = ({ children }) => {
  return (
    <FormControl error>
      <ErrorInfo> {children} </ErrorInfo>
    </FormControl>
  )
}

const statesList = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT']
const AllStates = ({ list }) => {
  return (
    list.map((state, i) => {
      return <Option key={i} value={state}>{state}</Option>
    })
  )
}

export const Location = ({ city, setCity, state, setState, badInputs, setBadInputs }) => {
  return (
    <section>
        <Stack
            direction="row"
            alignItems="flex-start"
            spacing={0.5}
        >
          <FormControl required error={badInputs.city !== ''} sx = {{ width: '75%' }}>
              <Input
                required
                size="lg"
                placeholder="City or suburb"
                value={city}
                onChange={(e) => changeHandler(e, 'city', setCity, setBadInputs)}
              />
              {badInputs.city && <FormHelperText>
                <InfoOutlined />
                {badInputs.city}
              </FormHelperText>}
          </FormControl>
          <Select sx = {{ width: '25%' }} size="lg" value={state} onChange={(e) => {
            console.log('change to', e.target.innerText);
            setState(e.target.innerText)
          }}>
            <AllStates list={statesList}/>
          </Select>
        </Stack>
    </section>
  )
}

export const SubmitButton = styled(Button)(() => ({
  margin: '5px 0px 30px 0px'
}))

export const changeHandler = (e, prop, setProp, setBadInputs) => {
  setProp(e.target.value);
  e.target.value.length === 0
    ? setBadInputs(old => {
      old[prop] = errorMessage[prop];
      console.log('set bad');
      return old;
    })
    : setBadInputs(old => {
      old[prop] = '';
      console.log('set ok');
      return old;
    })
}

export const Title = ({ title, setTitle, badInputs, setBadInputs }) => {
  return (
    <FormControl required error={badInputs.title !== ''}>
      <FormLabel sx={{ fontSize: '1.1rem', margin: '10px 0px' }}> Give your listing a title. </FormLabel>
      <Input
        size="lg"
        placeholder="Name of listing"
        value={title}
        autoFocus
        onChange={(e) => changeHandler(e, 'title', setTitle, setBadInputs)}/>
      {badInputs.title && <FormHelperText>
        <InfoOutlined />
        {badInputs.title}
      </FormHelperText>}
    </FormControl>
  )
}

export const Address = ({ address, setAddress, badInputs, setBadInputs }) => {
  return (
    <FormControl required error={badInputs.address !== ''}>
      <FormLabel sx={{ fontSize: '1.1rem', margin: '10px 0px' }}> Where is your listing located? </FormLabel>
        <Input
          size="lg"
          fullWidth
          placeholder="Listing address"
          value={address}
          onChange={(e) => changeHandler(e, 'address', setAddress, setBadInputs)}
          sx = {{ marginBottom: '5px' }}
          startDecorator={
            <Button variant="soft" color="neutral" startDecorator={<LocationOn />}></Button>
          }
        />
        {badInputs.address && <FormHelperText>
          <InfoOutlined />
          {badInputs.address}
        </FormHelperText>}
    </FormControl>
  )
}

export const PhotoTitle = ({ photo }) => {
  return (
    <FormControl required error={ photo !== undefined && photo.length === 0}>
      <FormLabel sx={{ fontSize: '1.1rem', margin: '30px 0px 10px 0px' }}> Upload photos of your listing </FormLabel>
    </FormControl>
  )
}

export const ErrorCallout = ({ children }) => {
  return (
    <div>
      <Box sx={{ transition: 'ease-in-out 1s', display: 'flex', gap: 2, width: '100%', flexDirection: 'column' }}>
      <Alert
          key='Error'
          sx={{ alignItems: 'flex-start' }}
          startDecorator={<ReportIcon />}
          variant="soft"
          color='danger'
        >
          <div>
            <div>Error</div>
            <Typography level="body-sm" color='danger'>
              {children}
            </Typography>
          </div>
        </Alert>
      </Box>
      <br/>
    </div>
  )
}

export const BedroomLayout = ({ num, single, setSingle, double, setDouble, queen, setQueen, king, setKing, sofaBed, setSofaBed }) => {
  return (
  <div key={num}>
    <AccordionGroup size="md" color="success" transition=
    {{
      initial: '0.3s ease-out',
      expanded: '0.2s ease',
    }}>
      <Accordion>
        <AccordionSummary>Bedroom {num}</AccordionSummary>
        <AccordionDetails>
          <BasicFeatures title='Single' feature={single} setFeature={setSingle} minSize={0}/>
          <BasicFeatures title='Double' feature={double} setFeature={setDouble} minSize={0}/>
          <BasicFeatures title='Queen' feature={queen} setFeature={setQueen} minSize={0}/>
          <BasicFeatures title='King' feature={king} setFeature={setKing} minSize={0}/>
          <BasicFeatures title='Sofa Bed' feature={sofaBed} setFeature={setSofaBed} minSize={0}/>
        </AccordionDetails>
      </Accordion>
    </AccordionGroup>
  </div>)
}
