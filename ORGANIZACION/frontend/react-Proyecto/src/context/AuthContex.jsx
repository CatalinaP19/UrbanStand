import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      const currentUser = localStorage.getItem('urbanstand_current_user');
      
      if (token && currentUser) {
        return JSON.parse(currentUser);
      }
      return null;
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      return null;
    }
  });

  const login = (userData, token, userType) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    localStorage.setItem('urbanstand_current_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  const isAuthenticated = () => {
    return user !== null && localStorage.getItem('token') !== null;
  };

  const getUserRole = () => {
    return user?.role || localStorage.getItem('userType');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated, 
        getUserRole 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};