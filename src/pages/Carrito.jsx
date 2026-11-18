import { useState } from 'react';
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

    const actualizarCarrito = (nuevoCarrito) => {
        setCarrito(nuevoCarrito);
        Storage.save('condonotify_carrito', nuevoCarrito);
    };

    const modificarCantidad = (codigo, delta) => {
        const nuevo = carrito.map(item => {
            if (item.codigo === codigo) {
                const nuevaCant = item.cantidad + delta;
                return nuevaCant > 0 ? { ...item, cantidad: nuevaCant } : item;
            }
            return item;
        });
        actualizarCarrito(nuevo);
    };

    const eliminarItem = (codigo) => {
        actualizarCarrito(carrito.filter(item => item.codigo !== codigo));
    };

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
        // Registrar la compra
        const orden = {
            id: 'ORD-' + Date.now().toString().slice(-6),
            rutResidente: usuario.rut,
            nombreResidente: usuario.nombre,
            items: carrito,
            total,
            fecha: new Date().toISOString(),
        };
        
        const ordenes = Storage.get('condonotify_ordenes') || [];
        Storage.save('condonotify_ordenes', [...ordenes, orden]);
        Storage.registrarLog(usuario.nombre, 'COMPRA_REALIZADA', `Pedido ${orden.id} por $${total}`);
        
        // Descontar stock (lógica simplificada)
        const productos = Storage.get(Storage.KEYS.PRODUCTOS) || [];
        carrito.forEach(itemCarrito => {
            const prod = productos.find(p => p.codigo === itemCarrito.codigo);
            if (prod) prod.stock -= itemCarrito.cantidad;
        });
        Storage.save(Storage.KEYS.PRODUCTOS, productos);

        // Vaciar y cerrar
        actualizarCarrito([]);
        setModalPago(false);
        alert(`🎉 ¡Compra exitosa! Tu pedido es el ${orden.id}`);
    };

    if (carrito.length === 0) {
        return (
            <>
                <Header volverA="/residente" />
                <main className="main-content">
                    <div className="container">
                        <div className="empty-state">
                            <div className="empty-icon">🛒</div>
                            <h2>Tu carrito está vacío</h2>
                            <Link to="/residente/tienda" className="btn btn-primary" style={{ marginTop: '15px' }}>Ir a la Tienda</Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header volverA="/residente" />
            <main className="main-content">
                <div className="container">
                    <h1 className="page-title">🛒 Mi Carrito</h1>
                    
                    <div className="carrito-layout">
                        <div className="carrito-items">
                            {carrito.map(item => (
                                <div key={item.codigo} className="carrito-item">
                                    <div className="item-info">
                                        <h3 className="item-nombre">{item.nombre}</h3>
                                        <p className="item-precio-unit">Precio: {formatearPrecio(item.precio)}</p>
                                    </div>
                                    <div className="item-cantidad">
                                        <button className="btn-cantidad-carrito" onClick={() => modificarCantidad(item.codigo, -1)}>−</button>
                                        <input type="number" className="input-cantidad-carrito" value={item.cantidad} readOnly />
                                        <button className="btn-cantidad-carrito" onClick={() => modificarCantidad(item.codigo, 1)}>+</button>
                                    </div>
                                    <div className="item-subtotal"><strong>{formatearPrecio(item.precio * item.cantidad)}</strong></div>
                                    <button className="btn-icon btn-delete" onClick={() => eliminarItem(item.codigo)}>🗑️</button>
                                </div>
                            ))}
                        </div>

                        <aside className="carrito-resumen">
                            <div className="card">
                                <h2 className="resumen-titulo">Resumen</h2>
                                <div className="resumen-lineas">
                                    <div className="resumen-linea"><span>Subtotal</span><span>{formatearPrecio(subtotal)}</span></div>
                                    {descuento > 0 && (
                                        <div className="resumen-linea descuento-linea"><span>Descuento</span><span>-{formatearPrecio(descuento)}</span></div>
                                    )}
                                </div>
                                <div className="cupon-box">
                                    <input type="text" placeholder="Cupón de descuento" value={cupon} onChange={e => setCupon(e.target.value)} />
                                    <button className="btn btn-secondary" onClick={aplicarCupon}>Aplicar</button>
                                    {mensajeCupon.texto && <small className={mensajeCupon.tipo === 'success' ? 'exito-message' : 'error-message'}>{mensajeCupon.texto}</small>}
                                </div>
                                <div className="resumen-total"><span>Total</span><span>{formatearPrecio(total)}</span></div>
                                <button className="btn btn-primary btn-block btn-lg" onClick={() => setModalPago(true)}>Proceder al Pago</button>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {modalPago && (
                <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <h2>Confirmar Compra</h2>
                        <p>Total a pagar: <strong>{formatearPrecio(total)}</strong></p>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setModalPago(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={pagar}>Confirmar y Pagar</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default Carrito;