import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

function ResidenteReportes() {
    const { usuario } = useAuth();
    const [reportes, setReportes] = useState(() => Storage.get(Storage.KEYS.REPORTES) || []);
    
    // Estados del formulario
    const [tipo, setTipo] = useState('');
    const [prioridad, setPrioridad] = useState('Media');
    const [depto, setDepto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    // Estados para filtros y modales
    const [filtroEstado, setFiltroEstado] = useState('');
    const [modalDetalle, setModalDetalle] = useState(false);
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);

    const fechaActualISO = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const horaActual = () => {
        const d = new Date();
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    // Enviar reporte
    const handleEnviar = (e) => {
        e.preventDefault();

        if (descripcion.length < 20) {
            alert('La descripción debe tener al menos 20 caracteres.');
            return;
        }

        const nuevoReporte = {
            id: 'REP-' + Date.now(),
            rutResidente: usuario.rut,
            nombreResidente: usuario.nombre,
            tipo,
            prioridad,
            depto,
            descripcion,
            fecha: fechaActualISO(),
            hora: horaActual(),
            timestamp: Date.now(),
            estado: 'pendiente'
        };

        const nuevosReportes = [nuevoReporte, ...reportes];
        setReportes(nuevosReportes);
        Storage.save(Storage.KEYS.REPORTES, nuevosReportes);
        Storage.registrarLog(usuario.nombre, 'CREAR_REPORTE', `${tipo} en depto ${depto}`);

        // Notificar a Admin y Conserjes
        const usuarios = Storage.get(Storage.KEYS.USUARIOS) || [];
        usuarios
            .filter(u => u.rol === 'Administrador' || u.rol === 'Conserje')
            .forEach(staff => {
                const notis = Storage.get('condonotify_notificaciones_' + staff.rut) || [];
                notis.push({
                    tipo: 'reporte',
                    mensaje: `📋 Nuevo reporte: ${tipo}`,
                    detalle: `${usuario.nombre} (Depto ${depto}) reportó: "${descripcion.substring(0, 40)}..."`,
                    fecha: nuevoReporte.fecha,
                    leida: false
                });
                Storage.save('condonotify_notificaciones_' + staff.rut, notis);
            });

        // Limpiar
        setTipo('');
        setPrioridad('Media');
        setDepto('');
        setDescripcion('');
        setMensajeExito('✅ Reporte enviado correctamente. Pronto será atendido.');
        setTimeout(() => setMensajeExito(''), 4000);
    };

    // Cancelar reporte
    const cancelarReporte = (id) => {
        if (!window.confirm('¿Cancelar este reporte?')) return;
        const filtrados = reportes.filter(r => r.id !== id);
        setReportes(filtrados);
        Storage.save(Storage.KEYS.REPORTES, filtrados);
    };

    // Filtrar solo los reportes del residente logueado
    const misReportes = reportes.filter(r => r.rutResidente === usuario.rut);
    const reportesFiltrados = misReportes.filter(r => !filtroEstado || r.estado === filtroEstado);

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

    return (
        <>
            <Header volverA="/residente" />
            <main className="main-content">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">✍️ Mis Reportes</h1>
                            <p className="page-subtitle">Total: {misReportes.length} · Pendientes: {misReportes.filter(r => r.estado === 'pendiente').length}</p>
                        </div>
                    </div>

                    <section className="card">
                        <h2 className="section-title">➕ Nuevo Reporte</h2>
                        <form onSubmit={handleEnviar}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tipo de Incidencia *</label>
                                    <select value={tipo} onChange={e => setTipo(e.target.value)} required>
                                        <option value="">-- Seleccione --</option>
                                        <option value="Corte de agua">💧 Corte de agua</option>
                                        <option value="Corte de gas">🔥 Corte de gas</option>
                                        <option value="Corte de luz">💡 Corte de luz</option>
                                        <option value="Mantención">🔧 Mantención</option>
                                        <option value="Ruido">🔊 Ruido excesivo</option>
                                        <option value="Filtración">🚰 Filtración</option>
                                        <option value="Ascensor">🛗 Problema con ascensor</option>
                                        <option value="Limpieza">🧹 Problema de limpieza</option>
                                        <option value="Otros">📋 Otros</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Prioridad *</label>
                                    <select value={prioridad} onChange={e => setPrioridad(e.target.value)} required>
                                        <option value="Baja">🟢 Baja</option>
                                        <option value="Media">🟡 Media</option>
                                        <option value="Alta">🟠 Alta</option>
                                        <option value="Urgente">🔴 Urgente</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Departamento Afectado *</label>
                                <input type="text" value={depto} onChange={e => setDepto(e.target.value)} required placeholder="Ej: 2206" />
                            </div>
                            <div className="form-group">
                                <label>Descripción del Problema *</label>
                                <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} required rows="4" placeholder="Mínimo 20 caracteres, máximo 500..."></textarea>
                                <small className="form-hint">{descripcion.length}/500 caracteres</small>
                            </div>
                            <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
                                <button type="submit" className="btn btn-primary">📤 Enviar Reporte</button>
                            </div>
                            {mensajeExito && <div className="alert alert-success" style={{ marginTop: '15px' }}>{mensajeExito}</div>}
                        </form>
                    </section>

                    <section className="card">
                        <div className="form-group" style={{ maxWidth: '300px', marginBottom: '20px' }}>
                            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
                                <option value="">Todos los estados</option>
                                <option value="pendiente">⏳ Pendientes</option>
                                <option value="en_proceso">🔧 En proceso</option>
                                <option value="resuelto">✅ Resueltos</option>
                            </select>
                        </div>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Tipo</th>
                                        <th>Prioridad</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportesFiltrados.length === 0 ? (
                                        <tr><td colSpan="5" style={{textAlign: 'center'}}>No tienes reportes.</td></tr>
                                    ) : (
                                        reportesFiltrados.map(r => (
                                            <tr key={r.id}>
                                                <td>{r.fecha} <br/><small>{r.hora}</small></td>
                                                <td>{r.tipo}</td>
                                                <td><span className={getPrioridadClass(r.prioridad)}>{r.prioridad}</span></td>
                                                <td><span className={getEstadoClass(r.estado)}>{r.estado}</span></td>
                                                <td className="actions-cell">
                                                    <button className="btn-icon btn-view" onClick={() => { setReporteSeleccionado(r); setModalDetalle(true); }}>👁️</button>
                                                    {r.estado === 'pendiente' && (
                                                        <button className="btn-icon btn-delete" onClick={() => cancelarReporte(r.id)}>🗑️</button>
                                                    )}
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

            {/* Modal Detalle */}
            {modalDetalle && reporteSeleccionado && (
                <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <h2>📄 Detalle del Reporte</h2>
                        <p><strong>Tipo:</strong> {reporteSeleccionado.tipo}</p>
                        <p><strong>Prioridad:</strong> {reporteSeleccionado.prioridad}</p>
                        <p><strong>Descripción:</strong> {reporteSeleccionado.descripcion}</p>
                        {reporteSeleccionado.comentarioAdmin && (
                            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px' }}>
                                <strong>Respuesta Admin:</strong><br/>
                                {reporteSeleccionado.comentarioAdmin}
                            </div>
                        )}
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setModalDetalle(false)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default ResidenteReportes;