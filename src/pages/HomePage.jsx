import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, ArrowRight, Bus, Star, Clock, Users } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import trips from '../data/trips.json';
import useAuthStore from '../store/authStore';
import BusCard from '../components/BusCard';
import { useTranslation } from 'react-i18next';
import { ethiopianLocations, popularRoutes } from '../data/locations';
import RouteMap from '../components/RouteMap';

const locations = [...new Set(trips.flatMap(trip => [trip.from, trip.to]))];

const HomePage = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [from, setFrom] = useState(locations[0] || '');
  const [to, setTo] = useState(locations[1] || '');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const formattedDepartureDate = departureDate.toISOString().split('T')[0];
    const queryParams = {
      from,
      to,
      departureDate: formattedDepartureDate,
    };

    if (isRoundTrip && returnDate) {
      queryParams.returnDate = returnDate.toISOString().split('T')[0];
    }

    const query = new URLSearchParams(queryParams).toString();
    navigate(`/search?${query}`);
    setIsLoading(false);
  };

  const handlePopularRouteClick = (from, to) => {
    setFrom(from);
    setTo(to);
  };

  const personalizedRecommendations = user && user.preferredLocations && user.preferredLocations.length > 0
    ? trips.filter(trip => user.preferredLocations.includes(trip.from))
    : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="grid lg:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Content */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="space-y-4">
                <motion.h1 
                  className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {t('common.bookYourBusTicket')}
                </motion.h1>
                <motion.p 
                  className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {t('common.travelWithComfort')}
                </motion.p>
              </div>

              {/* Features */}
              <motion.div 
                className="grid grid-cols-2 gap-4"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Bus className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Modern Buses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Star className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Best Prices</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Safe Travel</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Search Form */}
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              <div className="card-modern p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {t('common.findYourTrip')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('common.searchDescription')}
                    </p>
                  </div>

                  <form onSubmit={handleSearch} className="space-y-4">
                    {/* From Location */}
                    <div>
                      <label className="form-label-modern">
                        <MapPin className="inline w-4 h-4 mr-2" />
                        {t('common.from')}
                      </label>
                      <select
                        className="input-modern"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        required
                      >
                        <option value="">{t('common.selectDepartureLocation')}</option>
                        {ethiopianLocations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    {/* To Location */}
                    <div>
                      <label className="form-label-modern">
                        <MapPin className="inline w-4 h-4 mr-2" />
                        {t('common.to')}
                      </label>
                      <select
                        className="input-modern"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        required
                      >
                        <option value="">{t('common.selectArrivalLocation')}</option>
                        {ethiopianLocations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    {/* Departure Date */}
                    <div>
                      <label className="form-label-modern">
                        <Calendar className="inline w-4 h-4 mr-2" />
                        {t('common.departureDate')}
                      </label>
                      <DatePicker
                        selected={departureDate}
                        onChange={(date) => setDepartureDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="input-modern"
                        minDate={new Date()}
                        required
                      />
                    </div>

                    {/* Round Trip Toggle */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="roundTripCheck"
                        checked={isRoundTrip}
                        onChange={(e) => setIsRoundTrip(e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="roundTripCheck" className="text-sm font-medium text-gray-700">
                        {t('common.roundTrip')}
                      </label>
                    </div>

                    {/* Return Date */}
                    {isRoundTrip && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="form-label-modern">
                          <Calendar className="inline w-4 h-4 mr-2" />
                          {t('common.returnDate')}
                        </label>
                        <DatePicker
                          selected={returnDate}
                          onChange={(date) => setReturnDate(date)}
                          dateFormat="yyyy-MM-dd"
                          className="input-modern"
                          minDate={departureDate}
                          required
                        />
                      </motion.div>
                    )}

                    {/* Search Button */}
                    <motion.button
                      type="submit"
                      className="w-full btn-primary-modern flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          <span>{t('common.searchBuses')}</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Personalized Recommendations */}
      {user && personalizedRecommendations.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('common.personalizedRecommendations')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('common.basedOnYourPreferences')}
              </p>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {personalizedRecommendations.map((trip, index) => (
                <motion.div key={trip.id} variants={itemVariants}>
                  <BusCard trip={trip} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Popular Routes */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('common.popularRoutes')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('common.discoverMostPopularRoutes')}
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {popularRoutes.map((route, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card-modern p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Bus className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {route.from} → {route.to}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {t('common.findBestDeals')}
                    </p>
                    <motion.button
                      onClick={() => handlePopularRouteClick(route.from, route.to)}
                      className="btn-primary-modern flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>{t('common.viewDeals')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Popular Routes Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('common.exploreOurRoutes')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('common.discoverPopularDestinations')}
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <RouteMap 
                from="Addis Ababa" 
                to="Bahir Dar" 
                className="h-96 w-full"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;