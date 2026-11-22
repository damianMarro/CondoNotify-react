import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

function AdminReportes() {
    const { usuario } = useAuth();
    const [reportes, setReportes] = useState(() => Storage.get(Storage.KEYS.REPORTES) || []);
    const [filtroEstado, setFiltroEstado] = useState('');
    
    // Estados para el modal
    const [modalAbierto, setModalAbierto] = useState(false);
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState('');
    const [comentario, setComentario] = useState('');

    // Helpers visuales
    const getPrioridadClass = (p) => {
        if (p === 'Urgente') return 'badge badge-prio-urgente';
        if (p === 'Alta') return 'badge badge-prio-alta';
        if (p === 'Media') return 'badge badge-prio-media';
        return 'badge badge-prio-baja';
    };

    const getEstadoClass = (e) => {
        if (e === 'pendiente') return 'badge badge-conserje';
        if (e === 'en_proceso') return 'badge badge-admin';
        return 'badge badge-residente';
    };

    // Abrir modal para gestionar
    const abrirGestion = (reporte) => {
        setReporteSeleccionado(reporte);
        setNuevoEstado(reporte.estado);
        setComentario(reporte.comentarioAdmin || '');
        setModalAbierto(true);
    };

    // Guardar cambios de estado
    const guardarCambios = (e) => {
        e.preventDefault();
        
        const reportesActualizados = reportes.map(r => {
            if (r.id === reporteSeleccionado.id) {
                return {
                    ...r,
                    estado: nuevoEstado,
                    comentarioAdmin: comentario,
                    fechaResolucion: nuevoEstado === 'resuelto' ? new Date().toISOString().split('T')[0] : r.fechaResolucion
                };
            }
            return r;
        });

        setReportes(reportesActualizados);
        Storage.save(Storage.KEYS.REPORTES, reportesActualizados);
        
        Storage.registrarLog(usuario.nombre, 'CAMBIAR_ESTADO_REPORTE', `ID: ${reporteSeleccionado.id} a ${nuevoEstado}`);

        // Notificar al residente
        const notis = Storage.get('condonotify_notificaciones_' + reporteSeleccionado.rutResidente) || [];
        notis.push({
            tipo: 'reporte_actualizado',
            mensaje: `📋 Tu reporte cambió a: ${nuevoEstado.replace('_', ' ')}`,
            detalle: comentario || `Estado actualizado por ${usuario.nombre}`,
            fecha: new Date().toISOString().split('T')[0],
            leida: false
        });
        Storage.save('condonotify_notificaciones_' + reporteSeleccionado.rutResidente, notis);

        setModalAbierto(false);
    };

    // Filtros
    const reportesFiltrados = reportes.filter(r => !filtroEstado || r.estado === filtroEstado);

    return (
        <>
            <Header volverA={usuario.rol === 'Administrador' ? '/admin' : '/conserje'} />
            <main className="main-content">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">📋 Gestión de Reportes</h1>
                            <p className="page-subtitle">
                                Total: <strong>{reportes.length}</strong> · 
                                Pendientes: <strong>{reportes.filter(r => r.estado === 'pendiente').length}</strong>
                            </p>
                        </div>
                    </div>

                    <section className="card filters-card">
                        <div className="form-group" style={{ maxWidth: '300px' }}>
                            <label>Filtrar por Estado</label>
                            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
                                <option value="">Todos los estados</option>
                                <option value="pendiente">⏳ Pendientes</option>
                                <option value="en_proceso">🔧 En proceso</option>
                                <option value="resuelto">✅ Resueltos</option>
                            </select>
                        </div>
                    </section>

                    <section className="card">
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Residente</th>
                                        <th>Tipo</th>
                                        <th>Prioridad</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportesFiltrados.length === 0 ? (
                                        <tr><td colSpan="6" style={{textAlign: 'center'}}>No hay reportes registrados.</td></tr>
                                    ) : (
                                        reportesFiltrados.map(r => (
                                            <tr key={r.id} className={r.prioridad === 'Urgente' && r.estado !== 'resuelto' ? 'row-urgent' : ''}>
                                                <td>{r.fecha}<br/><small>{r.hora}</small></td>
                                                <td>{r.nombreResidente}<br/><small>{r.depto}</small></td>
                                                <td>{r.tipo}</td>
                                                <td><span className={getPrioridadClass(r.prioridad)}>{r.prioridad}</span></td>
                                                <td><span className={getEstadoClass(r.estado)}>{r.estado}</span></td>
                                                <td>
                                                    <button className="btn btn-secondary btn-sm" onClick={() => abrirGestion(r)}>
                                                        🔧 Gestionar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>

            {/* Modal de Gestión */}
            {modalAbierto && reporteSeleccionado && (
                <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content modal-large">
                        <h2>🔧 Gestionar Reporte</h2>
                        
                        <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                            <p><strong>Residente:</strong> {reporteSeleccionado.nombreResidente} (Depto {reporteSeleccionado.depto})</p>
                            <p><strong>Problema:</strong> {reporteSeleccionado.tipo}</p>
                            <p><strong>Descripción:</strong> {reporteSeleccionado.descripcion}</p>
                        </div>

                        <form onSubmit={guardarCambios}>
                            <div className="form-group">
                                <label>Nuevo Estado *</label>
                                <select value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)} required>
                                    <option value="pendiente">⏳ Pendiente</option>
                                    <option value="en_proceso">🔧 En proceso</option>
                                    <option value="resuelto">✅ Resuelto</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Comentario para el Residente</label>
                                <textarea 
                                    value={comentario} 
                                    onChange={e => setComentario(e.target.value)} 
                                    rows="3" 
                                    placeholder="Ej: Se enviará un técnico mañana a primera hora..."
                                ></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Actualizar Reporte</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default AdminReportes;