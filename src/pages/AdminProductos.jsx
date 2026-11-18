import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';
import { formatearPrecio } from '../utils/validaciones';
import { useAuth } from '../contexts/AuthContext';

function AdminProductos() {
    const { usuario } = useAuth();
    const [productos, setProductos] = useState(() => Storage.get(Storage.KEYS.PRODUCTOS) || []);
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    
    // Estados de Modales
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    
    // Estado del Formulario
    const [productoActual, setProductoActual] = useState({
        codigo: '', nombre: '', precio: 0, categoria: 'Alimentos', stock: 0, stockCritico: 0
    });

    // Accesibilidad: Cerrar modales con 'Escape'
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setModalAbierto(false);
                setModalEliminar(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleGuardar = (e) => {
        e.preventDefault();
        let nuevosProductos;

        if (modoEdicion) {
            nuevosProductos = productos.map(p => p.codigo === productoActual.codigo ? productoActual : p);
            Storage.registrarLog(usuario.nombre, 'EDITAR_PRODUCTO', `Editado: ${productoActual.nombre}`);
        } else {
            if (productos.some(p => p.codigo === productoActual.codigo)) {
                alert('Ya existe un producto con ese código.');
                return;
            }
            nuevosProductos = [...productos, productoActual];
            Storage.registrarLog(usuario.nombre, 'CREAR_PRODUCTO', `Creado: ${productoActual.nombre}`);
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
        Storage.registrarLog(usuario.nombre, 'ELIMINAR_PRODUCTO', `Eliminado: ${productoAEliminar.nombre}`);
        setModalEliminar(false);
    };

    const productosFiltrados = productos.filter(p => {
        const coincideBusqueda = !busqueda || p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.codigo.toLowerCase().includes(busqueda.toLowerCase());
        return coincideBusqueda && (!filtroCategoria || p.categoria === filtroCategoria);
    });

    const esStockCritico = (prod) => prod.stockCritico && prod.stock <= prod.stockCritico;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-200">
            <Header volverA="/admin" />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">📦 Gestión de Productos</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Total: <strong>{productosFiltrados.length}</strong> productos</p>
                    </div>
                    <button 
                        onClick={() => {
                            setModoEdicion(false);
                            setProductoActual({ codigo: '', nombre: '', precio: 0, categoria: 'Alimentos', stock: 0, stockCritico: 0 });
                            setModalAbierto(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        ➕ Nuevo Producto
                    </button>
                </div>

                {/* Filtros */}
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="🔍 Buscar por nombre o código..." 
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                        <select 
                            value={filtroCategoria} 
                            onChange={(e) => setFiltroCategoria(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        >
                            <option value="">Todas las categorías</option>
                            <option value="Alimentos">🍎 Alimentos</option>
                            <option value="Bebidas">🥤 Bebidas</option>
                            <option value="Limpieza">🧼 Limpieza</option>
                            <option value="Tecnología">💻 Tecnología</option>
                        </select>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Código</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Nombre</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Precio</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Stock</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {productosFiltrados.map(p => (
                                    <tr key={p.codigo} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${esStockCritico(p) ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}`}>
                                        <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-300">{p.codigo}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-white">{p.nombre}</td>
                                        <td className="px-6 py-4 text-sm text-slate-800 dark:text-white font-semibold">{formatearPrecio(p.precio)}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            {p.stock} {esStockCritico(p) && <span className="text-amber-500 ml-1" title="Stock crítico">⚠️</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button onClick={() => { setModoEdicion(true); setProductoActual(p); setModalAbierto(true); }} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" aria-label="Editar">✏️</button>
                                            <button onClick={() => { setProductoAEliminar(p); setModalEliminar(true); }} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" aria-label="Eliminar">🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* MODAL CREAR/EDITAR */}
            {modalAbierto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" role="dialog" aria-modal="true">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                                {modoEdicion ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
                            </h2>
                            <form onSubmit={handleGuardar} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Código</label>
                                        <input type="text" value={productoActual.codigo} onChange={e => setProductoActual({...productoActual, codigo: e.target.value})} required disabled={modoEdicion} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600 disabled:opacity-50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
                                        <input type="text" value={productoActual.nombre} onChange={e => setProductoActual({...productoActual, nombre: e.target.value})} required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Precio</label>
                                        <input type="number" value={productoActual.precio} onChange={e => setProductoActual({...productoActual, precio: Number(e.target.value)})} required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                                        <select value={productoActual.categoria} onChange={e => setProductoActual({...productoActual, categoria: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600">
                                            <option value="Alimentos">Alimentos</option>
                                            <option value="Bebidas">Bebidas</option>
                                            <option value="Limpieza">Limpieza</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock</label>
                                        <input type="number" value={productoActual.stock} onChange={e => setProductoActual({...productoActual, stock: Number(e.target.value)})} required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock Crítico</label>
                                        <input type="number" value={productoActual.stockCritico} onChange={e => setProductoActual({...productoActual, stockCritico: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600" />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end gap-3 border-t dark:border-slate-700">
                                    <button type="button" onClick={() => setModalAbierto(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg">Cancelar</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ELIMINAR */}
            {modalEliminar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" role="dialog" aria-modal="true">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl w-full max-w-sm animate-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">⚠️ Eliminar producto</h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-6">¿Seguro que deseas eliminar <strong>{productoAEliminar?.nombre}</strong>?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setModalEliminar(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg">Cancelar</button>
                            <button onClick={confirmarEliminar} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default AdminProductos;