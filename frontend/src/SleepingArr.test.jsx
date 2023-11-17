import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { BedroomLayout, BasicFeatures, Buttons, RoundButton } from './components/listing-info-fragments';
import { shallow, configure } from 'enzyme'

configure({ adapter: new Adapter() });
jest.mock('@mui/x-charts', () => jest.fn());
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const setSingle = jest.fn();
const setDouble = jest.fn();
const setQueen = jest.fn();
const setKing = jest.fn();
const setSofaBed = jest.fn();

const oneBedroom = {
  num: 1,
  single: 0,
  double: 0,
  queen: 0,
  king: 0,
  sofaBed: 0,
  setSingle,
  setDouble,
  setQueen,
  setKing,
  setSofaBed
}

const oneBedroomExtended = {
  num: 5,
  single: 1,
  double: 3,
  queen: 2,
  king: 1,
  sofaBed: 0,
  setSingle,
  setDouble,
  setQueen,
  setKing,
  setSofaBed
}

describe('<Listing card>', () => {
  it('renders single, double, queen, king, sofa beds - empty', () => {
    render(<BedroomLayout num={oneBedroom.num} single={oneBedroom.single}
      double={oneBedroom.double} queen={oneBedroom.queen} king={oneBedroom.king}
      sofaBed={oneBedroom.sofaBed} setSingle={oneBedroom.setSingle}
      setDouble={oneBedroom.setDouble} setQueen={oneBedroom.setQueen}
      setKing={oneBedroom.setKing}setSofaBed={oneBedroom.setSofaBed}/>)
    expect(screen.getByText(/bedroom 1/i)).toBeInTheDocument()
    expect(screen.getByText(/single/i)).toBeInTheDocument()
    expect(screen.getByText(/double/i)).toBeInTheDocument()
    expect(screen.getByText(/queen/i)).toBeInTheDocument()
    expect(screen.getByText(/king/i)).toBeInTheDocument()
    expect(screen.getByText(/sofa bed/i)).toBeInTheDocument()
    expect(screen.getAllByText(/0/i)).toHaveLength(5)
  })

  it('renders single, double, queen, king, sofa beds - multiple beds', () => {
    render(<BedroomLayout num={oneBedroomExtended.num} single={oneBedroomExtended.single}
      double={oneBedroomExtended.double} queen={oneBedroomExtended.queen} king={oneBedroomExtended.king}
      sofaBed={oneBedroomExtended.sofaBed} setSingle={oneBedroomExtended.setSingle}
      setDouble={oneBedroomExtended.setDouble} setQueen={oneBedroomExtended.setQueen}
      setKing={oneBedroomExtended.setKing}setSofaBed={oneBedroomExtended.setSofaBed}/>)
    expect(screen.getByText(/bedroom 5/i)).toBeInTheDocument()
    expect(screen.getAllByText(/0/i)).toHaveLength(1)
    expect(screen.getAllByText(/1/i)).toHaveLength(2)
    expect(screen.getAllByText(/2/i)).toHaveLength(1)
    expect(screen.getAllByText(/3/i)).toHaveLength(1)
  })
})

describe('<BasicFeatures>', () => {
  const up = jest.fn();
  const down = jest.fn();
  it('Renders title, number and buttons', () => {
    const title = 'Single';
    const num = 1;
    render(<BasicFeatures title={title} feature={num} setFeature={setSingle} minSize={0}/>)
    expect(screen.getByText(/single/i)).toBeInTheDocument()
    expect(screen.getByText(/1/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /-/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /\+/i })).toBeInTheDocument()
  })

  it('can click on + button', async () => {
    const title = 'Single';
    const num = 1;
    render(<BasicFeatures title={title} feature={num} setFeature={setSingle} minSize={0} upHandler={up} downHandler={down}/>)
    userEvent.click(screen.getByRole('button', { name: /\+/i }))
    expect(up).toHaveBeenCalledTimes(1);
  })

  it('can click on - button', () => {
    const title = 'Single';
    const num = 2;
    render(<BasicFeatures title={title} feature={num} setFeature={setSingle} minSize={0} upHandler={up} downHandler={down}/>)
    userEvent.click(screen.getByRole('button', { name: /-/i }))
    expect(down).toHaveBeenCalledTimes(1);
  })

  it('- button is disabled at minimum', () => {
    const num = 0;
    const wrapper = shallow(<Buttons feature={num} setFeature={setSingle} minSize={0} upHandler={up} downHandler={down}/>)
    expect(wrapper.find(RoundButton)).toHaveLength(2)
    expect(wrapper.find(RoundButton).get(0).props.disabled).toBe(true)
  })

  it('- button is not disabled above minimum', () => {
    const num = 1;
    const wrapper = shallow(<Buttons feature={num} setFeature={setSingle} minSize={0} upHandler={up} downHandler={down}/>)
    expect(wrapper.find(RoundButton)).toHaveLength(2)
    expect(wrapper.find(RoundButton).get(0).props.disabled).toBe(false)
  })
})
