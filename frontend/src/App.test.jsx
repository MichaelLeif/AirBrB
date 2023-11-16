// This file can be deleted if you'd like
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateReviewButton, ReviewPopUp, ReviewBox, CreateReviewBox } from './pages/Listing';

describe('Component 1: ReviewBox', () => {
  // simplified data for the component to display
  const data = [
    {
      name: 'test1',
      rating: 5,
      description: 'test1 review works'
    },
    {
      name: 'test2',
      rating: 1,
      description: 'test2 review works'
    }
  ]
  it('see if reviews are populated properly', () => {
    // create the component and populate it with review boxes
    render(
      <ReviewBox
        Populate={() => {
          return data.map((rating) => {
            return <CreateReviewBox key={rating.rating} prop={rating} mobileResponsive={false} />
          })
        }}
      />
    )
    // testing to see if the review boxes appear
    expect(screen.getByText('test1 review works')).toBeInTheDocument();
    expect(screen.getByText('test2 review works')).toBeInTheDocument();
  })
});

describe('Component 2: Review Button', () => {
  it('triggers onClick event handler when clicked', () => {
    // used to check if it has been clicked
    const onClick = jest.fn();
    // rendering the component
    render(<CreateReviewButton onClick={onClick} mobileResponsive={false} />);
    // simulate click
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toBeCalledTimes(1);
  });
  it('triggers a state change when it is clicked', () => {
    let bool = false;
    // render the component and see if the bool changes after a click
    render(
      <CreateReviewButton
        onClick={() => {
          bool = true
        }}
      />
    )
    fireEvent.click(screen.getByRole('button'));
    expect(bool).toBe(true);
  })
  it('changes size of button when it is on mobile', () => {
    const onClick = jest.fn();
    render(<CreateReviewButton onClick={onClick} mobileResponsive={true} />);
    // checks to see if mobile responsive button works
    expect(screen.getByRole('button')).toHaveStyle('width: 100px');
  });
});

describe('Component 3: Review Form', () => {
  it('see if review pop up opens when review button is clicked', () => {
    let open = false;
    const { rerender } = render(
      <ReviewPopUp
      review={open}
      />
    )
    expect(open).toBe(false);
    // checks to see if an element that is only rendered by the form appears
    expect(screen.queryByRole('presentation')).toBeNull();
    // rerenders with the form component
    rerender(
      <CreateReviewButton
        onClick={() => {
          open = true;
        }}
      />
    )
    fireEvent.click(screen.getByRole('button'));
    expect(open).toBe(true);
    // rerenders to see if the click causes the form to open
    rerender(
      <ReviewPopUp
        review={open}
      />
    )

    // checks to see if the element is present
    expect(screen.getByRole('presentation')).not.toBeNull();
  });
  it('see if review pop up closes when review close button is clicked', () => {
    let open = true;
    const onClose = jest.fn();
    const { rerender } = render(
      <ReviewPopUp
      review={open}
      />
    )
    expect(screen.getByRole('presentation')).not.toBeNull();
    rerender(
      <ReviewPopUp
      review={open}
      onClose={() => {
        onClose();
        open = false;
      }}
      />
    )
    expect(screen.getByRole('presentation')).not.toBeNull();
    // clicks the close button
    fireEvent.click(screen.getByRole('close'));
    expect(open).toBe(false);
    rerender(
      <ReviewPopUp
      review={open}
      />
    )
    // checks to see if the form closed
    expect(screen.queryByRole('presentation')).toBeNull();
  });
  it('see if it submits and closes the form', () => {
    let input = 'has not submitted';
    let open = true;
    const onSubmit = jest.fn();
    const { rerender } = render(
      <ReviewPopUp
      review={open}
      />
    )
    expect(screen.getByRole('presentation')).not.toBeNull();
    rerender(
      <ReviewPopUp
      review={open}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
        open = false
        input = 'has been submitted';
      }}
      />
    )
    expect(screen.getByRole('presentation')).not.toBeNull();
    fireEvent.click(screen.getByRole('button'));
    expect(open).toBe(false);
    rerender(
      <ReviewPopUp
      review={open}
      />
    )
    expect(input).toBe('has been submitted');
    expect(screen.queryByRole('presentation')).toBeNull();
  })
})
