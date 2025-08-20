# Bus Ticket Booking System

A modern, full-stack bus ticket booking application built with React (Frontend) and Go (Backend).

## 🚀 Features

### Frontend (React)
- **Modern UI/UX**: Built with Tailwind CSS and Framer Motion
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Internationalization**: Support for English and Amharic
- **Real-time Updates**: Live seat availability and booking status
- **Advanced Search**: Flexible date search and route filtering
- **User Dashboard**: Booking history, profile management
- **Payment Integration**: Secure payment processing
- **Accessibility**: WCAG compliant design

### Backend (Go)
- **RESTful API**: Clean, well-documented endpoints
- **JWT Authentication**: Secure token-based authentication
- **Database**: PostgreSQL with proper indexing
- **Validation**: Comprehensive input validation
- **Error Handling**: Proper error responses and logging
- **Security**: CORS, rate limiting, input sanitization
- **Monitoring**: Health checks and metrics

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Query** - Server state management
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **i18next** - Internationalization

### Backend
- **Go 1.23** - High-performance language
- **Gorilla Mux** - HTTP router
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **Validator** - Input validation
- **Logrus** - Structured logging
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js 18+ and npm
- Go 1.23+
- PostgreSQL 12+
- Redis (optional, for caching)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ticket-booking-app.git
cd ticket-booking-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
go mod tidy

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
# Create a PostgreSQL database named 'bus_booking'
createdb bus_booking

# Run database migrations
psql -d bus_booking -f database/init.sql

# Start the server
go run main.go
```

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

## 📁 Project Structure

```
ticket-booking-app/
├── backend/
│   ├── auth/           # Authentication middleware
│   ├── config/         # Configuration management
│   ├── database/       # Database operations
│   ├── handlers/       # HTTP request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Data models
│   └── utils/          # Utility functions
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── store/          # State management
│   ├── assets/         # Static assets
│   └── locales/        # Translation files
├── public/             # Public assets
└── docs/              # Documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=8080
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=bus_booking

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Trip Endpoints

- `GET /api/public/trips/search` - Search trips
- `GET /api/public/trips/{id}` - Get trip details

### Booking Endpoints

- `POST /api/bookings` - Create booking (authenticated)
- `GET /api/profile` - Get user profile (authenticated)

## 🎨 UI Components

The application includes modern, reusable components:

- **Header**: Navigation with language/currency switcher
- **BusCard**: Trip information display
- **SeatSelection**: Interactive seat picker
- **SearchForm**: Advanced search with filters
- **BookingForm**: Multi-step booking process

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- SQL injection prevention

## 🧪 Testing

### Frontend Testing
```bash
npm run test
```

### Backend Testing
```bash
cd backend
go test ./...
```

## 📦 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
go build -o main .
# Deploy the binary to your server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@busticket.et or create an issue in the repository.

## 🔄 Changelog

### v2.0.0 (Current)
- Complete UI/UX redesign with Tailwind CSS
- Enhanced backend with better security
- Improved performance and scalability
- Added comprehensive error handling
- Internationalization support

### v1.0.0
- Initial release with basic functionality
- Bootstrap-based UI
- Basic CRUD operations
