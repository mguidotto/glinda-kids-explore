
import { useEffect } from 'react';
import { useGoogleAnalytics } from './useGoogleAnalytics';

export const useErrorTracking = () => {
  const { trackEvent } = useGoogleAnalytics();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      trackEvent('error', {
        error_message: event.message,
        error_filename: event.filename,
        error_lineno: event.lineno,
        error_colno: event.colno
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      trackEvent('promise_rejection', {
        error_reason: event.reason?.toString() || 'Unknown promise rejection'
      });
    };

    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
        console.error('Resource failed to load:', target);
        trackEvent('resource_error', {
          resource_type: target.tagName,
          resource_src: (target as any).src || (target as any).href || 'unknown'
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleResourceError, true);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleResourceError, true);
    };
  }, [trackEvent]);

  const logNavigation = (from: string, to: string, success: boolean) => {
    console.log(`Navigation: ${from} -> ${to} (${success ? 'SUCCESS' : 'FAILED'})`);
    trackEvent('navigation', {
      from_path: from,
      to_path: to,
      success: success
    });
  };

  const log404Error = (path: string, referrer?: string) => {
    console.error(`404 Error: ${path}`, { referrer });
    trackEvent('404_error', {
      path: path,
      referrer: referrer || 'direct'
    });
  };

  return {
    logNavigation,
    log404Error
  };
};
