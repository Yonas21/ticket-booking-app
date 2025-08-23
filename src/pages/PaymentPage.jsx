import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/currencyUtils';

const PaymentPage = () => {
  const { state } = useLocation();
  const { bookingDetails } = state || {};
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currency } = useAuthStore();



  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handlePayment = (e) => {
    e.preventDefault();
    // In a real application, you would integrate with a payment gateway like Stripe or PayPal.
    // For this demo, we'll simulate a successful payment.
    toast.success(t('common.paymentSuccessful'));
    navigate('/booking-confirmation', { state: { bookingDetails } });
  };

  if (!bookingDetails) {
    return (
      <div className="container text-center">
        <h2>{t('common.bookingDetailsNotFound')}</h2>
        <p>{t('common.pleaseTryAgain')}</p>
      </div>
    );
  }

  return (
    <div className="container slick-design mt-24">
      <h2 className="text-gray-900 dark:text-white">{t('common.completeYourPayment')}</h2>
      <div className="card bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="card-body">
          <h5 className="card-title text-gray-900 dark:text-white">{t('common.bookingSummary')}</h5>
          <p className="text-gray-700 dark:text-gray-300"><strong>{t('common.trip')}:</strong> {bookingDetails.from} {t('common.to')} {bookingDetails.to}</p>
          <p className="text-gray-700 dark:text-gray-300"><strong>{t('common.date')}:</strong> {formatDate(bookingDetails.date, 'full')}</p>
          <p className="text-gray-700 dark:text-gray-300"><strong>{t('common.passengers')}:</strong> {bookingDetails.numberOfPassengers}</p>
          <p className="text-gray-700 dark:text-gray-300"><strong>{t('common.seats')}:</strong> {bookingDetails.selectedSeats.join(', ')}</p>
          <h4 className="text-gray-900 dark:text-white"><strong>{t('common.totalPrice')}:</strong> {formatCurrency(bookingDetails.price, currency)}</h4>
        </div>
      </div>

      <form onSubmit={handlePayment} className="mt-4">
        <h5 className="text-gray-900 dark:text-white">{t('common.selectPaymentMethod')}</h5>
        <div className="form-check">
          <input
            type="radio"
            id="creditCard"
            name="paymentMethod"
            value="creditCard"
            checked={paymentMethod === 'creditCard'}
            onChange={() => setPaymentMethod('creditCard')}
            className="form-check-input"
          />
          <label htmlFor="creditCard" className="form-check-label text-gray-700 dark:text-gray-300">{t('common.creditCard')}</label>
        </div>
        {/* Add other payment methods like PayPal, etc. here */}

        {paymentMethod === 'creditCard' && (
          <div className="mt-3">
            <div className="mb-3">
              <label htmlFor="cardNumber" className="form-label text-gray-700 dark:text-gray-300">{t('common.cardNumber')}</label>
              <input
                type="text"
                id="cardNumber"
                className="form-control bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                required
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="expiryDate" className="form-label text-gray-700 dark:text-gray-300">{t('common.expiryDate')}</label>
                <input
                  type="text"
                  id="expiryDate"
                  className="form-control bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="cvv" className="form-label text-gray-700 dark:text-gray-300">{t('common.cvv')}</label>
                <input
                  type="text"
                  id="cvv"
                  className="form-control bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-lg">{t('common.payNow')}</button>
      </form>
    </div>
  );
};

export default PaymentPage;