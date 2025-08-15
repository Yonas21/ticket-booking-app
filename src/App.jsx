import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './i18n'; // Import i18n configuration
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Import i18n instance

const Layout = () => {
  return (
    <>
      <Header />
      <main className="flex-shrink-0">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

function App() {
  useEffect(() => {
    useAuthStore.getState().rehydrate();
  }, []);

  const handleLiveChatClick = () => {
    alert('Welcome to Live Chat! How can I help you today? (Mock Chat)');
  };

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
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
          </Route>
        </Routes>
        <button
          className="btn btn-primary rounded-circle shadow-lg"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={handleLiveChatClick}
          aria-label="Live Chat"
        >
          <i className="bi bi-chat-dots-fill"></i>
        </button>
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </Router>
    </I18nextProvider>
  );
}

export default App;
