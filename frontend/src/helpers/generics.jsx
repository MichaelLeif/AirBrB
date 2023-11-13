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
