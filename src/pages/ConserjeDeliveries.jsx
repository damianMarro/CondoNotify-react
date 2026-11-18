import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';

function ConserjeDeliveries() {
    const [deliveries, setDeliveries] = useState(() => Storage.get(Storage.KEYS.DELIVERIES) || []);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    // Estado para el formulario
    const [nuevoDelivery, setNuevoDelivery] = useState({
        destinatario: '',
        depto: '',
        tipo: 'Encomienda',
        empresa: '',
        observaciones: ''
    });

    // Fecha actual para el encabezado
    const hoy = new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Helpers de fecha y hora
    const fechaActualISO = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    
    const horaActual = () => {
        const d = new Date();
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    // Registrar un delivery
    const handleRegistrar = (e) => {
        e.preventDefault();
        
        if (!nuevoDelivery.destinatario || !nuevoDelivery.depto) {
            alert('Por favor complete destinatario y departamento.');
            return;
        }

        const deliveryAGuardar = {
            id: 'DEL-' + Date.now(),
            ...nuevoDelivery,
            fecha: fechaActualISO(),
            hora: horaActual(),
            timestamp: Date.now(),
            estado: 'pendiente',
            registradoPor: 'Conserje'
        };

        const nuevosDeliveries = [deliveryAGuardar, ...deliveries];
        setDeliveries(nuevosDeliveries);
        Storage.save(Storage.KEYS.DELIVERIES, nuevosDeliveries);
        Storage.registrarLog('Conserje', 'REGISTRAR_DELIVERY', `Para depto ${nuevoDelivery.depto}`);

        // Notificar al residente si existe
        const usuarios = Storage.get(Storage.KEYS.USUARIOS) || [];
        const residente = usuarios.find(u => 
            u.rol === 'Residente' && 
            (u.direccion || '').toLowerCase().includes(nuevoDelivery.depto.toLowerCase())
        );

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

        // Limpiar formulario y mostrar éxito
        setNuevoDelivery({ destinatario: '', depto: '', tipo: 'Encomienda', empresa: '', observaciones: '' });
        setMensajeExito(`✅ Delivery registrado para el depto ${deliveryAGuardar.depto}.`);
        setTimeout(() => setMensajeExito(''), 3000);
    };

    // Marcar como entregado
    const marcarEntregado = (id) => {
        if (!window.confirm('¿Confirmas que este delivery fue entregado?')) return;
        const actualizados = deliveries.map(d => 
            d.id === id ? { ...d, estado: 'entregado', horaEntrega: horaActual() } : d
        );
        setDeliveries(actualizados);
        Storage.save(Storage.KEYS.DELIVERIES, actualizados);
        Storage.registrarLog('Conserje', 'ENTREGAR_DELIVERY', `ID: ${id}`);
    };

    // Filtros
    const deliveriesHoy = deliveries.filter(d => d.fecha === fechaActualISO());
    const deliveriesFiltrados = deliveriesHoy.filter(d => {
        const coincideBusqueda = !busqueda || 
            d.destinatario.toLowerCase().includes(busqueda.toLowerCase()) ||
            d.depto.toLowerCase().includes(busqueda.toLowerCase());
        const coincideEstado = !filtroEstado || d.estado === filtroEstado;
        return coincideBusqueda && coincideEstado;
    });

    return (
        <>
            <Header volverA="/conserje" />
            <main className="main-content">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">📦 Registro de Deliveries</h1>
                            <p className="page-subtitle">
                                {hoy} · Pendientes: <strong>{deliveriesHoy.filter(d => d.estado === 'pendiente').length}</strong> · 
                                Entregados: <strong>{deliveriesHoy.filter(d => d.estado === 'entregado').length}</strong>
                            </p>
                        </div>
                    </div>

                    {/* Formulario */}
                    <section className="card">
                        <h2 className="section-title">➕ Nuevo Delivery</h2>
                        <form onSubmit={handleRegistrar}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Destinatario *</label>
                                    <input type="text" value={nuevoDelivery.destinatario} onChange={e => setNuevoDelivery({...nuevoDelivery, destinatario: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Departamento *</label>
                                    <input type="text" value={nuevoDelivery.depto} onChange={e => setNuevoDelivery({...nuevoDelivery, depto: e.target.value})} placeholder="Ej: 2206" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tipo de Paquete *</label>
                                    <select value={nuevoDelivery.tipo} onChange={e => setNuevoDelivery({...nuevoDelivery, tipo: e.target.value})}>
                                        <option value="Encomienda">📦 Encomienda</option>
                                        <option value="Delivery Comida">🍔 Delivery de Comida</option>
                                        <option value="Documentos">📄 Documentos</option>
                                        <option value="Supermercado">🛒 Supermercado</option>
                                        <option value="Farmacia">💊 Farmacia</option>
                                        <option value="Otros">📬 Otros</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Empresa / Repartidor</label>
                                    <input type="text" value={nuevoDelivery.empresa} onChange={e => setNuevoDelivery({...nuevoDelivery, empresa: e.target.value})} placeholder="Ej: Chilexpress" />
                                </div>
                            </div>
                            <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
                                <button type="submit" className="btn btn-primary">✅ Registrar Delivery</button>
                            </div>
                            {mensajeExito && <div className="alert alert-success" style={{ marginTop: '15px' }}>{mensajeExito}</div>}
                        </form>
                    </section>

                    {/* Tabla */}
                    <section className="card">
                        <div className="filters-grid" style={{ marginBottom: '20px' }}>
                            <div className="form-group">
                                <input type="text" placeholder="🔍 Buscar destinatario o depto..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
                                    <option value="">Todos los estados</option>
                                    <option value="pendiente">⏳ Pendientes</option>
                                    <option value="entregado">✅ Entregados</option>
                                </select>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Hora</th>
                                        <th>Destinatario</th>
                                        <th>Depto</th>
                                        <th>Tipo</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deliveriesFiltrados.length === 0 ? (
                                        <tr><td colSpan="6" style={{textAlign: 'center'}}>No hay deliveries registrados hoy.</td></tr>
                                    ) : (
                                        deliveriesFiltrados.map(d => (
                                            <tr key={d.id} className={d.estado === 'entregado' ? 'row-success' : ''}>
                                                <td><strong>{d.hora}</strong></td>
                                                <td>{d.destinatario}</td>
                                                <td><span className="badge badge-residente">{d.depto}</span></td>
                                                <td>{d.tipo}</td>
                                                <td>
                                                    {d.estado === 'pendiente' ? 
                                                        <span className="badge badge-conserje">⏳ Pendiente</span> : 
                                                        <span className="badge badge-residente">✅ Entregado</span>
                                                    }
                                                </td>
                                                <td>
                                                    {d.estado === 'pendiente' && (
                                                        <button className="btn-icon btn-marcar" title="Marcar entregado" onClick={() => marcarEntregado(d.id)}>✅</button>
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
            <Footer />
        </>
    );
}

export default ConserjeDeliveries;