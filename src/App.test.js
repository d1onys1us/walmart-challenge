import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/refresh issues/i);
  expect(linkElement).toBeInTheDocument();
});

test('render pagination', () => {
  render(<App />);
  const previousElem = screen.getByText(/previous/i);
  const nextElem = screen.getByText(/next/i);
  expect(previousElem).toBeInTheDocument();
  expect(nextElem).toBeInTheDocument();
});