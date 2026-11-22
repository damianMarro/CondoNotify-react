import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

function DashboardAdmin() {
    const { usuario } = useAuth();

    const tarjetas = [
        { icono: '👥', titulo: 'Gestión de Usuarios', ruta: '/admin/usuarios', desc: 'Administrar residentes, conserjes y admins.' },
        { icono: '📦', titulo: 'Gestión de Productos', ruta: '/admin/productos', desc: 'Catálogo de productos y control de stock.' },
        { icono: '📋', titulo: 'Gestión de Reportes', ruta: '/admin/reportes', desc: 'Supervisar reclamos de los residentes.' },
        { icono: '📢', titulo: 'Anuncios Masivos', ruta: '/admin/anuncios', desc: 'Enviar comunicados masivos.' },
        { icono: '📊', titulo: 'Logs del Sistema', ruta: '/admin/logs', desc: 'Auditoría de acciones del sistema.' },
        { icono: '💾', titulo: 'Respaldo de Datos', ruta: '/admin/backup', desc: 'Exportar e importar datos.' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
            <Header />
            
            {/* pt-32 le da el espacio suficiente para que el Header no tape el título */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-white">¡Hola, {usuario?.nombre}! 👋</h1>
                    <p className="text-slate-400 mt-2">Panel de Administrador. ¿Qué deseas gestionar hoy?</p>
                </div>

                {/* Grid de tarjetas con Tailwind */}
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

export default DashboardAdmin;