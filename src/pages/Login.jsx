import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validarRUT, validarPassword } from '../utils/validaciones';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Login() {
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [errores, setErrores] = useState({});
    const { login } = useAuth();
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const nuevosErrores = {};

        if (!validarRUT(rut)) {
            nuevosErrores.rut = 'RUT inválido. Entre 7 y 9 caracteres, sin puntos ni guion, DV correcto.';
        }
        if (!validarPassword(password)) {
            nuevosErrores.password = 'Contraseña inválida. Entre 6 y 12 caracteres, al menos 1 número y 1 letra.';
        }

        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        const resultado = login(rut, password);

        if (resultado.exito) {
            const rutas = {
                'Administrador': '/admin',
                'Conserje': '/conserje',
                'Residente': '/residente'
            };
            navigate(rutas[resultado.rol]);
        } else {
            setErrores({ general: 'RUT o contraseña incorrectos. Verifique sus datos.' });
        }
    }

    // Estilos en línea para forzar el diseño y evitar problemas con Tailwind
    const cardStyle = {
        backgroundColor: '#1e293b', 
        padding: '40px',            
        borderRadius: '16px',       
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', 
        width: '100%',
        maxWidth: '420px',
        border: '1px solid #334155'
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',       
        borderRadius: '8px',
        backgroundColor: '#0f172a', // Fondo más oscuro para el input
        color: 'white',
        border: '1px solid #475569',
        marginBottom: '5px',
        outline: 'none',
        fontSize: '15px'
    };

    const labelStyle = {
        display: 'block', 
        color: '#cbd5e1', 
        fontSize: '14px', 
        fontWeight: '600', 
        marginBottom: '8px'
    };

    return (
        <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header mostrarUsuario={false} />
            
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px' }}>
                
                <div style={cardStyle}>
                    
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                            Bienvenido de nuevo
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                            Ingresa tus credenciales para acceder
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        <div>
                            <label style={labelStyle}>RUT</label>
                            <input
                                type="text"
                                value={rut}
                                onChange={(e) => setRut(e.target.value)}
                                placeholder="Ej: 19011022K"
                                style={inputStyle}
                            />
                            {errores.rut && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>{errores.rut}</p>}
                        </div>

                        <div>
                            <label style={labelStyle}>Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={inputStyle}
                            />
                            {errores.password && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>{errores.password}</p>}
                        </div>

                        {errores.general && (
                            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#fca5a5', padding: '12px', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
                                {errores.general}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            style={{ 
                                width: '100%', 
                                backgroundColor: '#7b8db6', 
                                color: 'white', 
                                fontWeight: 'bold', 
                                padding: '14px', 
                                borderRadius: '8px', 
                                border: 'none', 
                                cursor: 'pointer',
                                marginTop: '10px',
                                fontSize: '16px',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Ingresar al sistema
                        </button>
                    </form>

                    <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
                        ¿No tienes cuenta?{' '}
                        <Link to="/registro" style={{ color: '#60a5fa', fontWeight: 'bold', textDecoration: 'none' }}>
                            Regístrate aquí
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Login;