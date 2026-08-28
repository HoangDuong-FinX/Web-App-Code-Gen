import React from 'react';

interface SeatCellProps {
  seatId: string;
  state: 'available' | 'unavailable' | 'selected';
  price: number | null;
  isEmergency?: boolean;
  ariaLabel: string;
  onClick?: () => void;
}

export const SeatCell: React.FC<SeatCellProps> = ({ seatId, state, price, isEmergency = false, ariaLabel, onClick }) => {
  const getBackgroundColor = () => {
    switch (state) {
      case 'selected': return '#E31837';
      case 'unavailable': return '#e0e0e0';
      default: return isEmergency ? '#fff3e0' : '#e8f5e9';
    }
  };

  const getColor = () => {
    switch (state) {
      case 'selected': return '#fff';
      case 'unavailable': return '#999';
      default: return '#333';
    }
  };

  const isDisabled = state === 'unavailable' || (state === 'available' && price === null);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={isDisabled}
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: 6,
        border: 'none',
        backgroundColor: getBackgroundColor(),
        color: getColor(),
        fontSize: 10,
        fontWeight: 'bold',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {state === 'unavailable' ? '✕' : seatId}
    </button>
  );
};
