import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';
import { validarRUT, validarEmail, validarPassword } from '../utils/validaciones';

function Registro() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        rut: '', nombre: '', email: '', password: '', confirmPassword: '', telefono: ''
    });
    const [errores, setErrores] = useState({});
    const [mensajeExito, setMensajeExito] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegistro = (e) => {
        e.preventDefault();
        const nuevosErrores = {};

        if (!validarRUT(form.rut)) nuevosErrores.rut = 'RUT inválido.';
        if (form.nombre.length < 3) nuevosErrores.nombre = 'El nombre es muy corto.';
        if (!validarEmail(form.email)) nuevosErrores.email = 'Correo no permitido o inválido.';
        if (!validarPassword(form.password)) nuevosErrores.password = 'Contraseña inválida (6-12 chars, 1 número, 1 letra).';
        if (form.password !== form.confirmPassword) nuevosErrores.confirmPassword = 'Las contraseñas no coinciden.';

        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        const usuarios = Storage.get(Storage.KEYS.USUARIOS) || [];
        if (usuarios.some(u => u.rut === form.rut)) return setErrores({ rut: 'Este RUT ya está registrado.' });
        if (usuarios.some(u => u.email === form.email)) return setErrores({ email: 'Este correo ya está registrado.' });

        const nuevoUsuario = {
            rut: form.rut,
            nombre: form.nombre,
            email: form.email,
            password: form.password,
            telefono: form.telefono,
            rol: 'Residente',
            fechaRegistro: new Date().toISOString()
        };

        Storage.save(Storage.KEYS.USUARIOS, [...usuarios, nuevoUsuario]);
        Storage.registrarLog(nuevoUsuario.nombre, 'REGISTRO', 'Nuevo usuario registrado');

        setMensajeExito('✅ ¡Registro exitoso! Redirigiendo al login...');
        
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-200">
            <Header mostrarUsuario={false} />
            
            <main className="flex-1 flex items-center justify-center p-4 py-10">
                <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none w-full max-w-lg border border-slate-100 dark:border-slate-700">
                    
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Crear Cuenta</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Únete a la comunidad de CondoNotify</p>
                    </div>

                    <form onSubmit={handleRegistro} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="rut" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">RUT *</label>
                                <input id="rut" type="text" name="rut" value={form.rut} onChange={handleChange} placeholder="Ej: 19011022K" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                {errores.rut && <p className="text-red-500 text-xs mt-1">{errores.rut}</p>}
                            </div>
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nombre Completo *</label>
                                <input id="nombre" type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Correo Electrónico *</label>
                            <input id="email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            {errores.email && <p className="text-red-500 text-xs mt-1">{errores.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="telefono" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Teléfono</label>
                            <input id="telefono" type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+56912345678" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Contraseña *</label>
                                <input id="password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                {errores.password && <p className="text-red-500 text-xs mt-1">{errores.password}</p>}
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Confirmar *</label>
                                <input id="confirmPassword" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                {errores.confirmPassword && <p className="text-red-500 text-xs mt-1">{errores.confirmPassword}</p>}
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 mt-4">
                            Registrarme
                        </button>
                        
                        {mensajeExito && <div className="p-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-sm font-medium text-center mt-4">{mensajeExito}</div>}
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        ¿Ya tienes cuenta? <Link to="/" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Inicia sesión</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Registro;