import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container text-center">
          <h2>{this.props.t('common.somethingWentWrong')}</h2>
          <p>{this.props.t('common.tryRefreshingPage')}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default (props) => {
  const { t } = useTranslation();
  return <ErrorBoundary {...props} t={t} />;
};
