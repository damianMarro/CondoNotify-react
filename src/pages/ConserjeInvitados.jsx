import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';

function ConserjeInvitados() {
    const [invitados, setInvitados] = useState(() => Storage.get(Storage.KEYS.INVITADOS) || []);
    const [mensajeExito, setMensajeExito] = useState('');
    
    const [form, setForm] = useState({
        nombre: '', rut: '', depto: '', motivo: 'Visita familiar'
    });

    const fechaActualISO = () => new Date().toISOString().split('T')[0];
    const horaActual = () => new Date().toTimeString().substring(0, 5);

    const handleRegistrar = (e) => {
        e.preventDefault();
        
        const nuevo = {
            id: 'INV-' + Date.now(),
            ...form,
            fecha: fechaActualISO(),
            horaEntrada: horaActual(),
            horaSalida: null,
            estado: 'dentro'
        };

        const nuevosInvitados = [nuevo, ...invitados];
        setInvitados(nuevosInvitados);
        Storage.save(Storage.KEYS.INVITADOS, nuevosInvitados);
        Storage.registrarLog('Conserje', 'REGISTRAR_INVITADO', `${form.nombre} al depto ${form.depto}`);

        setForm({ nombre: '', rut: '', depto: '', motivo: 'Visita familiar' });
        setMensajeExito(`✅ Ingreso registrado para ${nuevo.nombre}`);
        setTimeout(() => setMensajeExito(''), 3000);
    };

    const registrarSalida = (id) => {
        const actualizados = invitados.map(i => 
            i.id === id ? { ...i, estado: 'salio', horaSalida: horaActual() } : i
        );
        setInvitados(actualizados);
        Storage.save(Storage.KEYS.INVITADOS, actualizados);
        Storage.registrarLog('Conserje', 'SALIDA_INVITADO', `ID: ${id}`);
    };

    return (
        <>
            <Header volverA="/conserje" />
            <main className="main-content">
                <div className="container">
                    <h1 className="page-title">🚶 Registro de Invitados</h1>
                    
                    <section className="card">
                        <h2 className="section-title">➕ Nuevo Ingreso</h2>
                        <form onSubmit={handleRegistrar}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nombre del Visitante *</label>
                                    <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>RUT *</label>
                                    <input type="text" value={form.rut} onChange={e => setForm({...form, rut: e.target.value})} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Depto a Visitar *</label>
                                    <input type="text" value={form.depto} onChange={e => setForm({...form, depto: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Motivo</label>
                                    <select value={form.motivo} onChange={e => setForm({...form, motivo: e.target.value})}>
                                        <option value="Visita familiar">👨‍👩‍👧 Visita familiar</option>
                                        <option value="Visita social">🎉 Visita social</option>
                                        <option value="Servicio técnico">🔧 Servicio técnico</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">✅ Registrar Entrada</button>
                            {mensajeExito && <div className="alert alert-success" style={{ marginTop: '15px' }}>{mensajeExito}</div>}
                        </form>
                    </section>

                    <section className="card">
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Entrada</th>
                                        <th>Nombre</th>
                                        <th>Depto</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invitados.map(i => (
                                        <tr key={i.id} className={i.estado === 'salio' ? 'row-success' : ''}>
                                            <td><strong>{i.horaEntrada}</strong></td>
                                            <td>{i.nombre}</td>
                                            <td><span className="badge badge-residente">{i.depto}</span></td>
                                            <td>{i.estado === 'dentro' ? '⏳ Dentro' : '✅ Salió'}</td>
                                            <td>
                                                {i.estado === 'dentro' && (
                                                    <button className="btn-icon" onClick={() => registrarSalida(i.id)}>🚪</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
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

export default ConserjeInvitados;
