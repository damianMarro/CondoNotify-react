import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validarRUT, validarPassword } from '../utils/validaciones';
import Header from '../components/Header';

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
            nuevosErrores.rut = 'RUT inválido.';
        }
        if (!validarPassword(password)) {
            nuevosErrores.password = 'Contraseña inválida.';
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
            setErrores({ general: 'RUT o contraseña incorrectos.' });
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header mostrarUsuario={false} />
            
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/50 w-full max-w-md border border-slate-100">
                    
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Bienvenido de nuevo</h1>
                        <p className="text-slate-500 text-sm">Ingresa tus credenciales para acceder</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">RUT</label>
                            <input
                                type="text"
                                value={rut}
                                onChange={(e) => setRut(e.target.value)}
                                placeholder="Ej: 19011022K"
                                className={`w-full px-4 py-3 rounded-xl border ${errores.rut ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            />
                            {errores.rut && <p className="text-red-500 text-xs mt-1.5 font-medium">{errores.rut}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full px-4 py-3 rounded-xl border ${errores.password ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                            />
                            {errores.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errores.password}</p>}
                        </div>

                        {errores.general && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
                                {errores.general}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 mt-2"
                        >
                            Ingresar al sistema
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        ¿No tienes cuenta?{' '}
                        <Link to="/registro" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                            Regístrate aquí
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Login;