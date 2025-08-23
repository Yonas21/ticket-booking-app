import React from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      isRecovering: false 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ isRecovering: true });
    
    // Simulate recovery process
    setTimeout(() => {
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null,
        isRecovering: false 
      });
    }, 1000);
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error}
        onRetry={this.handleRetry}
        onGoHome={this.handleGoHome}
        onGoBack={this.handleGoBack}
        isRecovering={this.state.isRecovering}
      />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, onRetry, onGoHome, onGoBack, isRecovering }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="card-modern p-8">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.oops')}
          </h1>

          {/* Error Message */}
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('common.somethingWentWrong')}
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('common.errorDetails')}
              </summary>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-32">
                <pre>{error.toString()}</pre>
                {error.stack && (
                  <pre className="mt-2">{error.stack}</pre>
                )}
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onRetry}
              disabled={isRecovering}
              className="w-full btn-primary-modern flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isRecovering ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>{t('common.recovering')}</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>{t('common.tryAgain')}</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onGoBack}
                className="btn-secondary-modern flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('common.goBack')}</span>
              </button>

              <button
                onClick={onGoHome}
                className="btn-secondary-modern flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>{t('common.goHome')}</span>
              </button>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {t('common.stillHavingIssues')}
            </p>
            <a
              href="/contact"
              className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {t('common.contactSupport')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
