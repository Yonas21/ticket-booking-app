import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('password123');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate('/');
    } else {
      toast.error(t('common.invalidEmailOrPassword'));
    }
  };

  return (
    <div className="container col-xl-10 col-xxl-8 px-4 py-5 slick-design">
       <div className="row align-items-center g-lg-5 py-5">
        <div className="col-md-10 mx-auto col-lg-5">
          <form className="p-4 p-md-5 border rounded-3 bg-white shadow" onSubmit={handleLogin}>
            <h2 class="text-center mb-4">{t('common.login')}</h2>
            <div className="form-floating mb-3">
              <input 
                type="email" 
                className="form-control" 
                id="floatingInput" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="floatingInput">{t('common.emailAddress')}</label>
            </div>
            <div className="form-floating mb-3">
              <input 
                type="password" 
                className="form-control" 
                id="floatingPassword" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="floatingPassword">{t('common.password')}</label>
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">{t('common.login')}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
