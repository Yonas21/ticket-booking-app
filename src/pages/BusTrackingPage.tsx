import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Fix for default icon issue with Leaflet and Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const API_URL = 'http://localhost:8080/api';

interface BusLocation {
  latitude: number;
  longitude: number;
}

const BusTrackingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [busLocation, setBusLocation] = useState<L.LatLngTuple | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchBusLocation = async () => {
      try {
        const response = await fetch(`${API_URL}/trips/${id}/location`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: BusLocation = await response.json();
        setBusLocation([data.latitude, data.longitude]);
        setLoading(false);
      } catch (e: any) {
        console.error("Error fetching bus location:", e);
        setError(t('common.failedToLoadBusLocation'));
        setLoading(false);
      }
    };

    if (id) {
      fetchBusLocation(); // Fetch immediately
      intervalId = setInterval(fetchBusLocation, 5000); // Then every 5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [id, t]);

  if (loading) {
    return (
      <div className="container slick-design text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('common.loading')}...</span>
        </div>
        <p className="mt-3">{t('common.loadingBusLocation')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container slick-design text-center py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!busLocation) {
    return (
      <div className="container slick-design text-center py-5">
        <div className="alert alert-info" role="alert">
          {t('common.busLocationNotAvailable')}
        </div>
      </div>
    );
  }

  return (
    <div className="container slick-design py-4">
      <h2 className="mb-4 text-center">{t('common.busTrackingForTrip', { tripId: id })}</h2>
      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer center={busLocation} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={busLocation}>
            <Popup>
              {t('common.busIsHere')}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <p className="text-center mt-3 text-muted">
        {t('common.currentLocation')}: {busLocation[0].toFixed(5)}, {busLocation[1].toFixed(5)}
      </p>
    </div>
  );
};

export default BusTrackingPage;
