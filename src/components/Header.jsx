import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header({ volverA = null, mostrarUsuario = true }) {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img 
                        src="/img/CondoNotifyLogo.png" 
                        alt="Logo" 
                        className="h-8 w-auto"
                    />
                    <span className="text-xl font-bold text-blue-600 tracking-tight">CondoNotify</span>
                </Link>

                {/* Navegación / Usuario */}
                <nav className="flex items-center gap-4">
                    {mostrarUsuario && usuario && (
                        <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            <span className="text-slate-400">👤</span>
                            <span className="text-sm font-medium text-slate-700">{usuario.nombre}</span>
                        </div>
                    )}

                    {volverA && (
                        <Link to={volverA} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                            ← Volver
                        </Link>
                    )}

                    {usuario && (
                        <button 
                            onClick={handleLogout} 
                            className="text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;