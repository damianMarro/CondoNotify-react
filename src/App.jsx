import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Importar Páginas
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardConserje from './pages/DashboardConserje';
import DashboardResidente from './pages/DashboardResidente';

import './styles/styles.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Ruta Pública */}
                    <Route path="/" element={<Login />} />
                    
                    {/* Rutas Protegidas - ADMINISTRADOR */}
                    <Route path="/admin" element={
                        <ProtectedRoute roles={['Administrador']}>
                            <DashboardAdmin />
                        </ProtectedRoute>
                    } />
                    
                    {/* Rutas Protegidas - CONSERJE */}
                    <Route path="/conserje" element={
                        <ProtectedRoute roles={['Conserje']}>
                            <DashboardConserje />
                        </ProtectedRoute>
                    } />
                    
                    {/* Rutas Protegidas - RESIDENTE */}
                    <Route path="/residente" element={
                        <ProtectedRoute roles={['Residente']}>
                            <DashboardResidente />
                        </ProtectedRoute>
                    } />
                    
                    {/* Redirección por defecto */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
