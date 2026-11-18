import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

function ConserjeDeliveries() {
    const { usuario } = useAuth();
    const [deliveries, setDeliveries] = useState(() => Storage.get(Storage.KEYS.DELIVERIES) || []);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    const [nuevoDelivery, setNuevoDelivery] = useState({
        destinatario: '',
        depto: '',
        tipo: 'Encomienda',
        empresa: ''
    });

    const fechaActualISO = () => new Date().toISOString().split('T')[0];
    const horaActual = () => new Date().toTimeString().substring(0, 5);
    const hoyString = new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const handleRegistrar = (e) => {
        e.preventDefault();
        if (!nuevoDelivery.destinatario || !nuevoDelivery.depto) return;

        const deliveryAGuardar = {
            id: 'DEL-' + Date.now(),
            ...nuevoDelivery,
            fecha: fechaActualISO(),
            hora: horaActual(),
            timestamp: Date.now(),
            estado: 'pendiente',
            registradoPor: usuario.nombre
        };

        const nuevosDeliveries = [deliveryAGuardar, ...deliveries];
        setDeliveries(nuevosDeliveries);
        Storage.save(Storage.KEYS.DELIVERIES, nuevosDeliveries);
        Storage.registrarLog(usuario.nombre, 'REGISTRAR_DELIVERY', `Para depto ${nuevoDelivery.depto}`);

        const usuarios = Storage.get(Storage.KEYS.USUARIOS) || [];
        const residente = usuarios.find(u => u.rol === 'Residente' && (u.direccion || '').toLowerCase().includes(nuevoDelivery.depto.toLowerCase()));

        if (residente) {
            const notificaciones = Storage.get('condonotify_notificaciones_' + residente.rut) || [];
            notificaciones.push({
                tipo: 'delivery',
                mensaje: `📦 Tienes un ${nuevoDelivery.tipo} en conserjería`,
                detalle: `Empresa: ${nuevoDelivery.empresa || 'No especificada'}. Hora: ${deliveryAGuardar.hora}`,
                fecha: deliveryAGuardar.fecha,
                leida: false
            });
            Storage.save('condonotify_notificaciones_' + residente.rut, notificaciones);
        }

        setNuevoDelivery({ destinatario: '', depto: '', tipo: 'Encomienda', empresa: '' });
        setMensajeExito(`✅ Delivery registrado para el depto ${deliveryAGuardar.depto}.`);
        setTimeout(() => setMensajeExito(''), 3000);
    };

    const marcarEntregado = (id) => {
        if (!window.confirm('¿Confirmas que este delivery fue entregado?')) return;
        const actualizados = deliveries.map(d => d.id === id ? { ...d, estado: 'entregado', horaEntrega: horaActual() } : d);
        setDeliveries(actualizados);
        Storage.save(Storage.KEYS.DELIVERIES, actualizados);
    };

    const deliveriesHoy = deliveries.filter(d => d.fecha === fechaActualISO());
    const deliveriesFiltrados = deliveriesHoy.filter(d => {
        const coincideBusqueda = !busqueda || d.destinatario.toLowerCase().includes(busqueda.toLowerCase()) || d.depto.toLowerCase().includes(busqueda.toLowerCase());
        return coincideBusqueda && (!filtroEstado || d.estado === filtroEstado);
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-200">
            <Header volverA="/conserje" />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">📦 Registro de Deliveries</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 capitalize">{hoyString}</p>
                </div>

                {/* Formulario Moderno */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">➕ Nuevo Delivery</h2>
                    <form onSubmit={handleRegistrar} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Destinatario *</label>
                                <input type="text" value={nuevoDelivery.destinatario} onChange={e => setNuevoDelivery({...nuevoDelivery, destinatario: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Departamento *</label>
                                <input type="text" value={nuevoDelivery.depto} onChange={e => setNuevoDelivery({...nuevoDelivery, depto: e.target.value})} required placeholder="Ej: 2206" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Paquete</label>
                                <select value={nuevoDelivery.tipo} onChange={e => setNuevoDelivery({...nuevoDelivery, tipo: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="Encomienda">📦 Encomienda</option>
                                    <option value="Delivery Comida">🍔 Comida</option>
                                    <option value="Documentos">📄 Documentos</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Empresa / Repartidor</label>
                                <input type="text" value={nuevoDelivery.empresa} onChange={e => setNuevoDelivery({...nuevoDelivery, empresa: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-blue-500">
                                Registrar Delivery
                            </button>
                        </div>
                    </form>
                    {mensajeExito && <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-sm font-medium border border-emerald-100 dark:border-emerald-800">{mensajeExito}</div>}
                </div>

                {/* Tabla Moderna */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
                        <input type="text" placeholder="🔍 Buscar destinatario o depto..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full sm:w-1/2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none" />
                        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="w-full sm:w-1/4 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none">
                            <option value="">Todos</option>
                            <option value="pendiente">⏳ Pendientes</option>
                            <option value="entregado">✅ Entregados</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Hora</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Destinatario</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Depto</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Estado</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {deliveriesFiltrados.map(d => (
                                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-white">{d.hora}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{d.destinatario}</td>
                                        <td className="px-6 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">{d.depto}</span></td>
                                        <td className="px-6 py-4">
                                            {d.estado === 'pendiente' ? 
                                                <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">⏳ Pendiente</span> : 
                                                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">✅ Entregado</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {d.estado === 'pendiente' && (
                                                <button onClick={() => marcarEntregado(d.id)} className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors" aria-label="Marcar entregado">Marcar Entregado</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ConserjeDeliveries;