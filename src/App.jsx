import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


// Importar Páginas
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardConserje from './pages/DashboardConserje';
import DashboardResidente from './pages/DashboardResidente';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminProductos from './pages/AdminProductos';
import ConserjeDeliveries from './pages/ConserjeDeliveries';
import ResidenteReportes from './pages/ResidenteReportes';
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
                    
                    {/* Ruta del Mantenedor de Usuarios */}
                    <Route path="/admin/usuarios" element={
                        <ProtectedRoute roles={['Administrador']}>
                            <AdminUsuarios />
                        </ProtectedRoute>
                    } /> 

                    <Route path="/admin/productos" element={
                    <ProtectedRoute roles={['Administrador']}>
                            <AdminProductos />
                        </ProtectedRoute>
                    } />
                    
                    {/* Rutas Protegidas - CONSERJE */}
                    <Route path="/conserje" element={
                        <ProtectedRoute roles={['Conserje']}>
                            <DashboardConserje />
                        </ProtectedRoute>
                    } />

                    <Route path="/conserje/deliveries" element={
                        <ProtectedRoute roles={['Conserje']}>
                            <ConserjeDeliveries />
                        </ProtectedRoute>
                    } />

                    <Route path="/residente/reportes" element={
                        <ProtectedRoute roles={['Residente']}>
                            <ResidenteReportes />
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
