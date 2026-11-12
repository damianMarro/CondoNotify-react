import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

function DashboardResidente() {
    const { usuario } = useAuth();

    const tarjetas = [
        { icono: '📬', titulo: 'Mis Deliveries', ruta: '#', desc: 'Notificaciones de paquetes recibidos en conserjería.' },
        { icono: '🚶', titulo: 'Mis Invitados', ruta: '#', desc: 'Registro de visitas autorizadas al condominio.' },
        { icono: '📢', titulo: 'Anuncios', ruta: '#', desc: 'Comunicados de administración: cortes, mantenciones, etc.' },
        { icono: '✍️', titulo: 'Enviar Reporte', ruta: '/residente/reportes', desc: 'Reportar incidencias: ruido, filtraciones, etc.' },
        { icono: '🔔', titulo: 'Mis Notificaciones', ruta: '/residente/notificaciones', desc: 'Todas las alertas: deliveries, invitados, anuncios y más.' },
        { icono: '🛍️', titulo: 'Tienda', ruta: '/residente/tienda', desc: 'Explora productos disponibles y añádelos al carrito.' },
    ];

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="container">
                    <h1 className="page-title">¡Hola, {usuario?.nombre}!</h1>
                    <p className="page-subtitle">Tus notificaciones y servicios del condominio</p>

                    <section className="dashboard-grid">
                        {tarjetas.map((tarjeta, index) => (
                            <Link to={tarjeta.ruta} key={index} className="card dashboard-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="card-icon">{tarjeta.icono}</div>
                                <h2>{tarjeta.titulo}</h2>
                                <p>{tarjeta.desc}</p>
                            </Link>
                        ))}
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default DashboardResidente;