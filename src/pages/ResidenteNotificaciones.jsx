import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

function ResidenteNotificaciones() {
    const { usuario } = useAuth();
    const NOTIF_KEY = 'condonotify_notificaciones_' + usuario.rut;

    const [notificaciones, setNotificaciones] = useState(() => Storage.get(NOTIF_KEY) || []);
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');

    const actualizarNotificaciones = (nuevas) => {
        setNotificaciones(nuevas);
        Storage.save(NOTIF_KEY, nuevas);
    };

    const marcarLeida = (index) => {
        const nuevas = [...notificaciones];
        nuevas[index].leida = true;
        actualizarNotificaciones(nuevas);
    };

    const marcarTodasLeidas = () => {
        const nuevas = notificaciones.map(n => ({ ...n, leida: true }));
        actualizarNotificaciones(nuevas);
    };

    const eliminarNotificacion = (index) => {
        if (!window.confirm('¿Eliminar esta notificación?')) return;
        const nuevas = notificaciones.filter((_, i) => i !== index);
        actualizarNotificaciones(nuevas);
    };

    const infoTipo = (tipo) => {
        const tipos = {
            'delivery': { icono: '📦', etiqueta: 'Delivery', color: 'border-blue-200 dark:border-blue-800' },
            'invitado': { icono: '🚶', etiqueta: 'Invitado', color: 'border-amber-200 dark:border-amber-800' },
            'anuncio': { icono: '📢', etiqueta: 'Anuncio', color: 'border-purple-200 dark:border-purple-800' },
            'reporte': { icono: '📋', etiqueta: 'Reporte', color: 'border-pink-200 dark:border-pink-800' },
            'reporte_actualizado': { icono: '🔧', etiqueta: 'Reporte Actualizado', color: 'border-pink-200 dark:border-pink-800' }
        };
        return tipos[tipo] || { icono: '🔔', etiqueta: 'Aviso', color: 'border-slate-200' };
    };

    const notificacionesFiltradas = notificaciones
        .filter(n => !filtroTipo || n.tipo === filtroTipo)
        .filter(n => !filtroEstado || (filtroEstado === 'no_leida' && !n.leida) || (filtroEstado === 'leida' && n.leida))
        .sort((a, b) => a.leida === b.leida ? b.timestamp - a.timestamp : (a.leida ? 1 : -1));

    const noLeidas = notificaciones.filter(n => !n.leida).length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-200">
            <Header volverA="/residente" />
            
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                            🔔 Mis Notificaciones
                            {noLeidas > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{noLeidas}</span>}
                        </h1>
                    </div>
                    <button 
                        onClick={marcarTodasLeidas} 
                        disabled={noLeidas === 0}
                        className="text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all"
                    >
                        ✅ Marcar todas leídas
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 flex flex-col sm:flex-row gap-4">
                    <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="w-full sm:w-1/2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none">
                        <option value="">Todos los tipos</option>
                        <option value="delivery">📦 Deliveries</option>
                        <option value="anuncio">📢 Anuncios</option>
                        <option value="reporte_actualizado">🔧 Reportes</option>
                    </select>
                    <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="w-full sm:w-1/2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none">
                        <option value="">Todas</option>
                        <option value="no_leida">🔴 No leídas</option>
                        <option value="leida">✅ Leídas</option>
                    </select>
                </div>

                <div className="space-y-3">
                    {notificacionesFiltradas.map((n, index) => {
                        const info = infoTipo(n.tipo);
                        return (
                            <div 
                                key={index} 
                                onClick={() => !n.leida && marcarLeida(notificaciones.indexOf(n))}
                                className={`p-4 rounded-2xl border bg-white dark:bg-slate-800 transition-all cursor-pointer flex gap-4 ${info.color} ${!n.leida ? 'shadow-md border-l-4 border-l-blue-500' : 'opacity-70'}`}
                            >
                                <div className="text-3xl bg-slate-50 dark:bg-slate-700 w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0">{info.icono}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{info.etiqueta}</span>
                                        {!n.leida && <span className="text-xs font-bold text-blue-600 dark:text-blue-400">NUEVO</span>}
                                    </div>
                                    <h4 className="font-semibold text-slate-800 dark:text-white">{n.mensaje}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{n.detalle}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); eliminarNotificacion(notificaciones.indexOf(n)); }} className="text-slate-400 hover:text-red-500 p-1" aria-label="Eliminar">🗑️</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ResidenteNotificaciones;