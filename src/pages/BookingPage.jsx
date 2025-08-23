import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { getTripById, createBooking } from '../services/api';
import SeatSelection from '../components/SeatSelection';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, Bus, Users, Tag, User, Mail } from 'lucide-react';
import { formatDate, formatTime } from '../utils/dateUtils';
import { formatCurrency, calculateTotalPrice, convertCurrency, getCurrencySymbol } from '../utils/currencyUtils';

// Mock promo codes
const mockPromoCodes = [
  { code: 'SAVE10', discount: 0.10, type: 'percentage' },
  { code: 'FLAT5', discount: 5, type: 'flat' },
];

const BookingPage = () => {
  const { id } = useParams();
  const { user, currency } = useAuthStore();
  const [trip, setTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passengerName, setPassengerName] = useState(user ? user.name : '');
  const [passengerEmail, setPassengerEmail] = useState(user ? user.email : '');
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();



  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true);
      const fetchedTrip = await getTripById(id, currency);
      setTrip(fetchedTrip);
      setLoading(false);
    };
    fetchTrip();
  }, [id, currency]);

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

  const getTotalPrice = () => {
    if (!trip) return 0;
    
    const totalCalculation = calculateTotalPrice(
      trip.originalPriceUSD,
      currency,
      numberOfPassengers,
      discountAmount
    );
    
    return totalCalculation.totalAfterDiscount;
  };

  const handleApplyPromo = () => {
    const foundPromo = mockPromoCodes.find(p => p.code === promoCode.toUpperCase());
    if (foundPromo) {
      let calculatedDiscount = 0;
      const basePrice = trip.originalPriceUSD * numberOfPassengers;

      if (foundPromo.type === 'percentage') {
        calculatedDiscount = basePrice * foundPromo.discount;
      } else if (foundPromo.type === 'flat') {
        calculatedDiscount = foundPromo.discount;
      }
      const convertedDiscount = convertCurrency(calculatedDiscount, 'USD', currency);
      setDiscountAmount(convertedDiscount);
      setPromoMessage(t('common.promoCodeApplied', { symbol: getCurrencySymbol(currency), amount: formatCurrency(convertedDiscount, currency) }));
    } else {
      setDiscountAmount(0);
      setPromoMessage(t('common.invalidPromoCode'));
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length !== numberOfPassengers) {
      toast.error(t('common.selectExactlySeats', { count: numberOfPassengers }));
      return;
    }

    // Validate guest information if user is not logged in
    if (!user) {
      if (!passengerName.trim()) {
        toast.error(t('common.enterPassengerName'));
        return;
      }
      if (!passengerEmail.trim()) {
        toast.error(t('common.enterPassengerEmail'));
        return;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(passengerEmail)) {
        toast.error(t('common.enterValidEmail'));
        return;
      }
    }

    try {
      const bookingDetails = {
        tripId: trip.id,
        from: trip.from,
        to: trip.to,
        date: trip.date,
        departureTime: trip.departureTime,
        price: getTotalPrice(),
        passengerName: user ? user.name : passengerName,
        passengerEmail: user ? user.email : passengerEmail,
        numberOfPassengers: numberOfPassengers,
        selectedSeats: selectedSeats,
      };
      navigate('/payment', { state: { bookingDetails } });
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error(t('common.bookingFailed'));
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loadingTripDetails')}</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('common.tripNotFound')}</h2>
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            {t('common.backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 mt-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/search"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              {t('common.backToSearch')}
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {t('common.bookYourSeat', { from: trip.from, to: trip.to })}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Bus size={24} />
                {t('common.tripDetails')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t('common.date')}</p>
                    <p className="font-medium">{formatDate(trip.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t('common.duration')}</p>
                    <p className="font-medium">{trip.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t('common.departure')}</p>
                    <p className="font-medium">{formatTime(trip.departureTime)} {t('common.from')} {trip.from}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t('common.arrival')}</p>
                    <p className="font-medium">{formatTime(trip.arrivalTime)} {t('common.to')} {trip.to}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bus size={20} className="text-gray-500" />
                    <span className="font-medium">{trip.busOperator}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {trip.seatsAvailable} {t('common.seatsAvailable')}
                  </div>
                </div>

                {/* Amenities */}
                {trip.amenities && trip.amenities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">{t('common.amenities')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {trip.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Intermediate Stops */}
                {trip.intermediateStops && trip.intermediateStops.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">{t('common.intermediateStops')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {trip.intermediateStops.map((stop, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {stop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Passenger Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users size={20} />
                {t('common.numberOfPassengers')}
              </h3>
              
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  {t('common.passengers')}:
                </label>
                <input
                  type="number"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max={trip.seatsAvailable}
                  value={numberOfPassengers}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setNumberOfPassengers(value > 0 ? value : 1);
                    setSelectedSeats([]);
                    setDiscountAmount(0);
                    setPromoMessage('');
                  }}
                />
              </div>
            </motion.div>

            {/* Seat Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SeatSelection
                seats={trip.seats}
                selectedSeats={selectedSeats}
                onSelectSeat={handleSelectSeat}
                takenSeats={trip.takenSeats || []}
                maxSeats={numberOfPassengers}
              />
            </motion.div>

            {/* Guest Details (if not logged in) */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={20} />
                  {t('common.guestDetails')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.yourName')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.yourEmail')}
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Promo Code */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Tag size={20} />
                {t('common.promoCode')}
              </h3>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('common.enterPromoCode')}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={handleApplyPromo}
                >
                  {t('common.apply')}
                </button>
              </div>
              
              {promoMessage && (
                <p className={`text-sm ${discountAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {promoMessage}
                </p>
              )}
            </motion.div>

            {/* Booking Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('common.bookingSummary')}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('common.basePrice')}</span>
                  <span className="font-medium">
                    {formatCurrency(trip.originalPriceUSD * numberOfPassengers, currency)}
                  </span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('common.discount')}</span>
                    <span>-{formatCurrency(discountAmount, currency)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t('common.totalPrice')}</span>
                    <span className="text-blue-600">
                      {formatCurrency(getTotalPrice(), currency)}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                className="w-full mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={handleBooking}
                disabled={selectedSeats.length !== numberOfPassengers || (!user && (!passengerName || !passengerEmail))}
              >
                {t('common.confirmBooking')} ({numberOfPassengers} {t('common.passenger')})
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
