import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { getProfile } from '../services/api';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
  const { user, setUser, currency } = useAuthStore();
  const { t } = useTranslation();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentTripToReview, setCurrentTripToReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'ETB': return 'ETB';
      default: return '$';
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        if (profileData) {
          setUser(profileData);
        } else {
          toast.error(t('common.failedToLoadProfile'));
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error(t('common.failedToLoadProfile'));
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user, setUser, t]);

  if (loading) {
    return <LoadingSpinner message="common.loadingProfile" />;
  }

  if (!user) {
    return <div className="container slick-design py-5">{t('common.loginToViewProfile')}</div>;
  }

  const now = new Date();
  const upcomingTrips = user.bookings.filter(booking => new Date(booking.date) >= now);
  const pastTrips = user.bookings.filter(booking => new Date(booking.date) < now);

  const handleSetReminder = (booking) => {
    toast.info(t('common.reminderSet', { from: booking.from, to: booking.to, date: booking.date, time: booking.departureTime }));
  };

  const handleCheckStatus = (booking) => {
    const delayChance = Math.random();
    if (delayChance < 0.3) { // 30% chance of delay
      toast.warn(t('common.tripDelayed', { from: booking.from, to: booking.to, date: booking.date }));
    } else {
      toast.success(t('common.tripOnTime', { from: booking.from, to: booking.to, date: booking.date }));
    }
  };

  const handleLeaveReview = (trip) => {
    setCurrentTripToReview(trip);
    setShowReviewForm(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!currentTripToReview) return;

    const newReview = {
      id: Date.now(),
      rating: parseInt(rating, 10),
      comment: comment,
      reviewer: user.name || user.email, // Use user's name or email as reviewer
    };

    // Simulate adding review to the trip data (in a real app, this would be an API call)
    // This part still uses mock data as there's no backend API for reviews
    toast.info(t('common.reviewSubmissionMock'));

    // Reset form and hide
    setRating(5);
    setComment('');
    setShowReviewForm(false);
    setCurrentTripToReview(null);
  };

  const renderBookingCard = (booking) => (
    <div className="card mb-3 shadow-sm" key={booking.id}>
      <div className="card-body">
        <h5 className="card-title">{booking.from} {t('common.to')} {booking.to}</h5>
        <p className="card-text"><strong>{t('common.date')}:</strong> {booking.date}</p>
        <p className="card-text"><strong>{t('common.departure')}:</strong> {booking.departureTime}</p>
        <p className="card-text"><strong>{t('common.selectedSeats')}:</strong> {Array.isArray(booking.selectedSeats) ? booking.selectedSeats.join(', ') : booking.selectedSeat}</p>
        <p className="card-text"><strong>{t('common.numberOfPassengers')}:</strong> {booking.numberOfPassengers || 1}</p>
        <p className="card-text"><strong>{t('common.totalPrice')}:</strong> {getCurrencySymbol(currency)}{booking.price}</p>
        <div className="mt-3">
          <Link
            to={'/booking-confirmation'}
            state={{ bookingDetails: booking }}
            className="btn btn-outline-primary btn-sm me-2"
          >
            {t('common.viewTicket')}
          </Link>
          <button
            className="btn btn-outline-secondary btn-sm me-2"
            onClick={() => toast.info(t('common.downloadFunctionalityMock'))}
          >
            {t('common.downloadTicket')}
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => toast.info(t('common.cancelFunctionalityMock'))}
          >
            {t('common.cancelTicket')}
          </button>
          {new Date(booking.date) >= now && (
            <>
              <button
                className="btn btn-outline-info btn-sm ms-2"
                onClick={() => handleSetReminder(booking)}
              >
                {t('common.setReminder')}
              </button>
              <button
                className="btn btn-outline-dark btn-sm ms-2"
                onClick={() => handleCheckStatus(booking)}
              >
                {t('common.checkStatus')}
              </button>
            </>
          )}
          {new Date(booking.date) < now && !booking.reviewed && (
            <button
              className="btn btn-primary btn-sm ms-2"
              onClick={() => handleLeaveReview(booking)}
            >
              {t('common.leaveAReview')}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container slick-design py-5">
      <h2 className="mb-4">{t('common.myProfile')}</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{t('common.userInformation')}</h5>
          <p><strong>{t('common.name')}:</strong> {user.name}</p>
          <p><strong>{t('common.email')}:</strong> {user.email}</p>
        </div>
      </div>

      <h3 className="mb-4">{t('common.upcomingTrips')}</h3>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          {upcomingTrips.length > 0 ? (
            upcomingTrips.map(renderBookingCard)
          ) : (
            <p>{t('common.noUpcomingTrips')}</p>
          )}
        </div>
      </div>

      <h3 className="mb-4 mt-5">{t('common.pastTrips')}</h3>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          {pastTrips.length > 0 ? (
            pastTrips.map(renderBookingCard)
          ) : (
            <p>{t('common.noPastTrips')}</p>
          )}
        </div>
      </div>

      {showReviewForm && currentTripToReview && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">{t('common.leaveAReviewFor', { from: currentTripToReview.from, to: currentTripToReview.to })}</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label htmlFor="rating" className="form-label">{t('common.rating1to5')}</label>
                <input
                  type="number"
                  className="form-control"
                  id="rating"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="comment" className="form-label">{t('common.comment')}:</label>
                <textarea
                  className="form-control"
                  id="comment"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary me-2">{t('common.submitReview')}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowReviewForm(false)}>{t('common.cancel')}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
