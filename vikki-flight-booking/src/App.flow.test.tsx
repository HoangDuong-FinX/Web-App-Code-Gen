import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

// Clean up after every test to avoid cross-test contamination
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
async function flushPromises() {
  await act(async () => {
    await new Promise(r => setTimeout(r, 50));
  });
}

// ---------------------------------------------------------------
// Mount test (from scaffold App.test.tsx logic)
// ---------------------------------------------------------------
describe('App mounts', () => {
  it('renders the search screen on mount', async () => {
    render(<App />);
    await flushPromises();
    // Search title is present
    expect(screen.getByText('Tìm chuyến')).toBeTruthy();
  });
});

// ---------------------------------------------------------------
// Journey: search → results
// ---------------------------------------------------------------
describe('search → results transition', () => {
  beforeEach(() => {
    // Stub localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  });

  it('navigates to results after a successful search', async () => {
    render(<App />);
    await flushPromises(); // airports + city-pairs load

    // Select origin airport
    const originBtn = screen.getByTestId('origin-airport-button');
    fireEvent.click(originBtn);
    await flushPromises();

    // Pick SGN
    const airportBtns = screen.getAllByTestId('airport-item-button');
    fireEvent.click(airportBtns[0]); // SGN
    await flushPromises();

    // Select destination airport
    const destBtn = screen.getByTestId('destination-airport-button');
    fireEvent.click(destBtn);
    await flushPromises();

    const airportBtns2 = screen.getAllByTestId('airport-item-button');
    // Pick a different airport (index 3 = DLI)
    fireEvent.click(airportBtns2[3]);
    await flushPromises();

    // Click search
    const searchBtn = screen.getByTestId('search-button');
    await act(async () => {
      fireEvent.click(searchBtn);
      await new Promise(r => setTimeout(r, 1200)); // wait for fixture delay
    });

    // Should be on results screen
    expect(screen.getByTestId('results-title')).toBeTruthy();
    expect(screen.getByText('Chọn vé chiều đi')).toBeTruthy();
  });
});

// ---------------------------------------------------------------
// Journey: results → results-return (round-trip)
// ---------------------------------------------------------------
describe('results → results-return transition (round-trip)', () => {
  it('shows return results after selecting outbound fare', async () => {
    render(<App />);
    await flushPromises();

    // Select airports
    fireEvent.click(screen.getByTestId('origin-airport-button'));
    await flushPromises();
    fireEvent.click(screen.getAllByTestId('airport-item-button')[0]);
    await flushPromises();

    fireEvent.click(screen.getByTestId('destination-airport-button'));
    await flushPromises();
    fireEvent.click(screen.getAllByTestId('airport-item-button')[3]);
    await flushPromises();

    // Search
    await act(async () => {
      fireEvent.click(screen.getByTestId('search-button'));
      await new Promise(r => setTimeout(r, 1200));
    });

    // Select first fare on outbound
    const fareBtns = screen.getAllByTestId('select-fare-button');
    await act(async () => {
      fireEvent.click(fareBtns[0]);
      await new Promise(r => setTimeout(r, 50));
    });

    // Should be on return results
    expect(screen.getByText('Chọn vé chiều về')).toBeTruthy();
  });
});

// ---------------------------------------------------------------
// Journey: results-return → passengers
// ---------------------------------------------------------------
describe('results-return → passengers transition', () => {
  it('navigates to passengers after selecting return fare', async () => {
    render(<App />);
    await flushPromises();

    // Navigate to results
    fireEvent.click(screen.getByTestId('origin-airport-button'));
    await flushPromises();
    fireEvent.click(screen.getAllByTestId('airport-item-button')[0]);
    await flushPromises();
    fireEvent.click(screen.getByTestId('destination-airport-button'));
    await flushPromises();
    fireEvent.click(screen.getAllByTestId('airport-item-button')[3]);
    await flushPromises();

    await act(async () => {
      fireEvent.click(screen.getByTestId('search-button'));
      await new Promise(r => setTimeout(r, 1200));
    });

    // Select outbound
    await act(async () => {
      fireEvent.click(screen.getAllByTestId('select-fare-button')[0]);
      await new Promise(r => setTimeout(r, 50));
    });

    // Select return
    await act(async () => {
      fireEvent.click(screen.getAllByTestId('select-fare-button')[0]);
      await new Promise(r => setTimeout(r, 50));
    });

    expect(screen.getByText('Thông tin hành khách')).toBeTruthy();
  });
});

// ---------------------------------------------------------------
// Journey: passengers → services
// ---------------------------------------------------------------
describe('passengers → services transition', () => {
  it('navigates to services after filling passenger form', async () => {
    render(<App />);
    await flushPromises();

    // Fast-path to passengers by setting one-way trip
    fireEvent.click(screen.getByTestId('trip-type-toggle'));
    // Switch to one-way
    const oneWayBtn = screen.getByRole('tab', { name: 'Một chiều' });
    fireEvent.click(oneWayBtn);

    fireEvent.click(screen.getByTestId('origin-airport-button'));
    await flushPromises();
    fireEvent.click(screen.getAllByTestId('airport-item-button')[0]);
    await flushPromises();
    fireEvent.click(screen.getByTestId('destination-airport-button'));
    await flushPromises();
    fireEvent.click(screen.getAllByTestId('airport-item-button')[3]);
    await flushPromises();

    await act(async () => {
      fireEvent.click(screen.getByTestId('search-button'));
      await new Promise(r => setTimeout(r, 1200));
    });

    // Select first fare (one-way goes straight to passengers)
    await act(async () => {
      fireEvent.click(screen.getAllByTestId('select-fare-button')[0]);
      await new Promise(r => setTimeout(r, 50));
    });

    // Fill required fields for all passengers
    const lastNameInputs = screen.getAllByTestId('last-name-input');
    const firstNameInputs = screen.getAllByTestId('first-name-input');
    lastNameInputs.forEach(input => fireEvent.change(input, { target: { value: 'Nguyễn' } }));
    firstNameInputs.forEach(input => fireEvent.change(input, { target: { value: 'Văn A' } }));

    // Submit
    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
      await new Promise(r => setTimeout(r, 1000));
    });

    expect(screen.getByText('Dịch vụ & chọn ghế')).toBeTruthy();
  });
});

// ---------------------------------------------------------------
// Journey: services → payment
// ---------------------------------------------------------------
describe('services → payment transition', () => {
  it('navigates to payment after submitting services', async () => {
    render(<App />);
    await flushPromises();

    // Switch to one-way
    const oneWayBtn = screen.getByRole('tab', { name: 'Một chiều' });
    fireEvent.click(oneWayBtn);

    fireEvent.click(screen.getByTestId('origin-airport-button'));
    await flushPromises();
    fireEvent.click(screen.getAllByTestId('airport-item-button')[0]);
    await flushPromises();
    fireEvent.click(screen.getByTestId('destination-airport-button'));
    await flushPromises();
    fireEvent.click(screen.getAllByTestId('airport-item-button')[3]);
    await flushPromises();

    await act(async () => {
      fireEvent.click(screen.getByTestId('search-button'));
      await new Promise(r => setTimeout(r, 1200));
    });

    await act(async () => {
      fireEvent.click(screen.getAllByTestId('select-fare-button')[0]);
      await new Promise(r => setTimeout(r, 50));
    });

    const lastNameInputs = screen.getAllByTestId('last-name-input');
    const firstNameInputs = screen.getAllByTestId('first-name-input');
    lastNameInputs.forEach(input => fireEvent.change(input, { target: { value: 'Nguyễn' } }));
    firstNameInputs.forEach(input => fireEvent.change(input, { target: { value: 'Văn A' } }));

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
      await new Promise(r => setTimeout(r, 1000));
    });

    // Services screen: submit
    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
      await new Promise(r => setTimeout(r, 1200));
    });

    expect(screen.getByText('Soát lại chuyến bay')).toBeTruthy();
  });
});

// ---------------------------------------------------------------
// Journey: payment → checkout
// ---------------------------------------------------------------
describe('payment → checkout transition', () => {
  it('navigates to checkout after clicking continue on payment review', async () => {
    render(<App />);
    await flushPromises();

    const oneWayBtn = screen.getByRole('tab', { name: 'Một chiều' });
    fireEvent.click(oneWayBtn);

    fireEvent.click(screen.getByTestId('origin-airport-button'));
    await flushPromises();
    fireEvent.click(screen.getAllByTestId('airport-item-button')[0]);
    await flushPromises();
    fireEvent.click(screen.getByTestId('destination-airport-button'));
    await flushPromises();
    fireEvent.click(screen.getAllByTestId('airport-item-button')[3]);
    await flushPromises();

    await act(async () => {
      fireEvent.click(screen.getByTestId('search-button'));
      await new Promise(r => setTimeout(r, 1200));
    });

    await act(async () => {
      fireEvent.click(screen.getAllByTestId('select-fare-button')[0]);
      await new Promise(r => setTimeout(r, 50));
    });

    const lastNameInputs = screen.getAllByTestId('last-name-input');
    const firstNameInputs = screen.getAllByTestId('first-name-input');
    lastNameInputs.forEach(i => fireEvent.change(i, { target: { value: 'A' } }));
    firstNameInputs.forEach(i => fireEvent.change(i, { target: { value: 'B' } }));

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
      await new Promise(r => setTimeout(r, 1000));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
      await new Promise(r => setTimeout(r, 1200));
    });

    // Click continue on payment review
    await act(async () => {
      fireEvent.click(screen.getByTestId('continue-button'));
      await new Promise(r => setTimeout(r, 800));
    });

    expect(screen.getByText('Xác nhận trả tiền')).toBeTruthy();
  });
});

// ---------------------------------------------------------------
// Journey: checkout → done (simulated payment)
// ---------------------------------------------------------------
describe('checkout → done transition (simulated payment)', () => {
  it('navigates to done with simulated banner after paying', async () => {
    render(<App />);
    await flushPromises();

    const oneWayBtn = screen.getByRole('tab', { name: 'Một chiều' });
    fireEvent.click(oneWayBtn);

    fireEvent.click(screen.getByTestId('origin-airport-button'));
    await flushPromises();
    fireEvent.click(screen.getAllByTestId('airport-item-button')[0]);
    await flushPromises();
    fireEvent.click(screen.getByTestId('destination-airport-button'));
    await flushPromises();
    fireEvent.click(screen.getAllByTestId('airport-item-button')[3]);
    await flushPromises();

    await act(async () => {
      fireEvent.click(screen.getByTestId('search-button'));
      await new Promise(r => setTimeout(r, 1200));
    });

    await act(async () => {
      fireEvent.click(screen.getAllByTestId('select-fare-button')[0]);
      await new Promise(r => setTimeout(r, 50));
    });

    const lastNameInputs = screen.getAllByTestId('last-name-input');
    const firstNameInputs = screen.getAllByTestId('first-name-input');
    lastNameInputs.forEach(i => fireEvent.change(i, { target: { value: 'A' } }));
    firstNameInputs.forEach(i => fireEvent.change(i, { target: { value: 'B' } }));

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
      await new Promise(r => setTimeout(r, 1000));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
      await new Promise(r => setTimeout(r, 1200));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('continue-button'));
      await new Promise(r => setTimeout(r, 800));
    });

    // Wait for payment inquiry to load
    await act(async () => {
      await new Promise(r => setTimeout(r, 600));
    });

    // Pay now
    await act(async () => {
      fireEvent.click(screen.getByTestId('pay-now-button'));
      await new Promise(r => setTimeout(r, 2000));
    });

    // Should be on done screen with simulated banner
    expect(screen.getByTestId('result-status-icon')).toBeTruthy();
    expect(screen.getByTestId('simulated-payment-banner')).toBeTruthy();
    expect(screen.getByText('Chưa có khoản tiền nào được trừ')).toBeTruthy();
  });
});

// ---------------------------------------------------------------
// Journey: done → search (book another)
// ---------------------------------------------------------------
describe('done → search transition', () => {
  it('resets and returns to search after clicking book another', async () => {
    render(<App />);
    await flushPromises();

    const oneWayBtn = screen.getByRole('tab', { name: 'Một chiều' });
    fireEvent.click(oneWayBtn);

    fireEvent.click(screen.getByTestId('origin-airport-button'));
    await flushPromises();
    fireEvent.click(screen.getAllByTestId('airport-item-button')[0]);
    await flushPromises();
    fireEvent.click(screen.getByTestId('destination-airport-button'));
    await flushPromises();
    fireEvent.click(screen.getAllByTestId('airport-item-button')[3]);
    await flushPromises();

    await act(async () => {
      fireEvent.click(screen.getByTestId('search-button'));
      await new Promise(r => setTimeout(r, 1200));
    });

    await act(async () => {
      fireEvent.click(screen.getAllByTestId('select-fare-button')[0]);
      await new Promise(r => setTimeout(r, 50));
    });

    const lastNameInputs = screen.getAllByTestId('last-name-input');
    const firstNameInputs = screen.getAllByTestId('first-name-input');
    lastNameInputs.forEach(i => fireEvent.change(i, { target: { value: 'A' } }));
    firstNameInputs.forEach(i => fireEvent.change(i, { target: { value: 'B' } }));

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
      await new Promise(r => setTimeout(r, 1000));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
      await new Promise(r => setTimeout(r, 1200));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('continue-button'));
      await new Promise(r => setTimeout(r, 800));
    });

    await act(async () => {
      await new Promise(r => setTimeout(r, 600));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('pay-now-button'));
      await new Promise(r => setTimeout(r, 2000));
    });

    // Click book another
    await act(async () => {
      fireEvent.click(screen.getByTestId('book-another-button'));
      await new Promise(r => setTimeout(r, 50));
    });

    // Should be back on search
    expect(screen.getByText('Tìm chuyến')).toBeTruthy();
  });
});
