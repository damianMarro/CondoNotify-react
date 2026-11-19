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

    // Estilos forzados (igual que en el Login)
    const cardStyle = {
        backgroundColor: '#1e293b', 
        padding: '40px',            
        borderRadius: '16px',       
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', 
        width: '100%',
        maxWidth: '550px', // Un poco más ancho para los 2 campos
        border: '1px solid #334155'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',       
        borderRadius: '8px',
        backgroundColor: '#334155',
        color: 'white',
        border: '1px solid #475569',
        outline: 'none'
    };

    const labelStyle = {
        display: 'block', 
        color: '#cbd5e1', 
        fontSize: '14px', 
        fontWeight: '600', 
        marginBottom: '8px'
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
            <Header mostrarUsuario={false} />
            
            <main style={{ paddingTop: '80px', paddingBottom: '40px' }} className="flex-1 flex items-center justify-center p-4">
                
                <div style={cardStyle}>
                    
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                            Crear Cuenta
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                            Únete a la comunidad de CondoNotify
                        </p>
                    </div>

                    <form onSubmit={handleRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        {/* Fila 1: RUT y Nombre */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={labelStyle}>RUT *</label>
                                <input type="text" name="rut" value={form.rut} onChange={handleChange} placeholder="Ej: 19011022K" style={inputStyle} />
                                {errores.rut && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>{errores.rut}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>Nombre Completo *</label>
                                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" style={inputStyle} />
                                {errores.nombre && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>{errores.nombre}</p>}
                            </div>
                        </div>

                        {/* Fila 2: Email */}
                        <div>
                            <label style={labelStyle}>Correo Electrónico *</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" style={inputStyle} />
                            {errores.email && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>{errores.email}</p>}
                        </div>

                        {/* Fila 3: Teléfono */}
                        <div>
                            <label style={labelStyle}>Teléfono</label>
                            <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+56912345678" style={inputStyle} />
                        </div>

                        {/* Fila 4: Contraseñas */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={labelStyle}>Contraseña *</label>
                                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={inputStyle} />
                                {errores.password && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>{errores.password}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>Confirmar *</label>
                                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" style={inputStyle} />
                                {errores.confirmPassword && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>{errores.confirmPassword}</p>}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            style={{ 
                                width: '100%', 
                                backgroundColor: '#2563eb', 
                                color: 'white', 
                                fontWeight: 'bold', 
                                padding: '14px', 
                                borderRadius: '8px', 
                                border: 'none', 
                                cursor: 'pointer',
                                marginTop: '15px',
                                fontSize: '16px'
                            }}
                        >
                            Registrarme
                        </button>
                        
                        {mensajeExito && (
                            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '12px', borderRadius: '8px', fontSize: '14px', textAlign: 'center', marginTop: '10px' }}>
                                {mensajeExito}
                            </div>
                        )}
                    </form>

                    <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
                        ¿Ya tienes cuenta? <Link to="/" style={{ color: '#60a5fa', fontWeight: 'bold', textDecoration: 'none' }}>Inicia sesión</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Registro;