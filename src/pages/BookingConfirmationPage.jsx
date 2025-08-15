import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const { bookingDetails } = location.state || {};
  const { t } = useTranslation();

  if (!bookingDetails) {
    return (
      <div className="container slick-design py-5 text-center">
        <h2 className="mb-4">{t('common.bookingDetailsNotFound')}</h2>
        <p>{t('common.issueRetrievingBooking')}</p>
        <Link to="/" className="btn btn-primary mt-3">{t('common.goToHome')}</Link>
      </div>
    );
  }

  const qrCodeValue = `https://mock-ticket-validation.com/ticket/${bookingDetails.id}`;

  return (
    <div className="container slick-design py-5">
      <h2 className="mb-4 text-center text-success">{t('common.bookingConfirmed')}</h2>
      <p className="lead text-center">{t('common.thankYouForBooking')}</p>
      <p className="text-center text-muted">{t('common.confirmationSent', { email: bookingDetails.passengerEmail || 'your provided email' })}</p>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{t('common.tripSummary')}</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1"><strong>{t('common.from')}:</strong> {bookingDetails.from}</p>
                  <p className="mb-1"><strong>{t('common.to')}:</strong> {bookingDetails.to}</p>
                  <p className="mb-1"><strong>{t('common.date')}:</strong> {bookingDetails.date}</p>
                  <p className="mb-1"><strong>{t('common.departureTime')}:</strong> {bookingDetails.departureTime}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>{t('common.bookingId')}:</strong> {bookingDetails.id}</p>
                  <p className="mb-1"><strong>{t('common.totalPrice')}:</strong> ${bookingDetails.price}</p>
                  <p className="mb-1"><strong>{t('common.numberOfPassengers')}:</strong> {bookingDetails.numberOfPassengers || 1}</p>
                  <p className="mb-1"><strong>{t('common.selectedSeats')}:</strong> {Array.isArray(bookingDetails.selectedSeats) ? bookingDetails.selectedSeats.join(', ') : bookingDetails.selectedSeat}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{t('common.passengerDetails')}</h4>
            </div>
            <div className="card-body">
              <p className="mb-1"><strong>{t('common.name')}:</strong> {bookingDetails.passengerName}</p>
              <p className="mb-1"><strong>{t('common.email')}:</strong> {bookingDetails.passengerEmail}</p>
            </div>
          </div>

          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{t('common.yourTicketQrCode')}</h4>
            </div>
            <div className="card-body text-center">
              <QRCodeSVG value={qrCodeValue} size={256} level="H" includeMargin={true} />
              <p className="mt-2 text-muted">{t('common.scanAtBoarding')}</p>
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-outline-primary me-2" onClick={() => window.print()}>{t('common.printTicket')}</button>
            <button className="btn btn-outline-primary me-2">{t('common.emailTicket')}</button>
            <Link to="/profile" className="btn btn-primary">{t('common.viewMyBookings')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
