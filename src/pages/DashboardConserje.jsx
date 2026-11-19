import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

function DashboardConserje() {
    const { usuario } = useAuth();

    const tarjetas = [
        { icono: '📦', titulo: 'Registrar Delivery', ruta: '/conserje/deliveries', desc: 'Ingresar llegada de paquetes o encomiendas.' },
        { icono: '🚶', titulo: 'Registrar Invitado', ruta: '/conserje/invitados', desc: 'Control de entrada y salida de visitantes.' },
        { icono: '📋', titulo: 'Reportes Pendientes', ruta: '/admin/reportes', desc: 'Ver y actualizar reclamos de residentes.' }, 
        { icono: '👥', titulo: 'Listado de Residentes', ruta: '#', desc: 'Consultar información limitada de residentes.' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-200">
            <Header />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">¡Hola, {usuario?.nombre}! 👋</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Panel de Conserjería. Registra los accesos del día.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tarjetas.map((tarjeta, index) => (
                        <Link 
                            to={tarjeta.ruta} 
                            key={index} 
                            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center group cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                                {tarjeta.icono}
                            </div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{tarjeta.titulo}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{tarjeta.desc}</p>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default DashboardConserje;