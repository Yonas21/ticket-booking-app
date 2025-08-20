import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateForm = () => {
    let isValid = true;
    if (!name) {
      toast.error(t('common.fullNameRequired'));
      isValid = false;
    }
    if (!email) {
      toast.error(t('common.emailRequired'));
      isValid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      toast.error(t('common.invalidEmailFormat'));
      isValid = false;
    }
    if (!password) {
      toast.error(t('common.passwordRequired'));
      isValid = false;
    } else if (password.length < 6) {
      toast.error(t('common.passwordTooShort'));
      isValid = false;
    }
    return isValid;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const success = await signup(name, email, password);
        if (success) {
          toast.success(t('common.accountCreatedSuccessfully'));
          navigate('/login');
        } else {
          toast.error(t('common.signupFailed'));
        }
      } catch (error) {
        toast.error(t('common.signupFailed'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container col-xl-10 col-xxl-8 px-4 py-5 slick-design">
      <div className="row align-items-center g-lg-5 py-5">
        <div className="col-md-10 mx-auto col-lg-5">
          <form className="p-4 p-md-5 border rounded-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow" onSubmit={handleSignUp}>
            <h2 className="text-center mb-4 text-gray-900 dark:text-white">{t('common.signup')}</h2>
            <div className="form-floating mb-3">
              <input 
                type="text" 
                className="form-control bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                id="name"
                placeholder={t('common.johnDoe')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label htmlFor="name" className="text-gray-700 dark:text-gray-300">{t('common.fullName')}</label>
            </div>
            <div className="form-floating mb-3">
              <input 
                type="email" 
                className="form-control bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                id="email" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email" className="text-gray-700 dark:text-gray-300">{t('common.emailAddress')}</label>
            </div>
            <div className="form-floating mb-3">
              <input 
                type="password" 
                className="form-control bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                id="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password" className="text-gray-700 dark:text-gray-300">{t('common.password')}</label>
            </div>
                          <button 
                className="w-100 btn btn-lg btn-primary" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {t('common.signingUp')}
                  </>
                ) : (
                  t('common.signup')
                )}
              </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;