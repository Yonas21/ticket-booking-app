import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchTrips } from '../services/api';
import BusCard from '../components/BusCard';
import tripsData from '../data/trips.json';
import { useTranslation } from 'react-i18next';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOperator, setFilterOperator] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('priceAsc'); // priceAsc, priceDesc, departureAsc, departureDesc
  const { t } = useTranslation();

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const departureDate = searchParams.get('departureDate');
  const flexibleDateRange = searchParams.get('flexibleDateRange');

  const uniqueOperators = ['All', ...new Set(tripsData.map(trip => trip.busOperator))];

  useEffect(() => {
    const fetchAndFilterTrips = async () => {
      setLoading(true);
      let results = await searchTrips(from, to, departureDate, flexibleDateRange);

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
        }
        return 0;
      });

      setTrips(results);
      setLoading(false);
    };

    if (from && to && departureDate) {
      fetchAndFilterTrips();
    }
  }, [from, to, departureDate, flexibleDateRange, filterOperator, minPrice, maxPrice, sortBy]);

  return (
    <div className="container slick-design">
      <h2 className="mb-4">{t('common.availableTripsFromTo', { from: from, to: to })}</h2>
      {flexibleDateRange && (
        <p className="alert alert-info">{t('common.showingResultsFor', { range: flexibleDateRange, date: departureDate })}</p>
      )}

      <div className="card mb-4 p-3 shadow-sm">
        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="filterOperator" className="form-label">{t('common.operator')}:</label>
            <select
              id="filterOperator"
              className="form-select"
              value={filterOperator}
              onChange={(e) => setFilterOperator(e.target.value)}
            >
              {uniqueOperators.map(operator => (
                <option key={operator} value={operator}>{operator}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="minPrice" className="form-label">{t('common.minPrice')}:</label>
            <input
              type="number"
              id="minPrice"
              className="form-control"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="e.g., 20"
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="maxPrice" className="form-label">{t('common.maxPrice')}:</label>
            <input
              type="number"
              id="maxPrice"
              className="form-control"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g., 100"
            />
          </div>
          <div className="col-md-12">
            <label className="form-label d-block">{t('common.sortBy')}:</label>
            <div className="btn-group" role="group" aria-label="Sort by options">
              <input type="radio" className="btn-check" name="sortBy" id="priceAsc" autoComplete="off" checked={sortBy === 'priceAsc'} onChange={() => setSortBy('priceAsc')} />
              <label className="btn btn-outline-primary" htmlFor="priceAsc">{t('common.priceLowToHigh')} <i className="bi bi-arrow-up"></i></label>

              <input type="radio" className="btn-check" name="sortBy" id="priceDesc" autoComplete="off" checked={sortBy === 'priceDesc'} onChange={() => setSortBy('priceDesc')} />
              <label className="btn btn-outline-primary" htmlFor="priceDesc">{t('common.priceHighToLow')} <i className="bi bi-arrow-down"></i></label>

              <input type="radio" className="btn-check" name="sortBy" id="departureAsc" autoComplete="off" checked={sortBy === 'departureAsc'} onChange={() => setSortBy('departureAsc')} />
              <label className="btn btn-outline-primary" htmlFor="departureAsc">{t('common.departureEarlyToLate')} <i className="bi bi-arrow-up"></i></label>

              <input type="radio" className="btn-check" name="sortBy" id="departureDesc" autoComplete="off" checked={sortBy === 'departureDesc'} onChange={() => setSortBy('departureDesc')} />
              <label className="btn btn-outline-primary" htmlFor="departureDesc">{t('common.departureLateToEarly')} <i className="bi bi-arrow-down"></i></label>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="custom-loader">
          <div className="spinner"></div>
          <p>{t('common.searchingForTrips')}</p>
        </div>
      ) : trips.length > 0 ? (
        trips.map((trip) => <BusCard key={trip.id} trip={trip} />)
      ) : (
        <div className="alert alert-info text-center py-4" role="alert">
          <i className="bi bi-emoji-frown display-4 d-block mb-2"></i>
          <h4>{t('common.noTripsFound')}</h4>
          <p>{t('common.tryAdjusting')}</p>
          <Link to="/" className="btn btn-primary mt-2">{t('common.backToHome')}</Link>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;