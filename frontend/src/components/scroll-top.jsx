import React from 'react';
import { Button } from '@mui/joy';
const ScrollButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Button
    variant='plain'
    onClick={scrollToTop}
    style={{ display: 'inline' }}>
      Scroll to the top
    </Button>
  );
}

export default ScrollButton;
