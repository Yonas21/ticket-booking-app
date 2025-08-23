import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchTrips } from '../services/api';
import BusCard from '../components/BusCard';
import tripsData from '../data/trips.json';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, Clock, DollarSign, Wifi, Zap, Coffee } from 'lucide-react';
import { formatDate, formatTripDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/currencyUtils';
import useAuthStore from '../store/authStore';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOperator, setFilterOperator] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [departureTime, setDepartureTime] = useState('All');
  const [sortBy, setSortBy] = useState('priceAsc');
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();
  const { currency } = useAuthStore();

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const departureDate = searchParams.get('departureDate');
  const flexibleDateRange = searchParams.get('flexibleDateRange');

  const uniqueOperators = ['All', ...new Set(tripsData.map(trip => trip.busOperator))];

  useEffect(() => {
    const fetchAndFilterTrips = async () => {
      setLoading(true);
      let results = await searchTrips(from, to, departureDate, flexibleDateRange, currency);

      // Apply operator filter
      if (filterOperator !== 'All') {
        results = results.filter(trip => trip.busOperator === filterOperator);
      }

      // Apply price filter
      if (minPrice !== '') {
        results = results.filter(trip => trip.price >= parseFloat(minPrice));
      }
      if (maxPrice !== '') {
        results = results.filter(trip => trip.price <= parseFloat(maxPrice));
      }

      // Apply amenities filter
      if (amenities.length > 0) {
        results = results.filter(trip => amenities.every(amenity => trip.amenities.includes(amenity)));
      }

      // Apply departure time filter
      if (departureTime !== 'All') {
        const [start, end] = departureTime.split('-').map(time => parseInt(time));
        results = results.filter(trip => {
          const departureHour = new Date(`2000/01/01 ${trip.departureTime}`).getHours();
          return departureHour >= start && departureHour < end;
        });
      }

      // Apply sorting
      results.sort((a, b) => {
        if (sortBy === 'priceAsc') {
          return a.price - b.price;
        } else if (sortBy === 'priceDesc') {
          return b.price - a.price;
        } else if (sortBy === 'departureAsc') {
          return new Date(`2000/01/01 ${a.departureTime}`) - new Date(`2000/01/01 ${b.departureTime}`);
        } else if (sortBy === 'departureDesc') {
          return new Date(`2000/01/01 ${b.departureTime}`) - new Date(`2000/01/01 ${a.departureTime}`);
        } else if (sortBy === 'durationAsc') {
          return a.duration - b.duration;
        } else if (sortBy === 'durationDesc') {
          return b.duration - a.duration;
        }
        return 0;
      });

      setTrips(results);
      setLoading(false);
    };

    if (from && to && departureDate) {
      fetchAndFilterTrips();
    }
  }, [from, to, departureDate, flexibleDateRange, filterOperator, minPrice, maxPrice, sortBy, amenities, departureTime, currency]);

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setAmenities(prev => checked ? [...prev, value] : prev.filter(item => item !== value));
  };

  const clearFilters = () => {
    setFilterOperator('All');
    setMinPrice('');
    setMaxPrice('');
    setAmenities([]);
    setDepartureTime('All');
    setSortBy('priceAsc');
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 mt-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('common.availableTripsFromTo', { from: from, to: to })}
          </h1>
          <p className="text-gray-600">
            {formatTripDate(departureDate)} • {trips.length} {trips.length === 1 ? 'trip' : 'trips'} found
          </p>
          {flexibleDateRange && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                {t('common.showingResultsFor', { range: flexibleDateRange, date: formatTripDate(departureDate) })}
              </p>
            </div>
          )}
        </motion.div>

        {/* Filter Toggle Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} />
            {t('common.filters')}
            <span className="ml-auto text-sm text-gray-500">
              {showFilters ? '−' : '+'}
            </span>
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Operator Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.operator')}
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={filterOperator}
                      onChange={(e) => setFilterOperator(e.target.value)}
                    >
                      {uniqueOperators.map(operator => (
                        <option key={operator} value={operator}>{operator}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.minPrice')}
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.maxPrice')}
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="1000"
                    />
                  </div>

                  {/* Departure Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.departureTime')}
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                    >
                      <option value="All">{t('common.allDay')}</option>
                      <option value="0-6">{t('common.earlyMorning')} (12am - 6am)</option>
                      <option value="6-12">{t('common.morning')} (6am - 12pm)</option>
                      <option value="12-18">{t('common.afternoon')} (12pm - 6pm)</option>
                      <option value="18-24">{t('common.evening')} (6pm - 12am)</option>
                    </select>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('common.amenities')}
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { value: 'WiFi', icon: Wifi, label: t('common.wifi') },
                      { value: 'AC', icon: Coffee, label: t('common.ac') },
                      { value: 'Power Outlet', icon: Zap, label: t('common.powerOutlet') },
                      { value: 'Restroom', icon: Coffee, label: t('common.restroom') }
                    ].map(({ value, icon: Icon, label }) => (
                      <label key={value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={value}
                          onChange={handleAmenityChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <Icon size={16} />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('common.sortBy')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'priceAsc', label: t('common.priceLowToHigh'), icon: DollarSign },
                      { value: 'priceDesc', label: t('common.priceHighToLow'), icon: DollarSign },
                      { value: 'departureAsc', label: t('common.departureEarlyToLate'), icon: Clock },
                      { value: 'departureDesc', label: t('common.departureLateToEarly'), icon: Clock }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setSortBy(value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                          sortBy === value
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-sm">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {t('common.clearFilters')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">{t('common.searchingForTrips')}</p>
          </motion.div>
        ) : trips.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {trips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BusCard trip={trip} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🚌</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t('common.noTripsFound')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('common.tryAdjusting')}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Search size={20} />
                {t('common.backToHome')}
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
