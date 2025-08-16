import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import trips from '../data/trips.json';
import useAuthStore from '../store/authStore';
import BusCard from '../components/BusCard';
import { useTranslation } from 'react-i18next';

const locations = [...new Set(trips.flatMap(trip => [trip.from, trip.to]))];

const popularRoutes = [
  { from: 'New York', to: 'Boston' },
  { from: 'Los Angeles', to: 'Las Vegas' },
  { from: 'Boston', to: 'New York' },
];

const HomePage = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [from, setFrom] = useState(locations[0] || '');
  const [to, setTo] = useState(locations[1] || '');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
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
  };

  const handlePopularRouteClick = (from, to) => {
    setFrom(from);
    setTo(to);
  };

  const personalizedRecommendations = user && user.preferredLocations && user.preferredLocations.length > 0
    ? trips.filter(trip => user.preferredLocations.includes(trip.from))
    : [];

  return (
    <div className="slick-design">
      <div className="container col-xl-10 col-xxl-8 px-4 py-5">
        <div className="row align-items-center g-lg-5 py-5">
          <div className="col-lg-7 text-center text-lg-start">
            <h1 className="display-4 fw-bold lh-1 mb-3">{t('common.bookYourBusTicket')}</h1>
            <p className="col-lg-10 fs-4">
              {t('common.travelWithComfort')}
            </p>
            <img src="/bus_homepage.jpg" className="img-fluid rounded-3 shadow-lg" alt="A modern bus on the road" />
          </div>
          <div className="col-md-10 mx-auto col-lg-5">
            <form className="p-4 p-md-5 border rounded-3 bg-white shadow" onSubmit={handleSearch} aria-labelledby="search-heading">
              <h2 id="search-heading" className="visually-hidden">{t('common.search')} {t('common.busTickets')}</h2>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                  aria-label={t('common.departureLocation')}
                  list="locations"
                  placeholder={t('common.from')}
                />
                <label htmlFor="from">{t('common.from')}</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                  aria-label={t('common.arrivalLocation')}
                  list="locations"
                  placeholder={t('common.to')}
                />
                <label htmlFor="to">{t('common.to')}</label>
              </div>
              <datalist id="locations">
                {locations.map(location => (
                  <option key={location} value={location} />
                ))}
              </datalist>
              <div className="mb-3">
                <label htmlFor="departureDate" className="form-label">{t('common.departureDate')}</label>
                <DatePicker
                  id="departureDate"
                  selected={departureDate}
                  onChange={(date) => setDepartureDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  required
                  aria-label={t('common.departureDate')}
                />
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="roundTripCheck"
                  checked={isRoundTrip}
                  onChange={(e) => setIsRoundTrip(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="roundTripCheck">
                  {t('common.roundTrip')}
                </label>
              </div>
              {isRoundTrip && (
                <div className="mb-3">
                  <label htmlFor="returnDate" className="form-label">{t('common.returnDate')}</label>
                  <DatePicker
                    id="returnDate"
                    selected={returnDate}
                    onChange={(date) => setReturnDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                    required
                    aria-label={t('common.returnDate')}
                  />
                </div>
              )}
              <button className="w-100 btn btn-lg btn-primary" type="submit">{t('common.searchBuses')}</button>
            </form>
          </div>
        </div>
      </div>

      {user && personalizedRecommendations.length > 0 && (
        <div className="container px-4 py-5" id="personalized-recommendations">
          <h2 className="pb-2 border-bottom">{t('common.personalizedRecommendations')}</h2>
          <div className="row g-4 py-5">
            {personalizedRecommendations.map((trip) => (
              <div className="col-md-6 col-lg-4" key={trip.id}>
                <BusCard trip={trip} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container px-4 py-5" id="popular-routes">
        <h2 className="pb-2 border-bottom">{t('common.popularRoutes')}</h2>
        <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
          {popularRoutes.map((route, index) => (
            <div className="col d-flex align-items-start" key={index}>
              <div className="icon-square bg-light text-dark flex-shrink-0 me-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-bus-front" viewBox="0 0 16 16">
                  <path d="M5 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-6-1.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM1 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8.157c-1.832.244-3.343 1.023-4.5 2.09C8.643 11.18 7.3 10.403 5.5 10.157V2Zm0 1v7.157a4.5 4.5 0 0 1-1.48-.342A.5.5 0 0 1 0 8.5V3a.5.5 0 0 1 .5-.5H1Zm14 0v5.5a.5.5 0 0 1-.51.492A4.5 4.5 0 0 1 13.5 9.157V3H15Zm-2 7.157a3.5 3.5 0 0 0-2.5 1.033A3.5 3.5 0 0 0 8 11.18a3.5 3.5 0 0 0-2.5 1.01 3.5 3.5 0 0 0-1 2.31c.84.283 1.98.519 3 .519s2.16-.236 3-.519a3.5 3.5 0 0 0-1-2.31 3.5 3.5 0 0 0-2.5-1.01 3.5 3.5 0 0 0-2.5 1.033A3.5 3.5 0 0 0 2 12.843V3h12v9.843Z"/>
                </svg>
              </div>
              <div>
                <h4>{route.from} to {route.to}</h4>
                <p>{t('common.findBestDeals')}</p>
                <button className="btn btn-primary" onClick={() => handlePopularRouteClick(route.from, route.to)} aria-label={t('common.viewDealsFor', { from: route.from, to: route.to})}>
                  {t('common.viewDeals')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
