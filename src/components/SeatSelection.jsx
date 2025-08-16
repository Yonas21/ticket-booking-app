import React from 'react';
import { useTranslation } from 'react-i18next';

const SeatSelection = ({ seats, selectedSeats, onSelectSeat, takenSeats = [] }) => {
  const { t } = useTranslation();

  const renderSeats = () => {
    const rows = [];
    for (let i = 0; i < seats.length; i += 4) {
      rows.push(seats.slice(i, i + 4));
    }

    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="d-flex justify-content-center mb-2">
        {row.slice(0, 2).map(seat => renderSeat(seat))}
        <div className="aisle"></div>
        {row.slice(2, 4).map(seat => renderSeat(seat))}
      </div>
    ));
  };

  const renderSeat = (seat) => {
    const isSelected = selectedSeats.includes(seat);
    const isTaken = takenSeats.includes(seat);

    let seatClass = 'btn-outline-primary';
    let ariaLabel = t('common.seatAvailable', { seat });
    let isDisabled = false;

    if (isSelected) {
      seatClass = 'btn-primary active';
      ariaLabel = t('common.seatSelected', { seat });
    } else if (isTaken) {
      seatClass = 'btn-secondary disabled';
      ariaLabel = t('common.seatUnavailable', { seat });
      isDisabled = true;
    }

    return (
      <button
        key={seat}
        className={`btn m-1 ${seatClass}`}
        onClick={() => onSelectSeat(seat)}
        aria-pressed={isSelected}
        disabled={isDisabled}
        title={ariaLabel}
      >
        {seat}
      </button>
    );
  };

  return (
    <div className="bus-layout mb-4">
      <div className="driver-cabin">{t('common.driver')}</div>
      {renderSeats()}
    </div>
  );
};

export default SeatSelection;
