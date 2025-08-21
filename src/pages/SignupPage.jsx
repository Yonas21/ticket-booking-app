import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Github,
  Chrome,
  Facebook,
  Phone
} from 'lucide-react';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Update password strength when password changes
    if (field === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }

    // Clear confirm password error when either password field changes
    if (field === 'password' || field === 'confirmPassword') {
      if (errors.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const calculatePasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push(t('common.passwordMinLength'));
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push(t('common.passwordLowercase'));
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push(t('common.passwordUppercase'));
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push(t('common.passwordNumber'));
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push(t('common.passwordSpecial'));
    }

    return { score, feedback };
  };

  const getPasswordStrengthColor = (score) => {
    if (score <= 2) return 'text-red-500';
    if (score <= 3) return 'text-yellow-500';
    if (score <= 4) return 'text-blue-500';
    return 'text-green-500';
  };

  const getPasswordStrengthText = (score) => {
    if (score <= 2) return t('common.passwordWeak');
    if (score <= 3) return t('common.passwordFair');
    if (score <= 4) return t('common.passwordGood');
    return t('common.passwordStrong');
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('common.fullNameRequired');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('common.nameTooShort');
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = t('common.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('common.invalidEmailFormat');
    }

    // Phone validation (optional but if provided, validate format)
    if (formData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = t('common.invalidPhoneFormat');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('common.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('common.passwordTooShort');
    } else if (passwordStrength.score < 3) {
      newErrors.password = t('common.passwordTooWeak');
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('common.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('common.passwordsDoNotMatch');
    }

    // Terms validation
    if (!acceptedTerms) {
      newErrors.terms = t('common.termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup(formData.name, formData.email, formData.password);
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
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${t('common.socialLoginNotImplemented')} ${provider}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('common.createAccount')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {t('common.joinUsForBestExperience')}
          </p>
        </div>
        
        <div className="card-modern p-8">
          {/* Social Login Options */}
          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              {t('common.signUpWith')}
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                data-testid="google-signup"
              >
                <Chrome className="w-5 h-5 text-red-500" />
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                data-testid="facebook-signup"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('GitHub')}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                data-testid="github-signup"
              >
                <Github className="w-5 h-5 text-gray-800 dark:text-white" />
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  {t('common.orContinueWith')}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="form-label-modern">
                <User className="inline w-4 h-4 mr-2" />
                {t('common.fullName')}
              </label>
              <input
                id="name"
                type="text"
                className={`input-modern ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder={t('common.enterFullName')}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                autoComplete="name"
                data-testid="signup-name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="form-label-modern">
                <Mail className="inline w-4 h-4 mr-2" />
                {t('common.emailAddress')}
              </label>
              <input
                id="email"
                type="email"
                className={`input-modern ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                autoComplete="email"
                data-testid="signup-email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label htmlFor="phone" className="form-label-modern">
                <Phone className="inline w-4 h-4 mr-2" />
                {t('common.phoneNumber')} ({t('common.optional')})
              </label>
              <input
                id="phone"
                type="tel"
                className={`input-modern ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                autoComplete="tel"
                data-testid="signup-phone"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="form-label-modern">
                <Lock className="inline w-4 h-4 mr-2" />
                {t('common.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`input-modern pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  autoComplete="new-password"
                  data-testid="signup-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={getPasswordStrengthColor(passwordStrength.score)}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 w-8 rounded ${
                            level <= passwordStrength.score
                              ? getPasswordStrengthColor(passwordStrength.score).replace('text-', 'bg-')
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="mt-2 space-y-1">
                    {passwordStrength.feedback.map((requirement, index) => (
                      <p key={index} className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {requirement}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="form-label-modern">
                <Lock className="inline w-4 h-4 mr-2" />
                {t('common.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`input-modern pr-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  autoComplete="new-password"
                  data-testid="signup-confirm-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  data-testid="toggle-confirm-password"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-1">
                  {formData.password === formData.confirmPassword ? (
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {t('common.passwordsMatch')}
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {t('common.passwordsDoNotMatch')}
                    </p>
                  )}
                </div>
              )}
              
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                data-testid="signup-terms"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                {t('common.iAgreeTo')}{' '}
                <Link
                  to="/terms"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('common.termsOfService')}
                </Link>{' '}
                {t('common.and')}{' '}
                <Link
                  to="/privacy"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('common.privacyPolicy')}
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                <XCircle className="w-4 h-4 mr-1" />
                {errors.terms}
              </p>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary-modern flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="signup-submit"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>{t('common.creatingAccount')}</span>
                </>
              ) : (
                <span>{t('common.createAccount')}</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('common.alreadyHaveAccount')}{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {t('common.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;