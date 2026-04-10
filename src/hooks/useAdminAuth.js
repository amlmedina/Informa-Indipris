import { useState, useEffect } from 'react';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem('admin_access');
    if (session === 'true') setIsAdmin(true);
  }, []);

  const login = (password) => {
    // Saneamiento: forzamos a texto y quitamos espacios accidentales
    const passSegura = String(password).trim();

    // Nueva validación con la contraseña solicitada
    if (passSegura === 'admin123') {
      sessionStorage.setItem('admin_access', 'true');
      setIsAdmin(true);
      return true;
    }
    
    console.warn("Intento fallido de Admin con:", passSegura);
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('admin_access');
    setIsAdmin(false);
  };

  return { isAdmin, login, logout };
};
