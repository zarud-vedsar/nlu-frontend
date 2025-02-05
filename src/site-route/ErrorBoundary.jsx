import React, { Component } from 'react';

class ErrorBoundary extends Component {
    state = { hasError: false, errorInfo: null };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong!</div>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
