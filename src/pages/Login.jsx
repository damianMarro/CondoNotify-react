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

    return (
        <>
            <Header mostrarUsuario={false} />
            <main className="main-content">
                <section className="login-section">
                    <div className="card login-card">
                        <h1 className="card-title">Iniciar Sesión</h1>
                        <p className="card-subtitle">Ingresa tus credenciales para acceder al sistema</p>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="form-group">
                                <label htmlFor="rut">RUT (sin puntos ni guion)</label>
                                <input
                                    type="text"
                                    id="rut"
                                    value={rut}
                                    onChange={(e) => setRut(e.target.value)}
                                    placeholder="Ej: 19011022K"
                                />
                                {errores.rut && <span className="error-message">{errores.rut}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Ingresa tu contraseña"
                                />
                                {errores.password && <span className="error-message">{errores.password}</span>}
                            </div>

                            {errores.general && <span className="error-message" style={{ display: 'block', textAlign: 'center' }}>{errores.general}</span>}

                            <button type="submit" className="btn btn-primary btn-block">Ingresar</button>
                        </form>

                        <div className="login-links">
                            <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default Login;