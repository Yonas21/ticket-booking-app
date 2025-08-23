import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ 
  size = 'default', 
  showText = true, 
  className = '', 
  linkTo = '/' 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-sm',
    default: 'text-lg',
    large: 'text-xl',
    xl: 'text-2xl'
  };

  const LogoContent = () => (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#8B5CF6', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#EC4899', stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="busGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#1E40AF', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#3B82F6', stopOpacity: 1}} />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle cx="16" cy="16" r="15" fill="url(#logoGradient)" stroke="#1E40AF" strokeWidth="1"/>
          
          {/* Bus Icon */}
          <g transform="translate(4, 8)">
            {/* Bus Body */}
            <rect x="0" y="2" width="20" height="10" rx="2" fill="url(#busGradient)" stroke="#1E40AF" strokeWidth="0.5"/>
            
            {/* Windows */}
            <rect x="1.5" y="3" width="4" height="3" rx="0.5" fill="#E0F2FE" opacity="0.9"/>
            <rect x="6.5" y="3" width="4" height="3" rx="0.5" fill="#E0F2FE" opacity="0.9"/>
            <rect x="11.5" y="3" width="4" height="3" rx="0.5" fill="#E0F2FE" opacity="0.9"/>
            <rect x="16.5" y="3" width="2.5" height="3" rx="0.5" fill="#E0F2FE" opacity="0.9"/>
            
            {/* Wheels */}
            <circle cx="4" cy="14" r="1.5" fill="#374151" stroke="#1F2937" strokeWidth="0.5"/>
            <circle cx="16" cy="14" r="1.5" fill="#374151" stroke="#1F2937" strokeWidth="0.5"/>
            
            {/* Headlights */}
            <circle cx="1" cy="4" r="0.5" fill="#FEF3C7"/>
            <circle cx="1" cy="6" r="0.5" fill="#FEF3C7"/>
          </g>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${textSizes[size]}`}>
            BusTicket
          </span>
          {size === 'xl' && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Your Journey Starts Here
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="hover:opacity-80 transition-opacity duration-200">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
};

export default Logo;
