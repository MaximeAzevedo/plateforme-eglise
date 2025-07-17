import React, { useState, useEffect } from 'react';
import { AdminAuth } from './AdminAuth';
import { ModerationDashboard } from './ModerationDashboard';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />;
  }

  return <ModerationDashboard />;
}; 