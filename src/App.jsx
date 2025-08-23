import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { HelmetProvider } from 'react-helmet-async';
import useAuthStore from './store/authStore';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import SupportPage from './pages/SupportPage';
import PaymentPage from './pages/PaymentPage';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const { theme, rehydrate } = useAuthStore();
  
  useEffect(() => {
    // Initialize auth store and apply theme
    rehydrate();
  }, [rehydrate]);

  useEffect(() => {
    // Apply theme to document root
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLiveChatClick = () => {
    // Enhanced live chat with modern UI
    const chatWindow = window.open(
      'https://example.com/chat',
      'LiveChat',
      'width=400,height=600,scrollbars=yes,resizable=yes'
    );
    
    if (!chatWindow) {
      alert('Welcome to Live Chat! How can I help you today? (Mock Chat)');
    }
  };

  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <Router>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="search" element={<SearchResultsPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignUpPage />} />
                <Route path="booking/:id" element={<BookingPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="booking-confirmation" element={<BookingConfirmationPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="payment" element={<PaymentPage />} />
              </Route>
            </Routes>
          </ErrorBoundary>

        {/* Enhanced Live Chat Button */}
        <motion.button
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          onClick={handleLiveChatClick}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          aria-label="Live Chat"
        >
          <MessageCircle className="w-6 h-6 group-hover:animate-bounce" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </motion.button>

        {/* Enhanced Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          toastClassName="rounded-lg shadow-lg"
          bodyClassName="font-medium"
        />
      </Router>
    </I18nextProvider>
  );
}

export default App;
