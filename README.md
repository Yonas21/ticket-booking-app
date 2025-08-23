# 🚌 BusTicket - Online Bus Booking Platform

A modern, responsive bus ticket booking application built with React, Vite, and Go. Features a beautiful UI, real-time booking, multi-currency support, and comprehensive SEO optimization.

![BusTicket Logo](public/logo.svg)

## ✨ Features

### 🎨 User Experience
- **Modern UI/UX**: Beautiful, responsive design with dark/light theme support
- **Multi-language Support**: English and Amharic (አማርኛ)
- **Multi-currency Support**: 20+ African currencies with real-time conversion
- **Real-time Updates**: Live seat availability and booking status
- **Interactive Maps**: Route visualization with Leaflet integration
- **Mobile-First**: Optimized for all device sizes

### 🔍 SEO Optimized
- **Meta Tags**: Comprehensive Open Graph and Twitter Card support
- **Structured Data**: JSON-LD schema markup for better search visibility
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Search engine crawling optimization
- **Performance**: Optimized loading with lazy loading and code splitting
- **PWA Ready**: Web app manifest for mobile installation

### 🐳 Docker Support
- **Multi-stage Builds**: Optimized production images
- **Development Environment**: Hot reload with volume mounting
- **Production Ready**: Nginx reverse proxy with SSL support
- **Database Integration**: PostgreSQL with Redis caching
- **Health Checks**: Automated service monitoring

### 🔧 Development Tools
- **Pre-commit Hooks**: Code quality and formatting automation
- **ESLint & Prettier**: Consistent code style
- **TypeScript Support**: Type safety (optional)
- **Testing**: Playwright for E2E testing
- **CI/CD Ready**: GitHub Actions integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- Git

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/busticket-app.git
cd busticket-app

# Start with Docker (Development)
npm run docker:dev

# Or start in production mode
npm run docker:prod
```

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/busticket-app.git
cd busticket-app

# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, start the backend
cd backend
go run main.go
```

## 📁 Project Structure

```
ticket-booking-app/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/              # Page components
│   ├── services/           # API and external services
│   ├── store/              # State management (Zustand)
│   ├── utils/              # Utility functions
│   ├── locales/            # Internationalization files
│   └── assets/             # Static assets
├── backend/                # Go API server
├── public/                 # Public assets and SEO files
├── scripts/                # Build and deployment scripts
├── tests/                  # E2E tests
├── Dockerfile              # Production Docker image
├── docker-compose.yml      # Multi-service orchestration
└── .pre-commit-config.yaml # Code quality hooks
```

## 🛠️ Development

### Code Quality

```bash
# Install pre-commit hooks
npm run pre-commit:install

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Testing

```bash
# Run E2E tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Generate test report
npm run test:report
```

### Docker Commands

```bash
# Development environment
npm run docker:dev

# Production environment
npm run docker:prod

# View logs
npm run docker:logs

# Stop services
npm run docker:down

# Rebuild containers
npm run docker:rebuild
```

## 🌐 SEO Features

### Meta Tags
- Open Graph tags for social media sharing
- Twitter Card support
- Structured data (JSON-LD)
- Canonical URLs
- Language and region targeting

### Performance
- Lazy loading of components
- Image optimization
- Code splitting
- Gzip compression
- CDN-ready static assets

### Accessibility
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus management

## 🎨 Customization

### Themes
The app supports both light and dark themes with automatic system preference detection.

### Languages
Add new languages by:
1. Creating translation files in `src/locales/`
2. Adding language options in `src/i18n.js`
3. Updating the language selector component

### Currencies
Add new currencies by updating the `CURRENCY_CONFIG` in `src/utils/currencyUtils.js`.

## 📊 Performance

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 95+
- **SEO**: 100

### Bundle Analysis
- **Main Bundle**: ~200KB gzipped
- **Vendor Bundle**: ~150KB gzipped
- **CSS**: ~50KB gzipped

## 🔒 Security

- HTTPS enforcement
- Content Security Policy (CSP)
- XSS protection headers
- CSRF protection
- Input validation and sanitization
- Secure authentication with JWT

## 🚀 Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Production

```bash
# Build and run production containers
docker-compose --profile production up -d

# With custom environment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Environment Variables

#### Development Setup
```bash
# Copy the example environment file
npm run docker:env:setup

# Edit the .env file with your actual values
nano .env
```

#### Production Setup
```bash
# Copy the production environment file
npm run docker:env:prod

# Edit the .env.production file with your production values
nano .env.production
```

#### Required Environment Variables
- `DB_PASSWORD` - Strong database password
- `JWT_SECRET` - Long random string for JWT signing
- `SESSION_SECRET` - Long random string for session management

#### Optional Environment Variables
- `REDIS_PASSWORD` - Redis password (recommended for production)
- `SMTP_*` - Email configuration
- `STRIPE_*` - Payment gateway configuration
- `SENTRY_DSN` - Error monitoring

**⚠️ Security Note**: Never commit `.env` or `.env.production` files to version control. They contain sensitive information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build process or auxiliary tool changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Leaflet](https://leafletjs.com/) - Maps
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

## 📞 Support

- **Email**: support@busticket.com
- **Documentation**: [docs.busticket.com](https://docs.busticket.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/busticket-app/issues)

---

Made with ❤️ for better travel experiences
