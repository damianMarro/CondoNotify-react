import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header({ volverA = null, mostrarUsuario = true }) {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    function handleLogout() {
        logout();
        navigate('/');
    }

    // Si estamos en el login (no mostrarUsuario), no mostramos el botón de cerrar sesión
    const mostrarBotonLogout = usuario && mostrarUsuario;

    return (
        <header 
            className={`bg-slate-900/80 backdrop-blur-md border-b border-slate-800 fixed top-0 w-full z-50 transition-transform duration-300 ease-in-out ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                
                {/* Logo con tamaño estricto (h-10) */}
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <img 
                        src="/img/CondoNotifyLogo.png" 
                        alt="Logo CondoNotify" 
                        style={{ height: '40px', width: 'auto' }} // Forzamos el tamaño para evitar que se deforme
                    />
                    <span className="text-2xl font-bold text-blue-500 tracking-tight">
                        CondoNotify
                    </span>
                </Link>

                <nav className="flex items-center gap-4">
                    {/* Nombre del usuario (solo si está logueado) */}
                    {mostrarUsuario && usuario && (
                        <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
                            <span className="text-slate-300">👤</span>
                            <span className="text-sm font-medium text-slate-200">{usuario.nombre}</span>
                        </div>
                    )}

                    {volverA && (
                        <Link to={volverA} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            ← Volver
                        </Link>
                    )}

                    {/* Botón de logout solo si corresponde */}
                    {mostrarBotonLogout && (
                        <button 
                            onClick={handleLogout} 
                            className="text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-lg transition-colors border border-slate-700"
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