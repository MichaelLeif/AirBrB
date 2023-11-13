import * as React from 'react';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';

export default function Thumbnail ({ pic, setPic }) {
  return (
    <Card sx={{ minHeight: '280px' }}>
      <CardCover>
        {pic}
      </CardCover>
      <CardCover
        sx={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 50px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 150px)',
        }}
      />
      <CardContent sx={{ justifyContent: 'flex-end' }}>
        <Typography level="title-lg" textColor="#fff">
          Cover photo
        </Typography>
        <Link
            overlay
            underline="none"
            onClick={() => {
              console.log('clicked on thumbnail');
              setPic(old => {
                old = [...old].slice(1)
                console.log('new pics', old);
                return old;
              })
            }}
            sx={{ color: 'text.tertiary' }}
        ></Link>
      </CardContent>
    </Card>
  );
}
