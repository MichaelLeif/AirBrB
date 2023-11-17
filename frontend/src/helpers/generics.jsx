import React from 'react';
import Container from '@mui/joy/Container';
import Button from '@mui/joy/Button';
import { styled } from '@mui/material';

// Loading button
export const LoadingButton = styled(Button)({
  height: '73px',
})

export const Loading = () => {
  return (
    <Container maxWidth="sm">
      <LoadingButton loading variant="plain">Loading</LoadingButton>
    </Container>
  )
}

// Login/register box
export const AuthBox = styled(Container)({
  borderRadius: '10px',
  padding: '0px',
  marginTop: '80px',
  border: '1px solid rgb(149, 149, 149)',
  '& h2': {
    marginTop: '30px',
    marginBottom: '10px'
  }
})

export const AuthTitle = styled('div')({
  display: 'flex',
  justifyContent: 'center'
})

// Horizontal line styling
export const Line = styled('hr')({
  opacity: '30%',
  margin: '0px',
})

export const ListingInfoPage = styled(Container)({
  padding: '30px 80px',
  backgroundColor: 'white'
})

export const ListingInfoPageMobile = styled(Container)({
  padding: '30px 20px',
  backgroundColor: 'white'
})

export const IconDecorator = styled(Button)({
  '& span.MuiButton-startDecorator': {
    margin: 0,
  }
})

export const ModifyFeature = styled('div')({
  display: 'flex',
  alignItems: 'baseline',
  gap: '10px',
  padding: '10px 0px'
})

export const CenteredDiv = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
})

export const GoLiveDate = styled('div')({
  display: 'flex',
  width: '100%',
  gap: '5px',
  alignItems: 'flex-end'
})

export const ListingPhotos = styled('img')({
  borderRadius: '8px',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  '&:hover': {
    cursor: 'pointer',
    opacity: 0.5
  },
})
