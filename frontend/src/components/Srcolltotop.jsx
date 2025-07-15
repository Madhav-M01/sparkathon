// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  // Define routes you want scroll-to-top to run on
 // const scrollRoutes = ['/', '/12345', '/profile']; // Only these paths will scroll to top

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
