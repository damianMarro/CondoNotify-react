import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';

function AdminLogs() {
    const [logs] = useState(() => Storage.get(Storage.KEYS.LOGS) || []);

    // Ordenar los logs del más reciente al más antiguo
    const logsOrdenados = [...logs].reverse();

    return (
        <>
            <Header volverA="/admin" />
            <main className="main-content">
                <div className="container">
                    <h1 className="page-title">📊 Logs del Sistema</h1>
                    <p className="page-subtitle">Auditoría de acciones (Total: {logs.length})</p>

                    <section className="card">
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Fecha y Hora</th>
                                        <th>Usuario</th>
                                        <th>Acción</th>
                                        <th>Detalle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logsOrdenados.length === 0 ? (
                                        <tr><td colSpan="4" style={{textAlign: 'center'}}>No hay registros de actividad.</td></tr>
                                    ) : (
                                        logsOrdenados.map((log, index) => (
                                            <tr key={index}>
                                                <td>{new Date(log.fecha).toLocaleString('es-CL')}</td>
                                                <td><strong>{log.usuario}</strong></td>
                                                <td>
                                                    <span className="badge badge-admin" style={{ fontSize: '0.7rem' }}>
                                                        {log.accion}
                                                    </span>
                                                </td>
                                                <td>{log.detalle}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default AdminLogs;