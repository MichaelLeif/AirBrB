import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Button, Accordion, AccordionGroup, AccordionSummary, AccordionDetails, Input, Stack, Option, Select } from '@mui/joy'
import { apiCall } from '../helpers/apicalls';
import { fileToDataUrl } from '../helpers/image';
import BreadCrumbs from './breadcrumbs';
import { ListingInfo } from './listing-info-fragments';
import { BasicFeatures } from './listing-edit';
import { LocationOn } from '@mui/icons-material';

const sleepingArrangement = [];

export const SleepingArrangementsNew = ({ bedrooms, sleepingArrangement }) => {
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

export const NewListing = () => {
  const navigate = useNavigate();
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

  const fetchThumbnail = () => {
    return fileToDataUrl(photo[0].photo);
  }

  const createListing = () => {
    const beds = sleepingArrangement.reduce((accumulator, currentValue) =>
      accumulator + currentValue.single + currentValue.double + currentValue.queen + currentValue.king + currentValue.sofaBed,
    0);
    fetchThumbnail()
      .then((data) => {
        apiCall('POST', '/listings/new', {
          title,
          address: {
            address,
            city,
            state,
          },
          price,
          thumbnail: data,
          metadata: {
            type,
            baths: parseInt(baths),
            bedrooms: parseInt(bedrooms),
            beds,
            sleepingArrangement,
            amenities,
          }
        }, true)
          .then(() => {
            navigate('/listings/my')
          })
          // .catch((err) => setErrorMsg(err.error))
      })
  }

  // const OrDividerGrid = styled(Grid)(() => ({
  //   alignItems: 'center',
  //   '& > hr': { flexGrow: '1' },
  //   '& > span': { padding: '0px 8px' }
  // }))

  // const OrDivider = () => {
  //   return (
  //     <OrDividerGrid container spacing={2}>
  //       <hr/>
  //       <span>or</span>
  //       <hr/>
  //     </OrDividerGrid>
  //   )
  // }

  const SubmitButton = styled(Button)(() => ({
    margin: '5px 0px 30px 0px'
  }))

  return (
    <div id='my-listings'>
      <Container maxWidth="sm">
        <BreadCrumbs navigate={navigate}> Create Listing </BreadCrumbs>

        {/* <h3> Upload a JSON file of your listing. </h3> */}

        {/* <OrDivider/> */}
      </Container>
      <Container maxWidth="sm">
      <section>
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
      </section>
        <ListingInfo title={title} setTitle={setTitle} address={address} setAddress={setAddress}
          city={city} setCity={setCity} state={state} setState={setState} price={price}
          setPrice={setPrice} type={type} setType={setType} bedrooms={bedrooms} setBedrooms={setBedrooms}
          baths={baths} setBaths={setBaths} amenities={amenities} setAmenities={setAmenities}
          photo={photo} setPhoto={setPhoto} sleepingArrangement={sleepingArrangement} edit={false}/>
        <SubmitButton onClick={(e) => { createListing() }}>Create new listing</SubmitButton>
        {/* { errorMsg.length !== 0 ? SomethingWrongError() : null } */}
      </Container>
    </div>
  );
}
