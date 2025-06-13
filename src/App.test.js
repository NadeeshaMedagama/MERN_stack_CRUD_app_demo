import { render, screen } from '@testing-library/react';
import App from './App';
import * as test from "node:test";

test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Item Manager/i);
  expect(titleElement).toBeInTheDocument();
});
