import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ roles, children }) {
    const { usuario } = useAuth();

    // 1. Si no hay sesión, redirige al login
    if (!usuario) {
        return <Navigate to="/" replace />;
    }

    // 2. Si el rol no está permitido, alerta y redirige
    if (roles && !roles.includes(usuario.rol)) {
        alert('Acceso denegado. No tienes permiso para ver esta página.');
        return <Navigate to="/" replace />;
    }

    // 3. Si todo está bien, muestra el componente hijo
    return children;
}

export default ProtectedRoute;