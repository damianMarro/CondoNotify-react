import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

function DashboardAdmin() {
    const { usuario } = useAuth();

    const tarjetas = [
        { icono: '👥', titulo: 'Gestión de Usuarios', ruta: '/admin/usuarios', desc: 'Administrar residentes, conserjes y administradores.' },
        { icono: '📦', titulo: 'Gestión de Productos', ruta: '/admin/productos', desc: 'Administrar catálogo de productos y stock.' },
        { icono: '📋', titulo: 'Gestión de Reportes', ruta: '/admin/reportes', desc: 'Supervisar y actualizar reclamos de residentes.' },
        { icono: '📢', titulo: 'Anuncios Masivos', ruta: '/admin/anuncios', desc: 'Enviar notificaciones de cortes, mantención, etc.' },
        { icono: '📊', titulo: 'Logs del Sistema', ruta: '/admin/logs', desc: 'Auditoría de acciones realizadas por los usuarios.' },
        { icono: '💾', titulo: 'Respaldo de Datos', ruta: '/admin/backup', desc: 'Exportar e importar información del sistema.' },
    ];

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="container">
                    <h1 className="page-title">¡Hola, {usuario?.nombre}!</h1>
                    <p className="page-subtitle">Panel de Administrador</p>

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

export default DashboardAdmin;