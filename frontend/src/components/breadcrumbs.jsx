import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

function handleClick (event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export function BreadCrumbsViaMyListing ({ navigate, children }) {
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" sx={{ '&:hover': { cursor: 'pointer' } }} onClick={() => navigate('/')}>
          Home
        </Link>
        <Link underline="hover" color="inherit" sx={{ '&:hover': { cursor: 'pointer' } }} onClick={() => navigate('/listings/my')}>
          My Listings
        </Link>
        <Typography color="text.primary">{children}</Typography>
      </Breadcrumbs>
    </div>
  );
}

export function BreadCrumbsViaHome ({ navigate, children }) {
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ textAlign: 'left' }}>
        <Link underline="hover" color="inherit" sx={{ '&:hover': { cursor: 'pointer' } }} onClick={() => navigate('/')}>
          Home
        </Link>
        <Typography color="text.primary">{children}</Typography>
      </Breadcrumbs>
    </div>
  );
}
