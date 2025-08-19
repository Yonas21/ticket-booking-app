import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSignUp = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signup(name, email, password);
      toast.success(t('common.accountCreatedSuccessfully'));
      navigate('/');
    }
  };

  return (
    <div className="container col-xl-10 col-xxl-8 px-4 py-5 slick-design">
      <div className="row align-items-center g-lg-5 py-5">
        <div className="col-md-10 mx-auto col-lg-5">
          <form className="p-4 p-md-5 border rounded-3 bg-white shadow" onSubmit={handleSignUp}>
            <h2 className="text-center mb-4">{t('common.signup')}</h2>
            <div className="form-floating mb-3">
              <input 
                type="text" 
                className="form-control"
                id="name"
                placeholder={t('common.johnDoe')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label htmlFor="name">{t('common.fullName')}</label>
            </div>
            <div className="form-floating mb-3">
              <input 
                type="email" 
                className="form-control"
                id="email" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">{t('common.emailAddress')}</label>
            </div>
            <div className="form-floating mb-3">
              <input 
                type="password" 
                className="form-control"
                id="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">{t('common.password')}</label>
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">{t('common.signup')}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;