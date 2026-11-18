import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';
import { formatearPrecio } from '../utils/validaciones';
import { useAuth } from '../contexts/AuthContext';

function Carrito() {
    const { usuario } = useAuth();
    const [carrito, setCarrito] = useState(() => Storage.get('condonotify_carrito') || []);
    const [cupon, setCupon] = useState('');
    const [descuento, setDescuento] = useState(0);
    const [mensajeCupon, setMensajeCupon] = useState({ texto: '', tipo: '' });
    const [modalPago, setModalPago] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => { if (e.key === 'Escape') setModalPago(false); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const actualizarCarrito = (nuevoCarrito) => {
        setCarrito(nuevoCarrito);
        Storage.save('condonotify_carrito', nuevoCarrito);
    };

    const modificarCantidad = (codigo, delta) => {
        const nuevo = carrito.map(item => {
            if (item.codigo === codigo) return { ...item, cantidad: Math.max(1, item.cantidad + delta) };
            return item;
        });
        actualizarCarrito(nuevo);
    };

    const eliminarItem = (codigo) => actualizarCarrito(carrito.filter(item => item.codigo !== codigo));

    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const total = subtotal - descuento;

    const aplicarCupon = () => {
        if (cupon.toUpperCase() === 'CONDONOTIFY10') {
            setDescuento(Math.round(subtotal * 0.10));
            setMensajeCupon({ texto: '✅ Cupón del 10% aplicado', tipo: 'success' });
        } else {
            setDescuento(0);
            setMensajeCupon({ texto: '❌ Cupón inválido', tipo: 'error' });
        }
    };

    const pagar = () => {
        const orden = { id: 'ORD-' + Date.now().toString().slice(-6), rutResidente: usuario.rut, nombreResidente: usuario.nombre, items: carrito, total, fecha: new Date().toISOString() };
        const ordenes = Storage.get('condonotify_ordenes') || [];
        Storage.save('condonotify_ordenes', [...ordenes, orden]);
        
        const productos = Storage.get(Storage.KEYS.PRODUCTOS) || [];
        carrito.forEach(item => {
            const prod = productos.find(p => p.codigo === item.codigo);
            if (prod) prod.stock -= item.cantidad;
        });
        Storage.save(Storage.KEYS.PRODUCTOS, productos);

        actualizarCarrito([]);
        setModalPago(false);
        alert(`🎉 ¡Compra exitosa! Tu pedido es el ${orden.id}`);
    };

    if (carrito.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
                <Header volverA="/residente" />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Tu carrito está vacío</h2>
                        <Link to="/residente/tienda" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl inline-block transition-all">Ir a la Tienda</Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-200">
            <Header volverA="/residente" />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">🛒 Mi Carrito</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {carrito.map(item => (
                            <div key={item.codigo} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                                    📦
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{item.nombre}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Precio: {formatearPrecio(item.precio)}</p>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700 rounded-xl p-1 border border-slate-200 dark:border-slate-600">
                                    <button onClick={() => modificarCantidad(item.codigo, -1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300" aria-label="Disminuir cantidad">−</button>
                                    <span className="w-8 text-center font-bold text-slate-800 dark:text-white">{item.cantidad}</span>
                                    <button onClick={() => modificarCantidad(item.codigo, 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300" aria-label="Aumentar cantidad">+</button>
                                </div>
                                <div className="text-right sm:w-24">
                                    <p className="text-lg font-extrabold text-slate-800 dark:text-white">{formatearPrecio(item.precio * item.cantidad)}</p>
                                    <button onClick={() => eliminarItem(item.codigo)} className="text-sm text-red-500 hover:text-red-700 mt-1" aria-label="Eliminar">Eliminar</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 sticky top-24">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">Resumen del Pedido</h2>
                            
                            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 mb-6">
                                <div className="flex justify-between"><span>Subtotal</span><span>{formatearPrecio(subtotal)}</span></div>
                                {descuento > 0 && <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><span>Descuento</span><span>-{formatearPrecio(descuento)}</span></div>}
                            </div>

                            <div className="mb-6">
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Cupón" value={cupon} onChange={e => setCupon(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white uppercase text-sm outline-none" />
                                    <button onClick={aplicarCupon} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Aplicar</button>
                                </div>
                                {mensajeCupon.texto && <p className={`text-xs mt-2 font-medium ${mensajeCupon.tipo === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>{mensajeCupon.texto}</p>}
                            </div>

                            <div className="flex justify-between items-center mb-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <span className="text-lg font-bold text-slate-800 dark:text-white">Total</span>
                                <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{formatearPrecio(total)}</span>
                            </div>

                            <button onClick={() => setModalPago(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30">Proceder al Pago</button>
                        </div>
                    </aside>
                </div>
            </main>

            {modalPago && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" role="dialog" aria-modal="true">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center animate-in zoom-in duration-200">
                        <div className="text-5xl mb-4">💳</div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Confirmar Compra</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">Total a pagar: <strong>{formatearPrecio(total)}</strong></p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setModalPago(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300 rounded-lg">Cancelar</button>
                            <button onClick={pagar} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Pagar Ahora</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default Carrito;