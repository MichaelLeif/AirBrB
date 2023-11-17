import React, { useEffect } from 'react';
import { ImageListItem, ImageList } from '@mui/material';
import { Thumbnail } from '../components/thumbnail';
import { Button, SvgIcon } from '@mui/joy';
import { styled } from '@mui/material/styles';
import { ErrorCallout } from '../components/listing-info-fragments';
import { ListingPhotos } from './generics';

export function fileToDataUrl (file) {
  console.log(file)
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

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

export const LoadPhoto = ({ photo, setPhoto, children }) => {
  const [pic, loadPic] = React.useState('');
  useEffect(() => {
    const photos = loadPhotos(photo, setPhoto)
    loadPic(photos);
  }, [photo]);
  return (
    <section>
      <div>
        {pic.length > 0 ? <Thumbnail pic={pic[0]} setPic={setPhoto} /> : null}
        {pic.length > 1 ? <OtherPhotos pic={pic.slice(1)} /> : null}
      </div>
      <InputFileUpload handler={async (e, setError) => {
        try {
          const photo = await processPhoto(e);
          updatePhotos(photo, setPhoto);
          setError(false);
        } catch (e) {
          setError(true);
        }
      }}> {children} </InputFileUpload>
    </section>
  );
}

const OtherPhotos = ({ pic }) => {
  const pics = pic.map((pic, i) => {
    return (
      <ImageListItem key={i}>
        {pic}
      </ImageListItem>
    )
  })
  return (
    <ImageList cols={2} rowHeight={200}>
      {pics}
    </ImageList>
  )
}

const processPhoto = (e) => {
  const photo = e.target.files;
  return fileToDataUrl(photo[0]);
}

const updatePhotos = (photo, setPhoto) => {
  setPhoto(old => [...old, {
    photo,
  }]);
}

const InputFileUpload = ({ handler, children }) => {
  const [error, setError] = React.useState(false);
  return (
    <section>
      {error && <ErrorCallout> Invalid photo type - please try again. </ErrorCallout>}
      <Button
        component="label"
        role={undefined}
        tabIndex={-1}
        variant="outlined"
        color="neutral"
        sx={{
          marginBottom: '10px'
        }}
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
        { children }
        <VisuallyHiddenInput type="file" onChange={(e) => handler(e, setError)} />
      </Button>
    </section>
  );
}

const loadPhotos = (photos, setPhoto) => {
  console.log(photos);
  return photos.map((photo, i) => {
    return (
      <ListingPhotos key={i} src={photo.photo} alt='listing photo uploaded'
        onClick={(e) => setPhoto(old => {
          const before = [...old].slice(0, i)
          const after = [...old].slice(i + 1)
          return [...before, ...after];
        })}/>
    );
  })
}
