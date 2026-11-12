import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';

function AdminUsuarios() {
    // 1. Cargar usuarios desde LocalStorage al iniciar
    const [usuarios, setUsuarios] = useState(() => Storage.get(Storage.KEYS.USUARIOS) || []);
    
    // 2. Estados para filtros
    const [busqueda, setBusqueda] = useState('');
    const [filtroRol, setFiltroRol] = useState('');
    
    // 3. Estados para el modal de eliminación
    const [modalEliminar, setModalEliminar] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

    // 4. Lógica para enmascarar el RUT (Ley 19.628)
    const enmascararRut = (rut) => {
        if (!rut || rut.length < 4) return rut;
        const dv = rut.slice(-1).toUpperCase();
        const cuerpo = rut.slice(0, -1);
        return `${cuerpo.slice(0, 2)}.***.${cuerpo.slice(-2)}-${dv}`;
    };

    // 5. Clases CSS para los badges de rol
    const claseRol = (rol) => {
        if (rol === 'Administrador') return 'badge badge-admin';
        if (rol === 'Conserje') return 'badge badge-conserje';
        return 'badge badge-residente';
    };

    // 6. Filtrar usuarios en tiempo real
    const usuariosFiltrados = usuarios.filter(u => {
        const coincideBusqueda = !busqueda || 
            u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
            u.rut.toLowerCase().includes(busqueda.toLowerCase());
        const coincideRol = !filtroRol || u.rol === filtroRol;
        return coincideBusqueda && coincideRol;
    });

    // 7. Función para eliminar usuario
    const confirmarEliminar = () => {
        if (!usuarioAEliminar) return;
        const nuevosUsuarios = usuarios.filter(u => u.rut !== usuarioAEliminar.rut);
        
        // Actualizar estado y LocalStorage
        setUsuarios(nuevosUsuarios);
        Storage.save(Storage.KEYS.USUARIOS, nuevosUsuarios);
        Storage.registrarLog('Admin', 'ELIMINAR_USUARIO', `Eliminado: ${usuarioAEliminar.nombre}`);
        
        // Cerrar modal
        setModalEliminar(false);
        setUsuarioAEliminar(null);
    };

    return (
        <>
            <Header volverA="/admin" />
            <main className="main-content">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">👥 Gestión de Usuarios</h1>
                            <p className="page-subtitle">Total: <strong>{usuariosFiltrados.length}</strong> usuarios</p>
                        </div>
                    </div>

                    {/* Filtros */}
                    <section className="card filters-card">
                        <div className="filters-grid">
                            <div className="form-group">
                                <label>🔍 Buscar</label>
                                <input 
                                    type="text" 
                                    placeholder="Nombre, RUT o email..." 
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Filtrar por Rol</label>
                                <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
                                    <option value="">Todos los roles</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Conserje">Conserje</option>
                                    <option value="Residente">Residente</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Tabla */}
                    <section className="card">
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>RUT</th>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Rol</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuariosFiltrados.length === 0 ? (
                                        <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No se encontraron usuarios.</td></tr>
                                    ) : (
                                        usuariosFiltrados.map(u => (
                                            <tr key={u.rut}>
                                                <td>{enmascararRut(u.rut)}</td>
                                                <td>{u.nombre}</td>
                                                <td>{u.email}</td>
                                                <td>{u.telefono || '—'}</td>
                                                <td><span className={claseRol(u.rol)}>{u.rol}</span></td>
                                                <td className="actions-cell">
                                                    <button 
                                                        className="btn-icon btn-delete" 
                                                        title="Eliminar"
                                                        onClick={() => {
                                                            setUsuarioAEliminar(u);
                                                            setModalEliminar(true);
                                                        }}
                                                    >🗑️</button>
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

            {/* Modal de Eliminación */}
            {modalEliminar && (
                <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <h2>⚠️ Confirmar eliminación</h2>
                        <p>¿Estás seguro de eliminar a <strong>{usuarioAEliminar?.nombre}</strong>?</p>
                        <p className="modal-warning">Esta acción no se puede deshacer.</p>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setModalEliminar(false)}>Cancelar</button>
                            <button className="btn btn-danger" onClick={confirmarEliminar}>Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default AdminUsuarios;