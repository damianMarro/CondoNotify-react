import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

function ResidenteReportes() {
    const { usuario } = useAuth();
    const [reportes, setReportes] = useState(() => Storage.get(Storage.KEYS.REPORTES) || []);
    
    const [tipo, setTipo] = useState('');
    const [prioridad, setPrioridad] = useState('Media');
    const [depto, setDepto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    
    const [filtroEstado, setFiltroEstado] = useState('');
    const [modalDetalle, setModalDetalle] = useState(false);
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);

    // Accesibilidad: Cerrar modal con 'Escape'
    useEffect(() => {
        const handleKeyDown = (e) => { if (e.key === 'Escape') setModalDetalle(false); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const fechaActualISO = () => new Date().toISOString().split('T')[0];
    const horaActual = () => new Date().toTimeString().substring(0, 5);

    const handleEnviar = (e) => {
        e.preventDefault();
        if (descripcion.length < 20) return alert('La descripción debe tener al menos 20 caracteres.');

        const nuevoReporte = {
            id: 'REP-' + Date.now(),
            rutResidente: usuario.rut,
            nombreResidente: usuario.nombre,
            tipo, prioridad, depto, descripcion,
            fecha: fechaActualISO(),
            hora: horaActual(),
            timestamp: Date.now(),
            estado: 'pendiente'
        };

        const nuevosReportes = [nuevoReporte, ...reportes];
        setReportes(nuevosReportes);
        Storage.save(Storage.KEYS.REPORTES, nuevosReportes);
        Storage.registrarLog(usuario.nombre, 'CREAR_REPORTE', `${tipo} en depto ${depto}`);

        const usuarios = Storage.get(Storage.KEYS.USUARIOS) || [];
        usuarios.filter(u => u.rol === 'Administrador' || u.rol === 'Conserje').forEach(staff => {
            const notis = Storage.get('condonotify_notificaciones_' + staff.rut) || [];
            notis.push({ tipo: 'reporte', mensaje: `📋 Nuevo reporte: ${tipo}`, detalle: `${usuario.nombre} (Depto ${depto}) reportó: "${descripcion.substring(0, 40)}..."`, fecha: nuevoReporte.fecha, leida: false });
            Storage.save('condonotify_notificaciones_' + staff.rut, notis);
        });

        setTipo(''); setPrioridad('Media'); setDepto(''); setDescripcion('');
        setMensajeExito('✅ Reporte enviado correctamente.');
        setTimeout(() => setMensajeExito(''), 4000);
    };

    const cancelarReporte = (id) => {
        if (!window.confirm('¿Cancelar este reporte?')) return;
        const filtrados = reportes.filter(r => r.id !== id);
        setReportes(filtrados);
        Storage.save(Storage.KEYS.REPORTES, filtrados);
    };

    const misReportes = reportes.filter(r => r.rutResidente === usuario.rut);
    const reportesFiltrados = misReportes.filter(r => !filtroEstado || r.estado === filtroEstado);

    const getPrioridadClass = (p) => {
        if (p === 'Urgente') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        if (p === 'Alta') return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
        if (p === 'Media') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    };

    const getEstadoClass = (e) => {
        if (e === 'pendiente') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
        if (e === 'en_proceso') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-200">
            <Header volverA="/residente" />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">✍️ Mis Reportes</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Envía y revisa el estado de tus incidencias</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario */}
                    <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">➕ Nuevo Reporte</h2>
                        <form onSubmit={handleEnviar} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo</label>
                                <select value={tipo} onChange={e => setTipo(e.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">-- Seleccione --</option>
                                    <option value="Corte de agua">💧 Corte de agua</option>
                                    <option value="Ruido">🔊 Ruido excesivo</option>
                                    <option value="Filtración">🚰 Filtración</option>
                                    <option value="Ascensor">🛗 Ascensor</option>
                                    <option value="Limpieza">🧹 Limpieza</option>
                                    <option value="Otros">📋 Otros</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prioridad</label>
                                <select value={prioridad} onChange={e => setPrioridad(e.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="Baja">🟢 Baja</option>
                                    <option value="Media">🟡 Media</option>
                                    <option value="Alta">🟠 Alta</option>
                                    <option value="Urgente">🔴 Urgente</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Departamento</label>
                                <input type="text" value={depto} onChange={e => setDepto(e.target.value)} required placeholder="Ej: 2206" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                                <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} required rows="3" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="Mínimo 20 caracteres..."></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all">Enviar Reporte</button>
                            {mensajeExito && <div className="p-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-sm font-medium">{mensajeExito}</div>}
                        </form>
                    </div>

                    {/* Tabla */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="w-full sm:w-1/2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none">
                                <option value="">Todos los estados</option>
                                <option value="pendiente">⏳ Pendientes</option>
                                <option value="en_proceso">🔧 En proceso</option>
                                <option value="resuelto">✅ Resueltos</option>
                            </select>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Problema</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Prioridad</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Estado</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {reportesFiltrados.map(r => (
                                        <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-slate-800 dark:text-white">{r.tipo}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{r.fecha}</div>
                                            </td>
                                            <td className="px-6 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioridadClass(r.prioridad)}`}>{r.prioridad}</span></td>
                                            <td className="px-6 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoClass(r.estado)}`}>{r.estado}</span></td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <button onClick={() => { setReporteSeleccionado(r); setModalDetalle(true); }} className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors" aria-label="Ver detalle">👁️</button>
                                                {r.estado === 'pendiente' && (
                                                    <button onClick={() => cancelarReporte(r.id)} className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors" aria-label="Cancelar">🗑️</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL DETALLE */}
            {modalDetalle && reporteSeleccionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" role="dialog" aria-modal="true">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">📄 Detalle del Reporte</h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-2"><strong>Tipo:</strong> {reporteSeleccionado.tipo}</p>
                        <p className="text-slate-600 dark:text-slate-300 mb-4"><strong>Descripción:</strong> {reporteSeleccionado.descripcion}</p>
                        {reporteSeleccionado.comentarioAdmin && (
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                                <p className="text-sm text-blue-800 dark:text-blue-300"><strong>Respuesta Admin:</strong> {reporteSeleccionado.comentarioAdmin}</p>
                            </div>
                        )}
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setModalDetalle(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default ResidenteReportes;