import React from 'react';
import { useTranslation } from 'react-i18next';
import './SeatSelection.css';

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

    let seatClass = 'available';
    let ariaLabel = t('common.seatAvailable', { seat });
    let isDisabled = false;

    if (isSelected) {
      seatClass = 'selected';
      ariaLabel = t('common.seatSelected', { seat });
    } else if (isTaken) {
      seatClass = 'taken';
      ariaLabel = t('common.seatUnavailable', { seat });
      isDisabled = true;
    }

    return (
      <div
        key={seat}
        className={`seat ${seatClass}`}
        onClick={() => !isDisabled && onSelectSeat(seat)}
        aria-pressed={isSelected}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        title={ariaLabel}
      >
        {seat}
      </div>
    );
  };

  return (
    <div className="bus-layout mb-4">
      <div className="driver-cabin">{t('common.driver')}</div>
      {renderSeats()}
      <div className="legend">
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>{t('common.available')}</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>{t('common.selected')}</span>
        </div>
        <div className="legend-item">
          <div className="legend-color taken"></div>
          <span>{t('common.taken')}</span>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
