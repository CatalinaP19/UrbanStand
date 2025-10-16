// src/Componentes/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContex';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, getUserRole } = useAuth();
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // Si hay roles permitidos, verificar que el usuario tenga el rol correcto
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = getUserRole();
    if (!allowedRoles.includes(userRole)) {
      // Si no tiene el rol correcto, redirigir a su página correspondiente
      if (userRole === 'vendedor') return <Navigate to="/vendedor" replace />;
      if (userRole === 'entidad') return <Navigate to="/entidades" replace />;
      if (userRole === 'cliente') return <Navigate to="/cliente" replace />;
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

export default PrivateRoute;