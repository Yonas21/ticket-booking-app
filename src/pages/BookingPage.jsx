import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { getTripById } from '../services/api';
import SeatSelection from '../components/SeatSelection';
import { useTranslation } from 'react-i18next';

// Mock promo codes
const mockPromoCodes = [
  { code: 'SAVE10', discount: 0.10, type: 'percentage' }, // 10% off
  { code: 'FLAT5', discount: 5, type: 'flat' }, // $5 off
];

const BookingPage = () => {
  const { id } = useParams();
  const { user, addBooking, currency } = useAuthStore(); // Get currency from store
  const [trip, setTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true);
      // Pass currency to getTripById
      const fetchedTrip = await getTripById(id, currency);
      setTrip(fetchedTrip);
      setLoading(false);
    };
    fetchTrip();
  }, [id, currency]); // Re-fetch trip if currency changes

  const handleSelectSeat = (seat) => {
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seat)) {
        return prevSelectedSeats.filter((s) => s !== seat);
      } else if (prevSelectedSeats.length < numberOfPassengers) {
        return [...prevSelectedSeats, seat];
      } else {
        const newSeats = [...prevSelectedSeats.slice(1), seat];
        return newSeats;
      }
    });
  };

  const calculateTotalPrice = () => {
    let basePrice = trip ? trip.price * numberOfPassengers : 0;
    let finalPrice = basePrice - discountAmount;
    return Math.max(0, finalPrice).toFixed(2);
  };

  const handleApplyPromo = () => {
    const foundPromo = mockPromoCodes.find(p => p.code === promoCode.toUpperCase());
    if (foundPromo) {
      let calculatedDiscount = 0;
      const basePrice = trip.originalPriceUSD * numberOfPassengers; // Use original USD price for discount calculation

      if (foundPromo.type === 'percentage') {
        calculatedDiscount = basePrice * foundPromo.discount;
      } else if (foundPromo.type === 'flat') {
        calculatedDiscount = foundPromo.discount;
      }
      // Convert calculated discount back to current currency for display
      setDiscountAmount(parseFloat((calculatedDiscount * (currency === 'USD' ? 1 : (currency === 'EUR' ? 0.92 : 0.79))).toFixed(2)));
      setPromoMessage(t('common.promoCodeApplied', { symbol: getCurrencySymbol(currency), amount: calculatedDiscount.toFixed(2) }));
    } else {
      setDiscountAmount(0);
      setPromoMessage(t('common.invalidPromoCode'));
    }
  };

  const handleBooking = () => {
    if (selectedSeats.length !== numberOfPassengers) {
      alert(t('common.selectExactlySeats', { count: numberOfPassengers }));
      return;
    }

    let currentPassengerName = user ? user.name : passengerName;
    let currentPassengerEmail = user ? user.email : passengerEmail;

    if (!user && (!currentPassengerName || !currentPassengerEmail)) {
      alert(t('common.enterNameEmail'));
      return;
    }

    const bookingDetails = {
      id: Date.now(),
      tripId: trip.id,
      from: trip.from,
      to: trip.to,
      date: trip.date,
      departureTime: trip.departureTime,
      selectedSeats: selectedSeats,
      price: calculateTotalPrice(), // Use calculated price
      basePrice: trip.originalPriceUSD * numberOfPassengers, // Store original price
      discountApplied: discountAmount, // Store discount amount
      promoCodeUsed: promoCode.toUpperCase(), // Store promo code used
      passengerName: currentPassengerName,
      passengerEmail: currentPassengerEmail,
      numberOfPassengers: numberOfPassengers,
      currency: currency, // Store currency used for booking
    };

    if (user) {
      addBooking(bookingDetails);
    }
    
    navigate('/booking-confirmation', { state: { bookingDetails } });
  };

  if (loading) {
    return (
      <div className="custom-loader">
        <div className="spinner"></div>
        <p>{t('common.loadingTripDetails')}</p>
      </div>
    );
  }

  if (!trip) {
    return <div className="container text-center">{t('common.tripNotFound')}</div>;
  }

  return (
    <div className="container slick-design">
      <h2 className="mb-4">{t('common.bookYourSeat', { from: trip.from, to: trip.to })}</h2>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{t('common.tripDetails')}</h5>
          <p><strong>{t('common.date')}:</strong> {trip.date}</p>
          <p><strong>{t('common.departure')}:</strong> {trip.departureTime} {t('common.from')} {trip.from}</p>
          <p><strong>{t('common.arrival')}:</strong> {trip.arrivalTime} {t('common.to')} {trip.to}</p>
          <p><strong>{t('common.busOperator')}:</strong> {trip.busOperator}</p>
          <p><strong>{t('common.duration')}:</strong> {trip.duration}</p>
          <p><strong>{t('common.basePrice')}:</strong> {getCurrencySymbol(currency)}{trip.originalPriceUSD * numberOfPassengers}</p>
          {discountAmount > 0 && <p className="text-success"><strong>{t('common.discount')}:</strong> -{getCurrencySymbol(currency)}{discountAmount.toFixed(2)}</p>}
          <h4><strong>{t('common.totalPrice')}:</strong> {getCurrencySymbol(currency)}{calculateTotalPrice()}</h4>

          {trip.amenities && trip.amenities.length > 0 && (
            <div className="mt-3">
              <h6>{t('common.amenities')}:</h6>
              <ul className="list-unstyled">
                {trip.amenities.map((amenity, index) => (
                  <li key={index}><i className="bi bi-check-circle-fill text-success me-2"></i>{amenity}</li>
                ))}
              </ul>
            </div>
          )}

          {trip.intermediateStops && trip.intermediateStops.length > 0 && (
            <div className="mt-3">
              <h6>{t('common.intermediateStops')}:</h6>
              <ul className="list-unstyled">
                {trip.intermediateStops.map((stop, index) => (
                  <li key={index}><i className="bi bi-geo-alt-fill text-info me-2"></i>{stop}</li>
                ))}
              </ul>
            </div>
          )}

          {trip.reviews && trip.reviews.length > 0 && (
            <div className="mt-3">
              <h6>{t('common.reviews')}:</h6>
              {trip.reviews.map(review => (
                <div key={review.id} className="mb-2 p-2 border rounded">
                  <p className="mb-0"><strong>{t('common.rating')}:</strong> {review.rating} / 5</p>
                  <p className="mb-0"><strong>{t('common.comment')}:</strong> {review.comment}</p>
                  <p className="mb-0 text-muted"><small>{t('common.by')} {review.reviewer}</small></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="numberOfPassengers" className="form-label">{t('common.numberOfPassengers')}</label>
        <input
          type="number"
          className="form-control"
          id="numberOfPassengers"
          min="1"
          max={trip.seatsAvailable} // Max passengers based on available seats
          value={numberOfPassengers}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            setNumberOfPassengers(value > 0 ? value : 1);
            setSelectedSeats([]); // Clear selected seats when passenger count changes
            setDiscountAmount(0); // Reset discount on passenger change
            setPromoMessage('');
          }}
        />
      </div>

      <h3 className="mb-3">{t('common.selectYourSeats')}</h3>
      <SeatSelection
        seats={trip.seats}
        selectedSeats={selectedSeats}
        onSelectSeat={handleSelectSeat}
        takenSeats={trip.takenSeats}
      />

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{t('common.promoCode')}</h5>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder={t('common.enterPromoCode')}
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button className="btn btn-outline-primary" type="button" onClick={handleApplyPromo}>{t('common.apply')}</button>
          </div>
          {promoMessage && (
            <p className={discountAmount > 0 ? 'text-success' : 'text-danger'}>{promoMessage}</p>
          )}
        </div>
      </div>

      {!user && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{t('common.guestDetails')}</h5>
            <div className="mb-3">
              <label htmlFor="passengerName" className="form-label">{t('common.yourName')}</label>
              <input
                type="text"
                className="form-control"
                id="passengerName"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="passengerEmail" className="form-label">{t('common.yourEmail')}</label>
              <input
                type="email"
                className="form-control"
                id="passengerEmail"
                value={passengerEmail}
                onChange={(e) => setPassengerEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      )}

      <button
        className="btn btn-primary btn-lg"
        onClick={handleBooking}
        disabled={selectedSeats.length !== numberOfPassengers || (!user && (!passengerName || !passengerEmail))}
      >
        {t('common.confirmBooking')} ({numberOfPassengers} {t('common.passenger', { count: numberOfPassengers })})
      </button>

      <Link to="/search" className="btn btn-secondary mt-3 ms-2">{t('common.backToSearch')}</Link>
    </div>
  );
};

export default BookingPage;
