import { render, screen } from '@testing-library/react';
import App from './App';

test('renders block number', () => {
  render(<App />);
  const blockNumberElement = screen.getByText(/Block Number:/i);
  expect(blockNumberElement).toBeInTheDocument();
});
