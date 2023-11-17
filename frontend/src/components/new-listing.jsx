import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../helpers/apicalls';
import { LoadPhoto } from '../helpers/image';
import { Container } from '@mui/material';
import { FormControl, FormLabel, FormHelperText } from '@mui/joy'
import BreadCrumbs from './breadcrumbs';
import { Amenities, Features, Type, Price, Location, SubmitButton, BedroomLayout, OrDivider, Title, Address, ErrorCallout, Footer } from './listing-info-fragments';
import ScrollButton from './scroll-top';
import { ListingInfoPage } from '../helpers/generics';

let sleepingArrangement = [];
export const errorMessage = {
  title: 'Please provide a title',
  address: 'Please provide an address',
  city: 'Please provide a state',
  price: 'Please provide a price',
  type: 'Please select a type',
  photo: 'Please upload at least one photo of your listing'
}

export const NewListing = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = React.useState('')
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
  const [submitError, setSubmitError] = React.useState(false);
  const [submitClicked, setSubmitClicked] = React.useState(false);
  const [badInputs, setBadInputs] = React.useState({
    title: '',
    address: '',
    city: '',
    price: '',
    type: '',
    photo: '',
  })

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
      .catch((err) => setErrMsg(err))
  }

  const SleepingArrangements = ({ bedrooms }) => {
    const bedroomArray = Array.from({ length: bedrooms }, (_, i) => i + 1)
    return bedroomArray.map((i) => {
      const [sleepArr, setSleepArr] = React.useState([]);
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
        sleepingArrangement = sleepingArrangement.filter(x => (x.i !== sleepArr.i && x.i !== undefined));
        sleepingArrangement.push(sleepArr);
      }
      , [sleepArr])

      useEffect(() => setSleepArr(bed), [single, double, queen, king, sofaBed]);

      return (
        <BedroomLayout key={i} num={i}
        single={single} setSingle={setSingle}
        double={double} setDouble={setDouble}
        queen={queen} setQueen={setQueen}
        king={king} setKing={setKing}
        sofaBed={sofaBed} setSofaBed={setSofaBed} />
      )
    })
  }

  const allGoodInputs = () => {
    return [title, address, state, city, price, type, bedrooms, baths, photo].every(x => x !== null && x !== undefined && x.length !== 0)
  }

  if (!submitClicked) {
    if (submitError === true) {
      setSubmitError(false);
    }
  } else if (allGoodInputs() && submitError === true) {
    setSubmitError(false);
  } else if (!allGoodInputs() && submitError === false) {
    setSubmitError(true);
  }

  return (
    <ListingInfoPage>
      <Container maxWidth="sm">
        <BreadCrumbs navigate={navigate}> Create Listing </BreadCrumbs>
        <h3> Upload a JSON file of your listing. </h3>
        <br/>
        <OrDivider/>
        <br/>
        <Title title={title} setTitle={setTitle} badInputs={badInputs} setBadInputs={setBadInputs} />
        <br/>
        <Address address={address} setAddress={setAddress} badInputs={badInputs} setBadInputs={setBadInputs} />
        <Location city={city} setCity={setCity} state={state} setState={setState} badInputs={badInputs} setBadInputs={setBadInputs} />
        <br/>
        <Price price={price} setPrice={setPrice} badInputs={badInputs} setBadInputs={setBadInputs} />
        <br/>
        <Type type={type} setType={setType} badInputs={badInputs} setBadInputs={setBadInputs} />
        <br/>
        <Features bedrooms={bedrooms} setBedrooms={setBedrooms} baths={baths} setBaths={setBaths} />
        <br/>
        <FormControl required>
            <FormLabel sx={{ fontSize: '1.1rem', margin: '10px 0px' }}> Sleeping arrangments </FormLabel>
        </FormControl>
        <SleepingArrangements bedrooms={bedrooms}/>
        <br/>
        <Amenities amenities={amenities} setAmenities={setAmenities}/>
        <br/>
        <FormControl required>
            <FormLabel sx={{ fontSize: '1.1rem', margin: '10px 0px' }}> Upload photos of your listing </FormLabel>
            <FormHelperText>
              Only accepting JPEG, JPG or PNG.
            </FormHelperText>
        </FormControl>
        <br/>
        <LoadPhoto photo={photo} setPhoto={setPhoto}>Upload</LoadPhoto> <br/>

        <Footer>
          <SubmitButton onClick={(e) => {
            if (allGoodInputs()) {
              createListing();
            }
            setSubmitClicked(true);
          }}>Create new listing</SubmitButton>
          <ScrollButton />
        </Footer>
        {errMsg.length !== 0 && <ErrorCallout> {errMsg.error} </ErrorCallout>}
        {submitError && <ErrorCallout> Form has missing field(s) - please double check before submitting.</ErrorCallout>}
      </Container>
    </ListingInfoPage>
  );
}
