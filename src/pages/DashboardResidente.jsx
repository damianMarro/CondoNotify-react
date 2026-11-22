import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

function DashboardResidente() {
    const { usuario } = useAuth();

    const tarjetas = [
        { icono: '✍️', titulo: 'Enviar Reporte', ruta: '/residente/reportes', desc: 'Reportar incidencias del condominio.' },
        { icono: '🔔', titulo: 'Mis Notificaciones', ruta: '/residente/notificaciones', desc: 'Todas las alertas: deliveries, anuncios y más.' },
        { icono: '🛍️', titulo: 'Tienda', ruta: '/residente/tienda', desc: 'Explora productos y añádelos al carrito.' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
            <Header />
            
            <main style={{ flex: 1, paddingTop: '120px', paddingBottom: '50px' }} className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-white">¡Hola, {usuario?.nombre}! 👋</h1>
                    <p className="text-slate-400 mt-2">Tus notificaciones y servicios del condominio.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tarjetas.map((tarjeta, index) => (
                        <Link 
                            to={tarjeta.ruta} 
                            key={index} 
                            className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center group cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                                {tarjeta.icono}
                            </div>
                            <h2 className="text-lg font-bold text-white mb-2">{tarjeta.titulo}</h2>
                            <p className="text-sm text-slate-400 leading-relaxed">{tarjeta.desc}</p>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default DashboardResidente;