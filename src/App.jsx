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
import Tienda from './pages/Tienda';
import Carrito from './pages/Carrito';
import AdminAnuncios from './pages/AdminAnuncios';
import ResidenteNotificaciones from './pages/ResidenteNotificaciones';
import Registro from './pages/Registro';
import './styles/styles.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Ruta Pública */}
                    <Route path="/" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                    
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

                    <Route path="/admin/anuncios" element={
                    <ProtectedRoute roles={['Administrador']}>
                            <AdminAnuncios />
                        </ProtectedRoute>
                    } />

                    <Route path="/residente/notificaciones" element={
                        <ProtectedRoute roles={['Residente']}>
                            <ResidenteNotificaciones />
                        </ProtectedRoute>
                    } />

                    <Route path="/residente/tienda" element={
                    <ProtectedRoute roles={['Residente']}>
                            <Tienda />
                        </ProtectedRoute>
                    } />

                    <Route path="/residente/carrito" element={
                    <ProtectedRoute roles={['Residente']}>
                            <Carrito />
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
