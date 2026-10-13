import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header ({ volverA = null, mostrarUsuario = true }) {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout(){
        logout();
        navigate('/');
    }
    return (
        <header className="main-header">
            <div className="container header-container">
                <Link to="/" className="logo">
                    <img
                        src="/img/CondoNotifyLogo.png"
                        alt="Logo CondoNotify"
                        className="logo-img"
                    />
                    <span className="logo-text">CondoNotify</span>
                </Link>

                <nav className="nav-user">
                    {mostrarUsuario && usuario && (
                        <span className="user-info">
                            <span className="user-avatar"></span>
                            <span className="user-name">{usuario.nombre}</span>
                        </span>
                    )}

                    {volverA && (
                        <Link to={volverA} className="btn btn-secondary btn-sm">
                           ← Volver 
                        </Link>
                    )}

                    {usuario && (
                        <button onClick={handleLogout} className="btn btn-secondar y btn-sm">
                            cerrar sesion
                        </button>
                    )}
                </nav>
            </div>
        </header>
            
    );
}

export default Header;