import React from 'react';
import { render, screen } from '@testing-library/react';
import { ListingCard } from './components/listing-card';
import userEvent from '@testing-library/user-event'

jest.mock('@mui/x-charts', () => jest.fn());
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const listedHome = {
  title: 'listed home',
  price: '1000',
  metadata: {
    type: 'House',
    beds: 3,
    bathrooms: 1,
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
  },
  reviews: [],
  published: true,
}

const unlistedHome = {
  title: 'unlisted home',
  price: '1000',
  metadata: {
    type: 'House',
    beds: 3,
    bathrooms: 1,
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
  },
  reviews: [],
  published: false,
}

const ratedHome = {
  title: 'listed home',
  price: '1000',
  metadata: {
    type: 'House',
    beds: 3,
    bathrooms: 1,
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
  },
  reviews: [
    {
      user: 'user1',
      rating: 5
    },
    {
      user: 'user2',
      rating: 3
    }
  ],
  published: true,
}

const noop = () => {};
const mockEdit = jest.fn();
const mockReservation = jest.fn();
const mockDelete = jest.fn();
const mockGoLive = jest.fn();

describe('<Listing card>', () => {
  it('renders the photo, title, listing details, edit, delete and unpublished for listed home', () => {
    render(<ListingCard id={123} data={listedHome} editHandler={noop} reservationHandler={noop} deleteHandler={noop} unpublishHandler={noop}/>)
    expect(screen.getByText(/listed home/i)).toBeInTheDocument()
    expect(screen.getByText(/beds/i)).toBeInTheDocument()
    expect(screen.getByText(/bathrooms/i)).toBeInTheDocument()
    expect(screen.getByText(/price/i)).toBeInTheDocument()
    expect(screen.getByText(/no reviews/i)).toBeInTheDocument()
    expect(screen.getByText(/3/i)).toBeInTheDocument()
    expect(screen.getByText(/1/i)).toBeInTheDocument()
    expect(screen.getByText(/\$1000.00/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /unpublish/i })).toBeInTheDocument();
  })

  it('renders the photo, title, listing details, edit, delete and unpublished for unlisted home', () => {
    render(<ListingCard id={123} data={unlistedHome} editHandler={noop} reservationHandler={noop} deleteHandler={noop} unpublishHandler={noop}/>)
    expect(screen.getByText(/listed home/i)).toBeInTheDocument()
    expect(screen.getByText(/beds/i)).toBeInTheDocument()
    expect(screen.getByText(/bathrooms/i)).toBeInTheDocument()
    expect(screen.getByText(/price/i)).toBeInTheDocument()
    expect(screen.getByText(/no reviews/i)).toBeInTheDocument()
    expect(screen.getByText(/3/i)).toBeInTheDocument()
    expect(screen.getByText(/1/i)).toBeInTheDocument()
    expect(screen.getByText(/\$1000.00/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go live/i })).toBeInTheDocument();
  })

  it('calls edit with the listing id', () => {
    const id = 12345;
    render(<ListingCard id={id} data={unlistedHome} editHandler={mockEdit} reservationHandler={mockReservation} deleteHandler={mockDelete} unpublishHandler={mockGoLive}/>)
    userEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(mockEdit).toHaveBeenCalledTimes(1);
    expect(mockEdit).toHaveBeenCalledWith(id);
  })

  it('calls reservation with the listing id', () => {
    const id = 12345;
    render(<ListingCard id={id} data={listedHome} editHandler={mockEdit} reservationHandler={mockReservation} deleteHandler={mockDelete} unpublishHandler={mockGoLive}/>)
    userEvent.click(screen.getByRole('button', { name: /view reservations/i }))
    expect(mockReservation).toHaveBeenCalledTimes(1);
    expect(mockReservation).toHaveBeenCalledWith(id);
  })

  it('calls delete with the listing id and navigate', () => {
    const id = 12345;
    render(<ListingCard id={id} data={listedHome} editHandler={mockEdit} reservationHandler={mockReservation} deleteHandler={mockDelete} unpublishHandler={mockGoLive}/>)
    userEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith(id, mockedUsedNavigate);
  })

  it('calls unpublish with the listing id', () => {
    const id = 12345;
    render(<ListingCard id={id} data={listedHome} editHandler={mockEdit} reservationHandler={mockReservation} deleteHandler={mockDelete} unpublishHandler={mockGoLive}/>)
    userEvent.click(screen.getByRole('button', { name: /unpublish/i }))
    expect(mockGoLive).toHaveBeenCalledTimes(1);
    expect(mockGoLive).toHaveBeenCalledWith(id, mockedUsedNavigate);
  })

  it('calls go live modal - no function calls', () => {
    const id = 12345;
    render(<ListingCard id={id} data={unlistedHome} editHandler={mockEdit} reservationHandler={mockReservation} deleteHandler={mockDelete} unpublishHandler={mockGoLive}/>)
    userEvent.click(screen.getByRole('button', { name: /go live/i }))
    expect(mockGoLive).toHaveBeenCalledTimes(0);
  })

  it('correctly renders ratings', () => {
    const id = 12345;
    render(<ListingCard id={id} data={unlistedHome} editHandler={mockEdit} reservationHandler={mockReservation} deleteHandler={mockDelete} unpublishHandler={mockGoLive}/>)
    expect(screen.getByText(/no reviews/i)).not.toBeInTheDocument()
    expect(screen.getByText(/4.00\/5/i)).toBeInTheDocument();
  })
})
