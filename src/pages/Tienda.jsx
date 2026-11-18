import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';
import { formatearPrecio } from '../utils/validaciones';

function Tienda() {
    const navigate = useNavigate();
    const [productos] = useState(() => Storage.get(Storage.KEYS.PRODUCTOS) || []);
    const [carrito, setCarrito] = useState(() => Storage.get('condonotify_carrito') || []);
    
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [toast, setToast] = useState('');

    // Contador para el header (se puede pasar por props al Header si quieres luego)
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    const agregarAlCarrito = (producto) => {
        const existe = carrito.find(item => item.codigo === producto.codigo);
        let nuevoCarrito;

        if (existe) {
            nuevoCarrito = carrito.map(item => 
                item.codigo === producto.codigo ? { ...item, cantidad: item.cantidad + 1 } : item
            );
        } else {
            nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
        }

        setCarrito(nuevoCarrito);
        Storage.save('condonotify_carrito', nuevoCarrito);
        
        // Mostrar Toast
        setToast(`✅ "${producto.nombre}" añadido al carrito`);
        setTimeout(() => setToast(''), 2500);
    };

    const iconoCategoria = (cat) => {
        const iconos = { 'Alimentos': '🍎', 'Bebidas': '🥤', 'Limpieza': '🧼', 'Higiene': '🧴', 'Tecnología': '💻', 'Hogar': '🏠', 'Otros': '📦' };
        return iconos[cat] || '📦';
    };

    const productosFiltrados = productos.filter(p => {
        const coincideBusqueda = !busqueda || p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = !filtroCategoria || p.categoria === filtroCategoria;
        return coincideBusqueda && coincideCategoria && p.stock > 0;
    });

    return (
        <>
            <Header volverA="/residente" />
            <main className="main-content">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">🛍️ Tienda CondoNotify</h1>
                            <p className="page-subtitle">Total: <strong>{productosFiltrados.length}</strong> productos disponibles</p>
                        </div>
                        <Link to="/residente/carrito" className="btn btn-primary">
                            🛒 Ver Carrito ({totalItems})
                        </Link>
                    </div>

                    <section className="card filters-card">
                        <div className="filters-grid">
                            <div className="form-group">
                                <label>🔍 Buscar</label>
                                <input type="text" placeholder="Nombre del producto..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Categoría</label>
                                <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
                                    <option value="">Todas</option>
                                    <option value="Alimentos">🍎 Alimentos</option>
                                    <option value="Bebidas">🥤 Bebidas</option>
                                    <option value="Limpieza">🧼 Limpieza</option>
                                    <option value="Higiene">🧴 Higiene</option>
                                    <option value="Tecnología">💻 Tecnología</option>
                                    <option value="Hogar">🏠 Hogar</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="productos-grid">
                        {productosFiltrados.map(p => (
                            <article key={p.codigo} className="producto-card">
                                <div className="producto-imagen" onClick={() => navigate(`/residente/producto/${p.codigo}`)} style={{ cursor: 'pointer' }}>
                                    {p.imagen ? <img src={p.imagen} alt={p.nombre} /> : <span className="producto-placeholder">{iconoCategoria(p.categoria)}</span>}
                                </div>
                                <div className="producto-info">
                                    <span className="producto-categoria">{iconoCategoria(p.categoria)} {p.categoria}</span>
                                    <h3 className="producto-nombre" onClick={() => navigate(`/residente/producto/${p.codigo}`)} style={{ cursor: 'pointer' }}>{p.nombre}</h3>
                                    <div className="producto-footer">
                                        <div className="producto-precio">
                                            <span className="precio-valor">{formatearPrecio(p.precio)}</span>
                                            <small className="precio-stock">Stock: {p.stock}</small>
                                        </div>
                                        <button className="btn btn-primary btn-sm" onClick={() => agregarAlCarrito(p)}>
                                            🛒 Añadir
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                </div>
            </main>
            
            {/* Toast Notification */}
            {toast && <div className="toast toast-visible">{toast}</div>}

            <Footer />
        </>
    );
}

export default Tienda;