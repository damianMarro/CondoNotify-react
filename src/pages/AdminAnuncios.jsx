import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

function AdminAnuncios() {
    const { usuario } = useAuth();
    const [anuncios, setAnuncios] = useState(() => Storage.get(Storage.KEYS.ANUNCIOS) || []);
    const [mensajeExito, setMensajeExito] = useState('');
    
    const [form, setForm] = useState({ tipo: 'Informativo', prioridad: 'Normal', titulo: '', mensaje: '' });

    const handleEnviar = (e) => {
        e.preventDefault();
        if (form.mensaje.length < 20) return alert('El mensaje debe tener al menos 20 caracteres.');

        const nuevoAnuncio = {
            id: 'ANU-' + Date.now(),
            ...form,
            fecha: new Date().toISOString().split('T')[0],
            enviadoPor: usuario.nombre,
            timestamp: Date.now()
        };

        const nuevosAnuncios = [nuevoAnuncio, ...anuncios];
        setAnuncios(nuevosAnuncios);
        Storage.save(Storage.KEYS.ANUNCIOS, nuevosAnuncios);

        const usuarios = Storage.get(Storage.KEYS.USUARIOS) || [];
        const residentes = usuarios.filter(u => u.rol === 'Residente');

        residentes.forEach(res => {
            const notis = Storage.get('condonotify_notificaciones_' + res.rut) || [];
            notis.push({ tipo: 'anuncio', mensaje: `📢 ${form.titulo}`, detalle: form.mensaje, fecha: nuevoAnuncio.fecha, leida: false });
            Storage.save('condonotify_notificaciones_' + res.rut, notis);
        });

        Storage.registrarLog(usuario.nombre, 'CREAR_ANUNCIO', form.titulo);
        setForm({ tipo: 'Informativo', prioridad: 'Normal', titulo: '', mensaje: '' });
        setMensajeExito(`✅ Anuncio enviado a ${residentes.length} residentes.`);
        setTimeout(() => setMensajeExito(''), 4000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-200">
            <Header volverA="/admin" />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">📢 Anuncios Masivos</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Envía comunicados a todos los residentes</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulario */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">➕ Crear Anuncio</h2>
                        <form onSubmit={handleEnviar} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo</label>
                                    <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none">
                                        <option value="Informativo">📰 Informativo</option>
                                        <option value="Corte de agua">💧 Corte de agua</option>
                                        <option value="Mantención">🔧 Mantención</option>
                                        <option value="Urgente">🚨 Urgente</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prioridad</label>
                                    <select value={form.prioridad} onChange={e => setForm({...form, prioridad: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none">
                                        <option value="Normal">🟢 Normal</option>
                                        <option value="Importante">🟡 Importante</option>
                                        <option value="Urgente">🔴 Urgente</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título</label>
                                <input type="text" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mensaje</label>
                                <textarea value={form.mensaje} onChange={e => setForm({...form, mensaje: e.target.value})} required rows="4" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all">Enviar a Todos</button>
                            {mensajeExito && <div className="p-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-sm font-medium mt-4">{mensajeExito}</div>}
                        </form>
                    </div>

                    {/* Historial */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">📜 Historial Reciente</h2>
                        {anuncios.map(a => (
                            <div key={a.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 dark:text-white">{a.titulo}</h3>
                                    <span className="text-xs text-slate-400">{a.fecha}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{a.mensaje}</p>
                                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300">Por: {a.enviadoPor}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default AdminAnuncios;