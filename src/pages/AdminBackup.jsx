import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

function AdminBackup() {
    const { usuario } = useAuth();
    const [mensaje, setMensaje] = useState('');

    // Calcular estadísticas
    const usuarios = Storage.get(Storage.KEYS.USUARIOS) || [];
    const productos = Storage.get(Storage.KEYS.PRODUCTOS) || [];
    const reportes = Storage.get(Storage.KEYS.REPORTES) || [];
    const deliveries = Storage.get(Storage.KEYS.DELIVERIES) || [];
    const logs = Storage.get(Storage.KEYS.LOGS) || [];

    const exportarDatos = () => {
        // Recolectar todos los datos
        const backupData = {
            metadata: {
                app: 'CondoNotify React',
                fechaExport: new Date().toISOString(),
                exportadoPor: usuario.nombre
            },
            data: {
                usuarios,
                productos,
                reportes,
                deliveries,
                logs
            }
        };

        // Crear archivo JSON y descargarlo
        const dataStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `condonotify-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Storage.registrarLog(usuario.nombre, 'EXPORTAR_RESPALDO', 'Respaldo JSON descargado');
        setMensaje('✅ Respaldo descargado correctamente.');
        setTimeout(() => setMensaje(''), 3000);
    };

    const resetearSistema = () => {
        const confirmacion = prompt('⚠️ ESTO BORRARÁ TODO EL SISTEMA.\n\nEscribe "RESET" para confirmar:');
        if (confirmacion !== 'RESET') return;

        localStorage.clear();
        alert('💥 Sistema reseteado. Serás redirigido al login.');
        window.location.href = '/';
    };

    const tarjetasStats = [
        { icono: '👥', nombre: 'Usuarios', cantidad: usuarios.length },
        { icono: '📦', nombre: 'Productos', cantidad: productos.length },
        { icono: '📋', nombre: 'Reportes', cantidad: reportes.length },
        { icono: '📬', nombre: 'Deliveries', cantidad: deliveries.length },
        { icono: '📊', nombre: 'Logs', cantidad: logs.length },
    ];

    return (
        <>
            <Header volverA="/admin" />
            <main className="main-content">
                <div className="container">
                    <h1 className="page-title">💾 Respaldo de Datos</h1>
                    <p className="page-subtitle">Exporta o restaura la información del sistema</p>

                    {mensaje && <div className="alert alert-success" style={{ marginBottom: '20px' }}>{mensaje}</div>}

                    <section className="card">
                        <h2 className="section-title">📊 Estado actual del sistema</h2>
                        <div className="stats-grid">
                            {tarjetasStats.map((stat, i) => (
                                <div key={i} className="stat-card">
                                    <div className="stat-icono">{stat.icono}</div>
                                    <div className="stat-numero">{stat.cantidad}</div>
                                    <div className="stat-nombre">{stat.nombre}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="backup-grid" style={{ marginTop: '20px' }}>
                        <div className="card backup-card">
                            <div className="backup-icon">📤</div>
                            <h3>Exportar Respaldo</h3>
                            <p>Descarga un archivo JSON con toda la información de tu condominio.</p>
                            <button className="btn btn-primary btn-block" onClick={exportarDatos}>
                                📥 Descargar JSON
                            </button>
                        </div>

                        <div className="card backup-card">
                            <div className="backup-icon">⚠️</div>
                            <h3>Zona de Peligro</h3>
                            <p>Borra todos los datos y deja el sistema como nuevo. Úsalo con precaución.</p>
                            <button className="btn btn-danger btn-block" onClick={resetearSistema}>
                                🗑️ Reset Total
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default AdminBackup;