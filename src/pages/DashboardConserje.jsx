import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

function DashboardConserje() {
    const { usuario } = useAuth();

    const tarjetas = [
        { icono: '📦', titulo: 'Registrar Delivery', ruta: '/conserje/deliveries', desc: 'Ingresar llegada de paquetes.' },
        { icono: '🚶', titulo: 'Registrar Invitado', ruta: '/conserje/invitados', desc: 'Control de entrada y salida.' },
        { icono: '📋', titulo: 'Reportes', ruta: '/admin/reportes', desc: 'Ver y actualizar reclamos.' }, 
    ];

    return (
        <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column' }}>
            <Header />
            
            <main style={{ flex: 1, padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: 0 }}>¡Hola, {usuario?.nombre}! 👋</h1>
                    <p style={{ color: '#94a3b8', marginTop: '10px' }}>Panel de Conserjería. Registra los accesos del día.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {tarjetas.map((tarjeta, index) => (
                        <Link 
                            to={tarjeta.ruta} 
                            key={index} 
                            style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', textDecoration: 'none', color: 'white', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.2)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#334155', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '16px' }}>
                                {tarjeta.icono}
                            </div>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>{tarjeta.titulo}</h2>
                            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>{tarjeta.desc}</p>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default DashboardConserje;