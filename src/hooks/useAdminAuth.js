import { useState, useEffect } from 'react';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem('admin_access');
    if (session === 'true') setIsAdmin(true);
  }, []);

  const login = (pin) => {
    // Saneamiento de datos: Forzamos que sea texto y limpiamos espacios fantasma
    const pinSeguro = String(pin).trim();

    if (pinSeguro === '1234') {
      sessionStorage.setItem('admin_access', 'true');
      setIsAdmin(true);
      return true;
    }
    
    console.warn("Intento fallido de Admin con el PIN:", pinSeguro);
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('admin_access');
    setIsAdmin(false);
  };

  return { isAdmin, login, logout };
};
