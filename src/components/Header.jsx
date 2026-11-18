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
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img 
                        src="/img/CondoNotifyLogo.png" 
                        alt="Logo CondoNotify" 
                        className="h-8 w-auto"
                    />
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight hidden sm:block">
                        CondoNotify
                    </span>
                </Link>

                {/* Navegación / Usuario */}
                <nav className="flex items-center gap-3 sm:gap-4">
                    {mostrarUsuario && usuario && (
                        <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-600">
                            <span className="text-slate-400 dark:text-slate-300">👤</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{usuario.nombre}</span>
                        </div>
                    )}

                    {volverA && (
                        <Link 
                            to={volverA} 
                            className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                        >
                            ← Volver
                        </Link>
                    )}

                    {usuario && (
                        <button 
                            onClick={handleLogout} 
                            className="text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
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