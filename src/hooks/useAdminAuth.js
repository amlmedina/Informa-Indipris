import { useState, useEffect } from 'react';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem('admin_access');
    if (session === 'true') setIsAdmin(true);
  }, []);

  const login = (pin) => {
    if (pin === '1234') {
      sessionStorage.setItem('admin_access', 'true');
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('admin_access');
    setIsAdmin(false);
  };

  return { isAdmin, login, logout };
};