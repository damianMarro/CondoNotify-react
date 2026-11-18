import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    const agregarAlCarrito = (producto) => {
        const existe = carrito.find(item => item.codigo === producto.codigo);
        const nuevoCarrito = existe 
            ? carrito.map(item => item.codigo === producto.codigo ? { ...item, cantidad: item.cantidad + 1 } : item)
            : [...carrito, { ...producto, cantidad: 1 }];
        
        setCarrito(nuevoCarrito);
        Storage.save('condonotify_carrito', nuevoCarrito);
        setToast(`✅ Añadido al carrito`);
        setTimeout(() => setToast(''), 2000);
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-200">
            <Header volverA="/residente" />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">🛍️ Tienda</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Explora nuestros productos</p>
                    </div>
                    <button onClick={() => navigate('/residente/carrito')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-all flex items-center gap-2">
                        🛒 Ver Carrito <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs">{totalItems}</span>
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8 flex flex-col sm:flex-row gap-4">
                    <input type="text" placeholder="🔍 Buscar producto..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full sm:w-2/3 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} className="w-full sm:w-1/3 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                        <option value="">Todas las categorías</option>
                        <option value="Alimentos">🍎 Alimentos</option>
                        <option value="Bebidas">🥤 Bebidas</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {productosFiltrados.map(p => (
                        <article key={p.codigo} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all group">
                            <div className="h-40 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                                {iconoCategoria(p.categoria)}
                            </div>
                            <div className="p-5">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{p.categoria}</span>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-1 mb-2 line-clamp-1">{p.nombre}</h3>
                                <div className="flex justify-between items-center mt-4">
                                    <div>
                                        <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{formatearPrecio(p.precio)}</span>
                                        <p className="text-xs text-slate-500">Stock: {p.stock}</p>
                                    </div>
                                    <button onClick={() => agregarAlCarrito(p)} className="bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 p-3 rounded-xl transition-colors" aria-label={`Añadir ${p.nombre} al carrito`}>
                                        🛒
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            {toast && (
                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-slate-800 dark:bg-white text-white dark:text-slate-800 px-6 py-3 rounded-full shadow-2xl z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {toast}
                </div>
            )}
            <Footer />
        </div>
    );
}

export default Tienda;