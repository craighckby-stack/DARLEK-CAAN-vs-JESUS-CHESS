import React, { StrictMode, Suspense, lazy } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';
import './index.css';

const ErrorBoundary = lazy(() => import('./components/system/ErrorBoundary'));

const LoadingFallback = () => (
  <div className="system-init-pulse" role="status" aria-live="polite">
    <span className="animate-pulse">INITIALIZING_OMEGA_CORE_SYSTEM...</span>
  </div>
);

let root: Root | null = null;

const bootstrap = (): void => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  if (!root) root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <Suspense fallback={<LoadingFallback />}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Suspense>
    </StrictMode>
  );
};

if (typeof window !== 'undefined') {
  const idle = (window as Window & { requestIdleCallback?: (cb: IdleRequestCallback) => number }).requestIdleCallback;
  idle ? idle(bootstrap) : setTimeout(bootstrap, 1);
}





























