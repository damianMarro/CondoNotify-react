import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

function AdminAnuncios() {
    const { usuario } = useAuth();
    const [anuncios, setAnuncios] = useState(() => Storage.get(Storage.KEYS.ANUNCIOS) || []);
    const [mensajeExito, setMensajeExito] = useState('');
    
    const [form, setForm] = useState({
        tipo: 'Informativo',
        prioridad: 'Normal',
        titulo: '',
        mensaje: ''
    });

    const handleEnviar = (e) => {
        e.preventDefault();
        if (form.mensaje.length < 20) {
            alert('El mensaje debe tener al menos 20 caracteres.');
            return;
        }

        const nuevoAnuncio = {
            id: 'ANU-' + Date.now(),
            ...form,
            fecha: new Date().toISOString().split('T')[0],
            enviadoPor: usuario.nombre,
            timestamp: Date.now()
        };

        // Guardar en la lista global de anuncios
        const nuevosAnuncios = [nuevoAnuncio, ...anuncios];
        setAnuncios(nuevosAnuncios);
        Storage.save(Storage.KEYS.ANUNCIOS, nuevosAnuncios);

        // Enviar a TODOS los residentes
        const usuarios = Storage.get(Storage.KEYS.USUARIOS) || [];
        const residentes = usuarios.filter(u => u.rol === 'Residente');

        residentes.forEach(res => {
            const notis = Storage.get('condonotify_notificaciones_' + res.rut) || [];
            notis.push({
                tipo: 'anuncio',
                mensaje: `📢 ${form.titulo}`,
                detalle: form.mensaje,
                fecha: nuevoAnuncio.fecha,
                leida: false
            });
            Storage.save('condonotify_notificaciones_' + res.rut, notis);
        });

        Storage.registrarLog(usuario.nombre, 'CREAR_ANUNCIO', form.titulo);

        setForm({ tipo: 'Informativo', prioridad: 'Normal', titulo: '', mensaje: '' });
        setMensajeExito(`✅ Anuncio enviado a ${residentes.length} residentes.`);
        setTimeout(() => setMensajeExito(''), 4000);
    };

    const eliminarAnuncio = (id) => {
        if (!window.confirm('¿Eliminar este anuncio?')) return;
        const filtrados = anuncios.filter(a => a.id !== id);
        setAnuncios(filtrados);
        Storage.save(Storage.KEYS.ANUNCIOS, filtrados);
    };

    return (
        <>
            <Header volverA="/admin" />
            <main className="main-content">
                <div className="container">
                    <h1 className="page-title">📢 Anuncios Masivos</h1>
                    <p className="page-subtitle">Envía comunicados a todos los residentes</p>

                    <section className="card">
                        <h2 className="section-title">➕ Nuevo Anuncio</h2>
                        <form onSubmit={handleEnviar}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tipo de Anuncio</label>
                                    <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                                        <option value="Informativo">📰 Informativo</option>
                                        <option value="Corte de agua">💧 Corte de agua</option>
                                        <option value="Mantención">🔧 Mantención</option>
                                        <option value="Urgente">🚨 Urgente</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Prioridad</label>
                                    <select value={form.prioridad} onChange={e => setForm({...form, prioridad: e.target.value})}>
                                        <option value="Normal">🟢 Normal</option>
                                        <option value="Importante">🟡 Importante</option>
                                        <option value="Urgente">🔴 Urgente</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Título</label>
                                <input type="text" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required maxLength="100" />
                            </div>
                            <div className="form-group">
                                <label>Mensaje</label>
                                <textarea value={form.mensaje} onChange={e => setForm({...form, mensaje: e.target.value})} required rows="4" placeholder="Mínimo 20 caracteres..."></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">📤 Enviar a Todos</button>
                            {mensajeExito && <div className="alert alert-success" style={{ marginTop: '15px' }}>{mensajeExito}</div>}
                        </form>
                    </section>

                    <section className="card">
                        <h2 className="section-title">📜 Historial de Anuncios</h2>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Título</th>
                                        <th>Prioridad</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {anuncios.map(a => (
                                        <tr key={a.id}>
                                            <td>{a.fecha}</td>
                                            <td>{a.titulo}</td>
                                            <td>{a.prioridad}</td>
                                            <td><button className="btn-icon btn-delete" onClick={() => eliminarAnuncio(a.id)}>🗑️</button></td>
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

export default AdminAnuncios;