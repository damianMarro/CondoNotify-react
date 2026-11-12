import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';
import { formatearPrecio } from '../utils/validaciones'; // Lo creamos antes

function AdminProductos() {
    const [productos, setProductos] = useState(() => Storage.get(Storage.KEYS.PRODUCTOS) || []);
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    
    // Estados para el Modal (Crear/Editar)
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoActual, setProductoActual] = useState({
        codigo: '', nombre: '', descripcion: '', precio: 0, categoria: 'Alimentos', stock: 0, stockCritico: 0, imagen: ''
    });

    const [modalEliminar, setModalEliminar] = useState(false);
    const [productoAEliminar, setProductoAEliminar] = useState(null);

    // Función para guardar (Crear o Editar)
    const handleGuardar = (e) => {
        e.preventDefault();
        let nuevosProductos;

        if (modoEdicion) {
            // Editar
            nuevosProductos = productos.map(p => p.codigo === productoActual.codigo ? productoActual : p);
            Storage.registrarLog('Admin', 'EDITAR_PRODUCTO', `Editado: ${productoActual.nombre}`);
        } else {
            // Crear (Validar que el código no exista)
            if (productos.some(p => p.codigo === productoActual.codigo)) {
                alert('Ya existe un producto con ese código.');
                return;
            }
            nuevosProductos = [...productos, productoActual];
            Storage.registrarLog('Admin', 'CREAR_PRODUCTO', `Creado: ${productoActual.nombre}`);
        }

        setProductos(nuevosProductos);
        Storage.save(Storage.KEYS.PRODUCTOS, nuevosProductos);
        setModalAbierto(false);
    };

    const confirmarEliminar = () => {
        if (!productoAEliminar) return;
        const nuevosProductos = productos.filter(p => p.codigo !== productoAEliminar.codigo);
        setProductos(nuevosProductos);
        Storage.save(Storage.KEYS.PRODUCTOS, nuevosProductos);
        Storage.registrarLog('Admin', 'ELIMINAR_PRODUCTO', `Eliminado: ${productoAEliminar.nombre}`);
        setModalEliminar(false);
        setProductoAEliminar(null);
    };

    // Filtros
    const productosFiltrados = productos.filter(p => {
        const coincideBusqueda = !busqueda || 
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
            p.codigo.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = !filtroCategoria || p.categoria === filtroCategoria;
        return coincideBusqueda && coincideCategoria;
    });

    // Helper para stock crítico
    const esStockCritico = (prod) => prod.stockCritico && prod.stock <= prod.stockCritico;

    return (
        <>
            <Header volverA="/admin" />
            <main className="main-content">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">📦 Gestión de Productos</h1>
                            <p className="page-subtitle">Total: <strong>{productosFiltrados.length}</strong> productos</p>
                        </div>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => {
                                setModoEdicion(false);
                                setProductoActual({ codigo: '', nombre: '', descripcion: '', precio: 0, categoria: 'Alimentos', stock: 0, stockCritico: 0, imagen: '' });
                                setModalAbierto(true);
                            }}
                        >
                            ➕ Nuevo Producto
                        </button>
                    </div>

                    {/* Filtros */}
                    <section className="card filters-card">
                        <div className="filters-grid-3">
                            <div className="form-group">
                                <label>🔍 Buscar</label>
                                <input 
                                    type="text" 
                                    placeholder="Nombre o código..." 
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Filtrar por Categoría</label>
                                <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                                    <option value="">Todas</option>
                                    <option value="Alimentos">🍎 Alimentos</option>
                                    <option value="Bebidas">🥤 Bebidas</option>
                                    <option value="Limpieza">🧼 Limpieza</option>
                                    <option value="Higiene">🧴 Higiene</option>
                                    <option value="Tecnología">💻 Tecnología</option>
                                    <option value="Hogar">🏠 Hogar</option>
                                    <option value="Otros">📦 Otros</option>
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
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosFiltrados.map(p => (
                                        <tr key={p.codigo} className={esStockCritico(p) ? 'row-warning' : ''}>
                                            <td><code>{p.codigo}</code></td>
                                            <td>{p.nombre}</td>
                                            <td>{p.categoria}</td>
                                            <td><strong>{formatearPrecio(p.precio)}</strong></td>
                                            <td>
                                                {p.stock}
                                                {esStockCritico(p) && <span className="stock-alert" title="Stock crítico"> ⚠️</span>}
                                            </td>
                                            <td className="actions-cell">
                                                <button 
                                                    className="btn-icon btn-edit" 
                                                    onClick={() => {
                                                        setModoEdicion(true);
                                                        setProductoActual(p);
                                                        setModalAbierto(true);
                                                    }}
                                                >✏️</button>
                                                <button 
                                                    className="btn-icon btn-delete" 
                                                    onClick={() => {
                                                        setProductoAEliminar(p);
                                                        setModalEliminar(true);
                                                    }}
                                                >🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>

            {/* Modal Crear/Editar */}
            {modalAbierto && (
                <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content modal-large">
                        <h2>{modoEdicion ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h2>
                        <form onSubmit={handleGuardar}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Código</label>
                                    <input type="text" value={productoActual.codigo} onChange={e => setProductoActual({...productoActual, codigo: e.target.value})} required disabled={modoEdicion} />
                                </div>
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input type="text" value={productoActual.nombre} onChange={e => setProductoActual({...productoActual, nombre: e.target.value})} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Precio (CLP)</label>
                                    <input type="number" value={productoActual.precio} onChange={e => setProductoActual({...productoActual, precio: Number(e.target.value)})} required min="0" />
                                </div>
                                <div className="form-group">
                                    <label>Categoría</label>
                                    <select value={productoActual.categoria} onChange={e => setProductoActual({...productoActual, categoria: e.target.value})}>
                                        <option value="Alimentos">🍎 Alimentos</option>
                                        <option value="Bebidas">🥤 Bebidas</option>
                                        <option value="Limpieza">🧼 Limpieza</option>
                                        <option value="Higiene">🧴 Higiene</option>
                                        <option value="Tecnología">💻 Tecnología</option>
                                        <option value="Hogar">🏠 Hogar</option>
                                        <option value="Otros">📦 Otros</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input type="number" value={productoActual.stock} onChange={e => setProductoActual({...productoActual, stock: Number(e.target.value)})} required min="0" />
                                </div>
                                <div className="form-group">
                                    <label>Stock Crítico</label>
                                    <input type="number" value={productoActual.stockCritico} onChange={e => setProductoActual({...productoActual, stockCritico: Number(e.target.value)})} min="0" />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Eliminar */}
            {modalEliminar && (
                <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <h2>⚠️ Confirmar eliminación</h2>
                        <p>¿Eliminar el producto <strong>{productoAEliminar?.nombre}</strong>?</p>
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

export default AdminProductos;