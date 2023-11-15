import React from 'react';
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react';
import { Login } from './components/login';

// mocked useNavigate();
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const noop = () => {};

describe('<Login>', () => {
  it('renders the title, email field, password field and login button', () => {
    render(<Login onSubmit={noop}/>)
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /welcome to airbnb/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('renders the email and password inputs as required fields', () => {
    render(<Login onSubmit={noop}/>)
    expect(screen.getByRole('textbox', { name: /email/i })).toBeRequired()
    expect(screen.getByLabelText(/password/i)).toBeRequired()
  })

  it('renders the email and password inputs as invalid', () => {
    render(<Login onSubmit={noop}/>)
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInvalid()
    expect(screen.getByLabelText(/password/i)).toBeInvalid()
  })

  it('renders the email and password inputs as valid if there are no errors', () => {
    const inputs = {
      email: 'example@email.com',
      password: 'a password',
    }

    render(<Login onSubmit={noop}/>)

    userEvent.type(screen.getByRole('textbox', { name: /email/i }), inputs.email)
    userEvent.type(screen.getByLabelText(/password/i), inputs.password)

    expect(screen.getByRole('textbox', { name: /email/i })).toBeValid()
    expect(screen.getByLabelText(/password/i)).toBeValid()
  })

  it('calls onSubmit with the values of the inputs', () => {
    const inputs = {
      email: 'example@email.com',
      password: 'a password',
    }

    const mockOnSubmit = jest.fn()
    render(<Login onSubmit={mockOnSubmit} />)
    userEvent.type(screen.getByRole('textbox', { name: /email/i }), inputs.email)
    userEvent.type(screen.getByLabelText(/password/i), inputs.password)
    userEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  })
})
