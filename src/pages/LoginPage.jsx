import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success(t('common.loginSuccessful'));
        navigate('/');
      } else {
        toast.error(t('common.invalidEmailOrPassword'));
      }
    } catch (error) {
      toast.error(t('common.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container col-xl-10 col-xxl-8 px-4 py-5 slick-design">
       <div className="row align-items-center g-lg-5 py-5">
        <div className="col-md-10 mx-auto col-lg-5">
          <form className="p-4 p-md-5 border rounded-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow" onSubmit={handleLogin}>
            <h2 className="text-center mb-4 text-gray-900 dark:text-white">{t('common.login')}</h2>
            <div className="form-floating mb-3">
              <input 
                type="email" 
                className="form-control bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white" 
                id="floatingInput" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="floatingInput" className="text-gray-700 dark:text-gray-300">{t('common.emailAddress')}</label>
            </div>
            <div className="form-floating mb-3">
              <input 
                type="password" 
                className="form-control bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white" 
                id="floatingPassword" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="floatingPassword" className="text-gray-700 dark:text-gray-300">{t('common.password')}</label>
            </div>
                          <button 
                className="w-100 btn btn-lg btn-primary" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {t('common.loggingIn')}
                  </>
                ) : (
                  t('common.login')
                )}
              </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
