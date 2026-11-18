import { Link } from 'react-router-dom';
import Header from '../components/Header';
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
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">¡Hola, {usuario?.nombre}! 👋</h1>
                    <p className="text-slate-500 mt-1">Panel de Administrador. ¿Qué deseas gestionar hoy?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tarjetas.map((tarjeta, index) => (
                        <Link 
                            to={tarjeta.ruta} 
                            key={index} 
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center group cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                                {tarjeta.icono}
                            </div>
                            <h2 className="text-lg font-bold text-slate-800 mb-2">{tarjeta.titulo}</h2>
                            <p className="text-sm text-slate-500 leading-relaxed">{tarjeta.desc}</p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default DashboardAdmin;
