import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../helpers/apicalls';
import { LoadPhoto } from '../helpers/image';
import { ListingDataContext, useContext } from '../listingDataContext';
import BreadCrumbs from './breadcrumbs'

import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { InfoOutlined } from '@mui/icons-material';
import { FormLabel, Button, FormHelperText, FormControl, Card, Typography } from '@mui/joy'
import ScrollButton from './scroll-top';
import { Title, Address, Location, Price, Amenities, Type, Features, BedroomLayout, Footer, SubmitButton } from './listing-info-fragments';

export const ErrorInfo = ({ children }) => {
  return (
    <FormHelperText>
      <InfoOutlined />
      {children}
    </FormHelperText>
  );
}

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

export const EditListing = ({ listingId }) => {
  const navigate = useNavigate();
  const { listingData, setListingData } = useContext(ListingDataContext);
  const data = listingData.find(x => x.id === listingId).data;

  const [title, setTitle] = React.useState(data.title);
  const [address, setAddress] = React.useState(data.address.address);
  const [city, setCity] = React.useState(data.address.city);
  const [state, setState] = React.useState(data.address.state);
  const [price, setPrice] = React.useState(data.price);
  const [type, setType] = React.useState(data.metadata.type);
  const [bedrooms, setBedrooms] = React.useState(data.metadata.bedrooms);
  const [baths, setBaths] = React.useState(data.metadata.baths);
  const [photo, setPhoto] = React.useState(data.metadata.photos);
  const [amenities, setAmenities] = React.useState(data.metadata.amenities);
  const [badInputs, setBadInputs] = React.useState({
    title: '',
    address: '',
    city: '',
    price: '',
    type: '',
    photo: '',
  })
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
      thumbnail: photo[0].photo,
      metadata: {
        type,
        baths,
        bedrooms,
        beds,
        sleepingArrangement,
        amenities,
        photos: photo
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
        <BedroomLayout key={i} num={i}
        single={single} setSingle={setSingle}
        double={double} setDouble={setDouble}
        queen={queen} setQueen={setQueen}
        king={king} setKing={setKing}
        sofaBed={sofaBed} setSofaBed={setSofaBed} />
      )
    })
  }

  return (
    <div id='my-listings'>
      <Container maxWidth="sm">
        <BreadCrumbs navigate={navigate}> Edit Listing </BreadCrumbs>
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
          <div>
            <Button variant='outlined' onClick={(e) => handlerSave()}>Save</Button>
            <Typography sx={{ display: 'inline', margin: '0px 5px' }}> or </Typography>
            <SubmitButton onClick={(e) => handlerUpdate()}>Update listing</SubmitButton>
          </div>
          <ScrollButton />
        </Footer>
        {/* {errMsg.length !== 0 && <ErrorCallout> {errMsg.error} </ErrorCallout>}
        {submitError && <ErrorCallout> Form has missing field(s) - please double check before submitting.</ErrorCallout>} */}

      </Container>
    </div>
  );
}
