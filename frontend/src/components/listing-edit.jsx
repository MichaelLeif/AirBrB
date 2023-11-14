import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { apiCall } from '../helpers/apicalls'
import { Button, ButtonGroup, Accordion, AccordionGroup, AccordionSummary, AccordionDetails } from '@mui/joy'
import BreadCrumbs from './breadcrumbs'

import { ListingDataContext, useContext } from '../listingDataContext';
import { RoundButton, ListingInfo, SomethingWrongError } from './listing-info-fragments';
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

export const SleepingArrangements = ({ bedrooms, sleepingArrangement }) => {
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
      // let isMounted = true;
      // if (isMounted) {
      sleepingArrangement = sleepingArrangement.filter(x => {
        return x.i !== sleepArr.i && x.i !== undefined
      });
      sleepingArrangement.push(sleepArr);
      // return () => { isMounted = false }
    }
    , [sleepArr])

    useEffect(() => {
      // let isMounted = true;
      setSleepArr(bed);
      // return () => { isMounted = false }
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
  const sleepingArrangement = React.useState(data.metadata.sleepingArrangement)[0];
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

  return (
    <div id='my-listings'>
      <Container maxWidth="sm">
        <BreadCrumbs navigate={navigate}> Edit Listing </BreadCrumbs>
        <ListingInfo title={title} setTitle={setTitle} address={address} setAddress={setAddress}
          city={city} setCity={setCity} state={state} setState={setState} price={price} setPrice={setPrice}
          type={type} setType={setType} bedrooms={bedrooms} setBedrooms={setBedrooms} baths={baths}
          setBaths={setBaths} amenities={amenities} setAmenities={setAmenities} photo={photo} setPhoto={setPhoto}
          sleepingArrangement={sleepingArrangement} edit={true}/>
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
