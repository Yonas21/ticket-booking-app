import React from 'react';
import { useTranslation } from 'react-i18next';

const SeatSelection = ({ seats, selectedSeats, onSelectSeat, takenSeats = [] }) => {
  const { t } = useTranslation();

  return (
    <div className="seat-selection-grid mb-4">
      {seats.map((seat) => {
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
            disabled={isDisabled} // Disable if taken
            title={ariaLabel} // Tooltip
          >
            {seat}
          </button>
        );
      })}
    </div>
  );
};

export default SeatSelection;
