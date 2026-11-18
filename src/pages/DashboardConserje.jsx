import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

function DashboardConserje() {
    const { usuario } = useAuth();

    const tarjetas = [
        { icono: '📦', titulo: 'Registrar Delivery', ruta: '/conserje/deliveries', desc: 'Ingresar llegada de paquetes o encomiendas.' },
        { icono: '🚶', titulo: 'Registrar Invitado', ruta: '/conserje/invitados', desc: 'Control de entrada y salida de visitantes.' },
        { icono: '📋', titulo: 'Reportes Pendientes', ruta: '/admin/reportes', desc: 'Ver y actualizar reclamos de residentes.' }, // Comparte vista con admin
        { icono: '👥', titulo: 'Listado de Residentes', ruta: '#', desc: 'Consultar información limitada de residentes.' },
    ];

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="container">
                    <h1 className="page-title">¡Hola, {usuario?.nombre}!</h1>
                    <p className="page-subtitle">Panel de Conserjería</p>

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

export default DashboardConserje;