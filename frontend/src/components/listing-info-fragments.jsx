import React from 'react';
import { styled } from '@mui/material/styles';
import { Button, Grid } from '@mui/joy'

export const RoundButton = styled(Button)(() => ({
  borderRadius: '50%/50%',
  fontSize: '1rem',
  minHeight: 'none',
  width: '35px',
  height: '35px',
}))

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
