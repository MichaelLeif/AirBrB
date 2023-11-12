import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { apiCall } from '../helpers/apicalls'

export function GoLiveDialog ({ listing }) {
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState(1);
  const [dates, setDates] = React.useState([{
    key: 0,
    start: '',
    finish: '',
  }]);

  const AvailablilityDatePickers = () => {
    return dates.map((i) => {
      console.log(i);
      return (
        <DatePicker key={i.key} id={i.key}/>
      )
    })
  }

  const deleteDateHandler = (id) => {
    console.log('delete');
    setDates(old => {
      old = old.filter(x => x.key !== id);
      console.log('old');
      return old;
    })
  }

  const dateHandler = (key, value, isStart) => {
    const details = findDate(key);
    if (isStart) {
      const finish = details.finish;
      setDates(old => {
        old = old.filter(x => x.key !== key);
        old.push({
          key,
          start: value,
          finish,
        })
        return old;
      })
    } else {
      const start = details.start;
      setDates(old => {
        old = old.filter(x => x.key !== key);
        old.push({
          key,
          start,
          finish: value,
        })
        return old;
      })
    }
  }

  const findDate = (key) => {
    console.log(dates, key);
    const foundDate = dates.filter(x => {
      return x.key === key;
    })[0];
    return foundDate;
  }

  const DatePicker = ({ id }) => {
    console.log('id', id);
    return (
      <div className='goLiveDate'>
        <FormControl>
            <FormLabel>Start</FormLabel>
            <Input fullWidth type='date' value={findDate(id).start} onChange={(e) => dateHandler(id, e.target.value, true)} required/>
        </FormControl>
        <FormControl>
            <FormLabel>Finish</FormLabel>
            <Input fullWidth type='date' value={findDate(id).finish} onChange={(e) => dateHandler(id, e.target.value, false)} required/>
        </FormControl>
        <IconButton aria-label="delete" onClick={() => deleteDateHandler(id)}>
          <DeleteIcon/>
        </IconButton>
      </div>
    )
  }

  const handleDateAdd = () => {
    setDates(old =>
      [...old, {
        key: id,
        start: '',
        finish: ''
      }]
    )
    setId(id => id + 1);
  }

  const handleSubmit = (id) => {
    const availability = dates.map(x => {
      return {
        start: x.start,
        end: x.finish,
      }
    });
    apiCall('PUT', '/listings/publish/' + id, { availability }, true);
    setOpen(false);
  }

  return (
    <React.Fragment>
      <Button
        color="success"
        onClick={() => setOpen(true)}
      >
        Go Live
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog >
          <DialogTitle>Publish your listing</DialogTitle>
          <DialogContent>Fill in the dates of your listing&apos;s availability.</DialogContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <AvailablilityDatePickers/>
              <Button type="button" variant='outlined' startDecorator={<Add />} onClick={(e) => handleDateAdd()}>Add date range</Button>
              <Button type="button" onClick={() => handleSubmit(listing)}>Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
