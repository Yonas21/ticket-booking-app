import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Car, User, Check } from 'lucide-react';

const SeatSelection = ({ seats, selectedSeats, onSelectSeat, takenSeats = [], maxSeats = 1 }) => {
  const { t } = useTranslation();

  const renderSeats = () => {
    const rows = [];
    for (let i = 0; i < seats.length; i += 4) {
      rows.push(seats.slice(i, i + 4));
    }

    return rows.map((row, rowIndex) => (
      <motion.div
        key={rowIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rowIndex * 0.1 }}
        className="flex justify-center mb-3"
      >
        {row.slice(0, 2).map(seat => renderSeat(seat))}
        <div className="w-8 h-12 mx-2 flex items-center justify-center">
          <div className="w-1 h-8 bg-gray-300 rounded-full"></div>
        </div>
        {row.slice(2, 4).map(seat => renderSeat(seat))}
      </motion.div>
    ));
  };

  const renderSeat = (seat) => {
    const isSelected = selectedSeats.includes(seat);
    const isTaken = takenSeats.includes(seat);
    const canSelect = selectedSeats.length < maxSeats || isSelected;

    let seatClass = 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
    let ariaLabel = t('common.seatAvailable', { seat });
    let isDisabled = false;

    if (isSelected) {
      seatClass = 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600';
      ariaLabel = t('common.seatSelected', { seat });
    } else if (isTaken) {
      seatClass = 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed';
      ariaLabel = t('common.seatUnavailable', { seat });
      isDisabled = true;
    } else if (!canSelect) {
      seatClass = 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed';
      isDisabled = true;
    }

    return (
      <motion.button
        key={seat}
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        className={`w-12 h-12 mx-1 border-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center ${seatClass}`}
        onClick={() => !isDisabled && onSelectSeat(seat)}
        disabled={isDisabled}
        title={ariaLabel}
        aria-pressed={isSelected}
      >
        {isSelected && <Check size={16} />}
        {!isSelected && seat}
      </motion.button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {t('common.selectYourSeats')}
        </h3>
        <p className="text-sm text-gray-600">
          {t('common.selectExactlySeats', { count: maxSeats })}
        </p>
      </div>

      {/* Driver Area */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-center">
          <Car size={24} className="text-gray-500 mr-2" />
          <span className="text-sm font-medium text-gray-600">{t('common.driver')}</span>
        </div>
      </div>

      {/* Bus Layout */}
      <div className="relative">
        {/* Seat Grid */}
        <div className="mb-6">
          {renderSeats()}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
            <span className="text-gray-600">{t('common.available')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 border-2 border-blue-500 rounded flex items-center justify-center">
              <Check size={12} className="text-white" />
            </div>
            <span className="text-gray-600">{t('common.selected')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 border-2 border-gray-300 rounded"></div>
            <span className="text-gray-600">{t('common.unavailable')}</span>
          </div>
        </div>

        {/* Selected Seats Summary */}
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <p className="text-sm text-blue-700">
              <strong>{t('common.selectedSeats')}:</strong> {selectedSeats.join(', ')}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;
