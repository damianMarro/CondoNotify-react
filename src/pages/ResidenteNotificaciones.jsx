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

    // Guardar cambios en LocalStorage
    const actualizarNotificaciones = (nuevas) => {
        setNotificaciones(nuevas);
        Storage.save(NOTIF_KEY, nuevas);
    };

    // Marcar una como leída
    const marcarLeida = (index) => {
        const nuevas = [...notificaciones];
        nuevas[index].leida = true;
        actualizarNotificaciones(nuevas);
    };

    // Marcar todas como leídas
    const marcarTodasLeidas = () => {
        const nuevas = notificaciones.map(n => ({ ...n, leida: true }));
        actualizarNotificaciones(nuevas);
    };

    // Eliminar notificación
    const eliminarNotificacion = (index) => {
        if (!window.confirm('¿Eliminar esta notificación?')) return;
        const nuevas = notificaciones.filter((_, i) => i !== index);
        actualizarNotificaciones(nuevas);
    };

    // Helpers visuales
    const infoTipo = (tipo) => {
        const tipos = {
            'delivery': { icono: '📦', etiqueta: 'Delivery', clase: 'notif-delivery' },
            'invitado': { icono: '🚶', etiqueta: 'Invitado', clase: 'notif-invitado' },
            'anuncio': { icono: '📢', etiqueta: 'Anuncio', clase: 'notif-anuncio' },
            'reporte': { icono: '📋', etiqueta: 'Reporte', clase: 'notif-reporte' },
            'reporte_actualizado': { icono: '🔧', etiqueta: 'Reporte Actualizado', clase: 'notif-reporte' }
        };
        return tipos[tipo] || { icono: '🔔', etiqueta: 'Aviso', clase: 'notif-default' };
    };

    // Filtros
    const notificacionesFiltradas = notificaciones
        .filter(n => !filtroTipo || n.tipo === filtroTipo)
        .filter(n => !filtroEstado || (filtroEstado === 'no_leida' && !n.leida) || (filtroEstado === 'leida' && n.leida))
        .sort((a, b) => {
            if (a.leida !== b.leida) return a.leida ? 1 : -1;
            return b.timestamp - a.timestamp;
        });

    const noLeidas = notificaciones.filter(n => !n.leida).length;

    return (
        <>
            <Header volverA="/residente" />
            <main className="main-content">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">
                                🔔 Mis Notificaciones 
                                {noLeidas > 0 && <span className="badge-notif">{noLeidas}</span>}
                            </h1>
                            <p className="page-subtitle">Total: {notificaciones.length} · No leídas: {noLeidas}</p>
                        </div>
                        <button 
                            className="btn btn-primary" 
                            onClick={marcarTodasLeidas}
                            disabled={noLeidas === 0}
                            style={{ opacity: noLeidas === 0 ? 0.5 : 1 }}
                        >
                            ✅ Marcar todas como leídas
                        </button>
                    </div>

                    <section className="card filters-card">
                        <div className="filters-grid">
                            <div className="form-group">
                                <label>Filtrar por Tipo</label>
                                <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
                                    <option value="">Todos los tipos</option>
                                    <option value="delivery">📦 Deliveries</option>
                                    <option value="anuncio">📢 Anuncios</option>
                                    <option value="reporte_actualizado">🔧 Reportes</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Filtrar por Estado</label>
                                <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
                                    <option value="">Todas</option>
                                    <option value="no_leida">🔴 No leídas</option>
                                    <option value="leida">✅ Leídas</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <div className="notificaciones-lista">
                        {notificacionesFiltradas.length === 0 ? (
                            <div className="empty-state">
                                <p>📭 No tienes notificaciones con esos filtros.</p>
                            </div>
                        ) : (
                            notificacionesFiltradas.map((n, index) => {
                                const info = infoTipo(n.tipo);
                                return (
                                    <div 
                                        key={index} 
                                        className={`notif-card ${info.clase} ${n.leida ? 'notif-leida' : 'notif-no-leida'}`}
                                        onClick={() => !n.leida && marcarLeida(notificaciones.indexOf(n))}
                                        style={{ cursor: n.leida ? 'default' : 'pointer' }}
                                    >
                                        <div className="notif-icono">{info.icono}</div>
                                        <div className="notif-contenido">
                                            <div className="notif-header">
                                                <span className="notif-tipo">{info.etiqueta}</span>
                                                {!n.leida && <span className="notif-nuevo">NUEVO</span>}
                                                <span className="notif-fecha">{n.fecha}</span>
                                            </div>
                                            <h4 className="notif-mensaje">{n.mensaje}</h4>
                                            {n.detalle && <p className="notif-detalle">{n.detalle}</p>}
                                        </div>
                                        <div className="notif-acciones">
                                            {!n.leida && (
                                                <button 
                                                    className="btn-icon" 
                                                    title="Marcar como leída"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Evita que se active el clic de la tarjeta
                                                        marcarLeida(notificaciones.indexOf(n));
                                                    }}
                                                >✅</button>
                                            )}
                                            <button 
                                                className="btn-icon btn-delete" 
                                                title="Eliminar"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    eliminarNotificacion(notificaciones.indexOf(n));
                                                }}
                                            >🗑️</button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default ResidenteNotificaciones;