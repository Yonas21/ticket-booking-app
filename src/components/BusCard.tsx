import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useTranslation } from 'react-i18next';

const BusCard = ({ trip }) => {
  const { currency } = useAuthStore();
  const { t } = useTranslation();

  const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'ETB': return t('common.currencySymbolETB');
      default: return '$';
    }
  };

  return (
    <div className="card mb-3 shadow-sm slick-design">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-2 col-sm-12 text-center text-md-start mb-2 mb-md-0">
            <h5 className="card-title mb-0">{trip.busOperator}</h5>
            <small className="text-muted">{t('common.busService')}</small>
          </div>
          <div className="col-md-7 col-sm-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="text-center flex-grow-1 mb-2 mb-sm-0">
                <p className="mb-0 fw-bold">{trip.departureTime}</p>
                <p className="mb-0 text-muted">{trip.from}</p>
              </div>
              <div className="text-center flex-grow-1 mb-2 mb-sm-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" className="bi bi-arrow-right-circle text-primary" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                </svg>
                <p className="mb-0 text-muted"><small>{trip.duration}</small></p>
                <p className="mb-0 text-muted"><small>{trip.stops} {t('common.stops')}</small></p>
              </div>
              <div className="text-center flex-grow-1">
                <p className="mb-0 fw-bold">{trip.arrivalTime}</p>
                <p className="mb-0 text-muted">{trip.to}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 text-md-end text-center mt-2 mt-md-0">
            <h4>{getCurrencySymbol(currency)}{trip.price}</h4>
            <p className="text-muted mb-2"><small>{trip.seatsAvailable} {t('common.seatsAvailable')}</small></p>
            <Link to={`/booking/${trip.id}`} className="btn btn-primary" aria-label={t('common.bookNowForTrip', { from: trip.from, to: trip.to, time: trip.departureTime})}>
              {t('common.bookNow')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusCard;
