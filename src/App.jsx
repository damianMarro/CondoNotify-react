import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import './styles/styles.css'; // Importante: tu CSS original

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Ruta Pública */}
                    <Route path="/" element={<Login />} />
                    
                    {/* Rutas Protegidas (Por ahora mostramos texto para probar) */}
                    <Route path="/admin" element={<div style={{padding: '50px', textAlign: 'center'}}>Dashboard Admin (Próximamente)</div>} />
                    <Route path="/conserje" element={<div style={{padding: '50px', textAlign: 'center'}}>Dashboard Conserje (Próximamente)</div>} />
                    <Route path="/residente" element={<div style={{padding: '50px', textAlign: 'center'}}>Dashboard Residente (Próximamente)</div>} />
                    
                    {/* Cualquier otra ruta redirige al login */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;