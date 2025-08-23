import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';
import RouteMap from '../components/RouteMap';
import { sendBookingConfirmationEmail, sendTicketEmail } from '../services/emailService';
import { formatDate, formatTime } from '../utils/dateUtils';
import { formatCurrency } from '../utils/currencyUtils';

const BookingConfirmationPage = () => {
  const { currency } = useAuthStore();
  const location = useLocation();
  const { bookingDetails } = location.state || {};
  const { t } = useTranslation();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);



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

  // Send confirmation email on component mount
  useEffect(() => {
    if (bookingDetails && !isEmailSent) {
      const sendConfirmationEmail = async () => {
        setIsSendingEmail(true);
        try {
          const result = await sendBookingConfirmationEmail(bookingDetails);
          if (result.success) {
            setIsEmailSent(true);
            toast.success(t('common.confirmationEmailSent'));
          } else {
            toast.error(t('common.emailSendFailed'));
          }
        } catch (error) {
          toast.error(t('common.emailSendFailed'));
        } finally {
          setIsSendingEmail(false);
        }
      };

      sendConfirmationEmail();
    }
  }, [bookingDetails, isEmailSent, t]);

  const handleEmailTicket = async () => {
    setIsSendingEmail(true);
    try {
      const result = await sendTicketEmail(bookingDetails);
      if (result.success) {
        toast.success(t('common.ticketEmailSent'));
      } else {
        toast.error(t('common.emailSendFailed'));
      }
    } catch (error) {
      toast.error(t('common.emailSendFailed'));
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="container slick-design py-5 mt-24">
      <h2 className="mb-4 text-center text-success">{t('common.bookingConfirmed')}</h2>
      <p className="lead text-center text-gray-700 dark:text-gray-300">{t('common.thankYouForBooking')}</p>
      <p className="text-center text-muted dark:text-gray-400">{t('common.confirmationSent', { email: bookingDetails.passengerEmail || 'your provided email' })}</p>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card mb-4 shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{t('common.tripSummary')}</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1 text-gray-700 dark:text-gray-300"><strong>{t('common.from')}:</strong> {bookingDetails.from}</p>
                  <p className="mb-1 text-gray-700 dark:text-gray-300"><strong>{t('common.to')}:</strong> {bookingDetails.to}</p>
                  <p className="mb-1 text-gray-700 dark:text-gray-300"><strong>{t('common.date')}:</strong> {formatDate(bookingDetails.date, 'full')}</p>
                  <p className="mb-1 text-gray-700 dark:text-gray-300"><strong>{t('common.departureTime')}:</strong> {formatTime(bookingDetails.departureTime)}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1 text-gray-700 dark:text-gray-300"><strong>{t('common.bookingId')}:</strong> {bookingDetails.id}</p>
                  <p className="mb-1 text-gray-700 dark:text-gray-300"><strong>{t('common.totalPrice')}:</strong> {formatCurrency(bookingDetails.price, currency)}</p>
                  <p className="mb-1 text-gray-700 dark:text-gray-300"><strong>{t('common.numberOfPassengers')}:</strong> {bookingDetails.numberOfPassengers || 1}</p>
                  <p className="mb-1 text-gray-700 dark:text-gray-300"><strong>{t('common.selectedSeats')}:</strong> {Array.isArray(bookingDetails.selectedSeats) ? bookingDetails.selectedSeats.join(', ') : bookingDetails.selectedSeat}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4 shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{t('common.passengerDetails')}</h4>
            </div>
            <div className="card-body">
              <p className="mb-1 text-gray-700 dark:text-gray-300"><strong>{t('common.name')}:</strong> {bookingDetails.passengerName}</p>
              <p className="mb-1 text-gray-700 dark:text-gray-300"><strong>{t('common.email')}:</strong> {bookingDetails.passengerEmail}</p>
            </div>
          </div>

          <div className="card mb-4 shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{t('common.yourTicketQrCode')}</h4>
            </div>
            <div className="card-body text-center">
              <QRCodeSVG value={qrCodeValue} size={256} level="H" includeMargin={true} />
              <p className="mt-2 text-muted dark:text-gray-400">{t('common.scanAtBoarding')}</p>
            </div>
          </div>

          {/* Route Map */}
          <div className="card mb-4 shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{t('common.routeMap')}</h4>
            </div>
            <div className="card-body p-0">
              <RouteMap 
                from={bookingDetails.from} 
                to={bookingDetails.to} 
                className="h-80 w-full"
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-outline-primary me-2" onClick={() => window.print()}>{t('common.printTicket')}</button>
            <button 
              className="btn btn-outline-primary me-2" 
              onClick={handleEmailTicket}
              disabled={isSendingEmail}
            >
              {isSendingEmail ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {t('common.sendingEmail')}
                </>
              ) : (
                t('common.emailTicket')
              )}
            </button>
            <Link to="/profile" className="btn btn-primary">{t('common.viewMyBookings')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
