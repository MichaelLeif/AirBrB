import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  SvgIcon, Input, Button, FormHelperText, FormControl, Card, Grid,
  AccordionGroup, AccordionSummary, AccordionDetails, Accordion
} from '@mui/joy'
import { LocationOn, InfoOutlined } from '@mui/icons-material';

import Link from '@mui/joy/Link';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { apiCall } from '../helpers/apicalls';
import { fileToDataUrl } from '../helpers/image';

import {
  houseSVG, apartmentSVG, boatSVG, treehouseSVG, ryokanSVG,
  hotelSVG, bnbSVG, mansionSVG, tentSVG, wifiSVG, safeSVG, tvSVG, alarmSVG,
  airconSVG, kitchenSVG, fireplaceSVG, parkingSVG, washingSVG
} from '../helpers/svg'

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

export default function InteractiveCard () {
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        width: 320,
        '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
        '&:active': { backgroundColor: '#ffffff' },
      }}
    >
      <CardContent>
        <Typography level="title-lg" id="card-description">
          Yosemite Park
        </Typography>
        <Typography level="body-sm" aria-describedby="card-description" mb={1}>
          <Link
            overlay
            underline="none"
            href="#interactive-card"
            sx={{ color: 'text.tertiary' }}
          >
            California, USA
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
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
        // setPhoto(old => [...old, {
        //   photo: files[0],
        // }]);
        setPhoto(() => [{ photo: files[0] }]);
      }} />
    </Button>
  );
}

const loadPhotos = (photos) => {
  return Promise.all(photos.map(async (photo, i) => {
    return (<img key={i} height='200px' src={await fileToDataUrl(photo.photo)} alt='listing photo uploaded'/>)
  }))
}

let sleepingArrangement = [];

export const NewListing = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [type, setType] = React.useState('');
  const [bedrooms, setBedrooms] = React.useState('1');
  const [baths, setBaths] = React.useState('1');
  const [photo, setPhoto] = React.useState([]);
  const errors = [];

  const LoadPhoto = () => {
    const [pic, loadPic] = React.useState('');
    useEffect(() => {
      loadPhotos(photo)
        .then((data) => loadPic(data));
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
    if (check) {
      errors.push(price);
    }
    return check;
  }

  const PlaceTypeCard = ({ svg, title }) => {
    return (
      <Grid xs={4}>
        <SelectCard
        value={type}
        sx={{
          '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
        }}
        onClick={() => {
          setType(title);
        }}
        >
          {svg}
          <Link
            overlay
            underline="none"
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
          address,
          price,
          thumbnail: data,
          metadata: {
            type,
            beds,
            sleepingArrangement,
            bedrooms,
            baths,
            active: false,
          }
        }, true)
          .then(() => navigate('/listings/my'))
          .catch((err) => setErrorMsg(err.error))
      })
  }

  return (
    <div id='my-listings'>
      <Container maxWidth="sm">
        <Link color="neutral" level="body-sm" underline="always" onClick={(e) => navigate('/listings/my')}> Go back to your listings </Link>
        <h3> Give your listing a title. </h3>
        <Input placeholder="Name of listing" value={title} size="lg" onChange={(e) => setTitle(e.target.value)}/>

        <h3> Where is your listing located? </h3>
        <Input
          placeholder="Listing address"
          size="lg"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          startDecorator={
            <Button variant="soft" color="neutral" startDecorator={<LocationOn />}></Button>
          }
        />

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
          <PlaceTypeCard svg={houseSVG} title='House' />
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
          <PlaceTypeCard svg={wifiSVG} title='Wifi'/>
          <PlaceTypeCard svg={airconSVG} title='Air Conditioner'/>
          <PlaceTypeCard svg={fireplaceSVG} title='Fireplace'/>
          <PlaceTypeCard svg={parkingSVG} title='Parking'/>
          <PlaceTypeCard svg={tvSVG} title='TV'/>
          <PlaceTypeCard svg={kitchenSVG} title='Kitchen Essentials'/>
          <PlaceTypeCard svg={washingSVG} title='Washing Machine'/>
          <PlaceTypeCard svg={alarmSVG} title='Smoke Alarm'/>
          <PlaceTypeCard svg={safeSVG} title='Safe'/>
        </Grid>

        <br/>
        <LoadPhoto />
        <br/>

        <Button onClick={(e) => { createListing() }}>Create new listing</Button>
        { errorMsg.length !== 0 ? SomethingWrongError() : null }
      </Container>
    </div>
  );
}
