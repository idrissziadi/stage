import { useState, useCallback } from 'react';

interface SnackbarState {
  open: boolean;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const useStyledSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    title: '',
    description: '',
    type: 'info',
    duration: 5000,
    position: 'top-right'
  });

  const showSnackbar = useCallback((
    title: string,
    description?: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration?: number,
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  ) => {
    setSnackbar({
      open: true,
      title,
      description,
      type,
      duration,
      position
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Méthodes de convenance pour différents types
  const showSuccess = useCallback((title: string, description?: string, duration?: number) => {
    showSnackbar(title, description, 'success', duration);
  }, [showSnackbar]);

  const showError = useCallback((title: string, description?: string, duration?: number) => {
    showSnackbar(title, description, 'error', duration);
  }, [showSnackbar]);

  const showWarning = useCallback((title: string, description?: string, duration?: number) => {
    showSnackbar(title, description, 'warning', duration);
  }, [showSnackbar]);

  const showInfo = useCallback((title: string, description?: string, duration?: number) => {
    showSnackbar(title, description, 'info', duration);
  }, [showSnackbar]);

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
