import React, { useState } from 'react';
import { Button } from '@mui/joy';
const ScrollButton = () => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true)
    } else if (scrolled <= 300) {
      setVisible(false)
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  window.addEventListener('scroll', toggleVisible);

  return (
    <Button
    variant='plain'
    onClick={scrollToTop}
    style={{ display: visible ? 'inline' : 'none' }}>
      Scroll to the top
    </Button>
  );
}

export default ScrollButton;
