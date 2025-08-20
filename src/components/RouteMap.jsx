import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import SimpleMap from './SimpleMap';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RouteMap = ({ from, to, className = "h-64 w-full" }) => {
  const { t } = useTranslation();
  const [routeData, setRouteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Ethiopian cities coordinates (mock data)
  const cityCoordinates = {
    'Addis Ababa': [9.145, 40.4897],
    'Bahir Dar': [11.5897, 37.3907],
    'Gondar': [12.6, 37.4667],
    'Mekelle': [13.4969, 39.4769],
    'Dire Dawa': [9.6, 41.8667],
    'Adama': [8.55, 39.27],
    'Hawassa': [7.05, 38.47],
    'Jimma': [7.6667, 36.8333],
    'Dessie': [11.1333, 39.6333],
    'Jijiga': [9.35, 42.8],
    'Shashamane': [7.2, 38.6],
    'Bishoftu': [8.75, 38.9833],
    'Arba Minch': [6.0333, 37.55],
    'Hosaena': [7.55, 37.85],
    'Harar': [9.3167, 42.1167],
    'Dilla': [6.4167, 38.3167],
    'Nekemte': [9.0833, 36.55],
    'Debre Birhan': [9.6833, 39.5333],
    'Asella': [7.95, 39.1167],
    'Debre Markos': [10.3333, 37.7333],
    'Debre Tabor': [11.85, 38.0167],
    'Kombolcha': [11.0833, 39.7333],
    'Adigrat': [14.2833, 39.4667],
    'Wolaita Sodo': [6.85, 37.7667],
    'Hosaena': [7.55, 37.85],
    'Bale Robe': [7.1333, 40.0],
    'Goba': [7.0167, 39.9833],
    'Yirgalem': [6.75, 38.4167],
    'Mizan Teferi': [6.9833, 35.55],
    'Gambella': [8.25, 34.5833],
    'Jinka': [5.7833, 36.5667],
    'Kebri Dehar': [6.7333, 44.2667],
    'Gode': [5.95, 43.45],
    'Dolo Bay': [4.1833, 42.0833],
    'Semera': [11.7833, 41.0167],
    'Logiya': [11.9667, 41.7833],
    'Abala': [13.5167, 39.9833],
    'Shire': [14.1, 38.2833],
    'Axum': [14.1167, 38.7167],
    'Lalibela': [12.0333, 39.05],
    'Sekota': [12.9667, 39.2333],
    'Debark': [13.1333, 37.9],
    'Gondar': [12.6, 37.4667],
    'Bahir Dar': [11.5897, 37.3907],
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const generateRoute = () => {
      setIsLoading(true);
      
      // Get coordinates for from and to cities
      const fromCoords = cityCoordinates[from] || [9.145, 40.4897]; // Default to Addis Ababa
      const toCoords = cityCoordinates[to] || [11.5897, 37.3907]; // Default to Bahir Dar
      
      // Generate intermediate points for a more realistic route
      const routePoints = [
        fromCoords,
        [
          (fromCoords[0] + toCoords[0]) / 2 + (Math.random() - 0.5) * 0.5,
          (fromCoords[1] + toCoords[1]) / 2 + (Math.random() - 0.5) * 0.5
        ],
        toCoords
      ];
      
      setRouteData({
        from: fromCoords,
        to: toCoords,
        route: routePoints
      });
      
      setIsLoading(false);
    };

    if (from && to) {
      generateRoute();
    }
  }, [from, to, isClient]);

  if (!isClient || isLoading) {
    return (
      <div className={`${className} bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center`}>
        <div className="text-gray-600 dark:text-gray-400">{t('common.loadingMap')}</div>
      </div>
    );
  }

  if (!routeData) {
    return <SimpleMap from={from} to={to} className={className} />;
  }

  const center = [
    (routeData.from[0] + routeData.to[0]) / 2,
    (routeData.from[1] + routeData.to[1]) / 2
  ];

  try {
    return (
      <div className={`${className} rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700`}>
        <MapContainer
          center={center}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
          className="dark:filter dark:invert dark:hue-rotate-180"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Departure Marker */}
          <Marker position={routeData.from}>
            <Popup>
              <div className="text-center">
                <strong className="text-green-600">{t('common.departure')}</strong><br />
                {from}
              </div>
            </Popup>
          </Marker>
          
          {/* Arrival Marker */}
          <Marker position={routeData.to}>
            <Popup>
              <div className="text-center">
                <strong className="text-red-600">{t('common.arrival')}</strong><br />
                {to}
              </div>
            </Popup>
          </Marker>
          
          {/* Route Line */}
          <Polyline
            positions={routeData.route}
            color="#3b82f6"
            weight={4}
            opacity={0.8}
          />
        </MapContainer>
      </div>
    );
  } catch (error) {
    console.error('Map rendering error:', error);
    return <SimpleMap from={from} to={to} className={className} />;
  }
};

export default RouteMap;
