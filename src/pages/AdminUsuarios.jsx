import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Storage from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

function AdminUsuarios() {
    const { usuario: usuarioLogueado } = useAuth();
    
    // Estados para los datos y filtros
    const [usuarios, setUsuarios] = useState(() => Storage.get(Storage.KEYS.USUARIOS) || []);
    const [busqueda, setBusqueda] = useState('');
    const [filtroRol, setFiltroRol] = useState('');
    
    // Estados para el modal de eliminación
    const [modalEliminar, setModalEliminar] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

    // Accesibilidad: Cerrar modal con la tecla Escape
    useEffect(() => {
        const handleKeyDown = (e) => { 
            if (e.key === 'Escape') setModalEliminar(false); 
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Función para enmascarar el RUT (Ley 19.628)
    const enmascararRut = (rut) => {
        if (!rut || rut.length < 4) return rut;
        const dv = rut.slice(-1).toUpperCase();
        const cuerpo = rut.slice(0, -1);
        return `${cuerpo.slice(0, 2)}.***.${cuerpo.slice(-2)}-${dv}`;
    };

    // Función para eliminar
    const confirmarEliminar = () => {
        if (!usuarioAEliminar) return;
        
        // Evitar que el admin se elimine a sí mismo
        if (usuarioAEliminar.rut === usuarioLogueado.rut) {
            alert("No puedes eliminar tu propia cuenta mientras estás conectado.");
            setModalEliminar(false);
            return;
        }

        const nuevosUsuarios = usuarios.filter(u => u.rut !== usuarioAEliminar.rut);
        setUsuarios(nuevosUsuarios);
        Storage.save(Storage.KEYS.USUARIOS, nuevosUsuarios);
        Storage.registrarLog(usuarioLogueado.nombre, 'ELIMINAR_USUARIO', `Eliminado: ${usuarioAEliminar.nombre}`);
        
        setModalEliminar(false);
        setUsuarioAEliminar(null);
    };

    // Lógica de filtrado
    const usuariosFiltrados = usuarios.filter(u => {
        const coincideBusqueda = !busqueda || 
            u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
            u.email.toLowerCase().includes(busqueda.toLowerCase()) || 
            u.rut.toLowerCase().includes(busqueda.toLowerCase());
        return coincideBusqueda && (!filtroRol || u.rol === filtroRol);
    });

    // Helper para colores de los roles
    const getBadgeClass = (rol) => {
        switch(rol) {
            case 'Administrador': return 'bg-blue-900/30 text-blue-400 border-blue-800';
            case 'Conserje': return 'bg-amber-900/30 text-amber-400 border-amber-800';
            default: return 'bg-emerald-900/30 text-emerald-400 border-emerald-800';
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
            <Header volverA="/admin" />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">👥 Gestión de Usuarios</h1>
                    <p className="text-slate-400 mt-2">Total: <strong className="text-white">{usuariosFiltrados.length}</strong> usuarios</p>
                </div>

                {/* Filtros y Búsqueda */}
                <div className="bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-700 mb-6 flex flex-col sm:flex-row gap-4">
                    <input 
                        type="text" 
                        placeholder="🔍 Buscar por nombre, RUT o email..." 
                        value={busqueda} 
                        onChange={(e) => setBusqueda(e.target.value)} 
                        className="w-full sm:w-2/3 px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <select 
                        value={filtroRol} 
                        onChange={(e) => setFiltroRol(e.target.value)} 
                        className="w-full sm:w-1/3 px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                        <option value="">Todos los roles</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Conserje">Conserje</option>
                        <option value="Residente">Residente</option>
                    </select>
                </div>

                {/* Tabla */}
                <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-900/50 border-b border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-400">RUT</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-400">Nombre</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-400">Rol</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-400 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {usuariosFiltrados.map(u => (
                                    <tr key={u.rut} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono text-slate-400">{enmascararRut(u.rut)}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-white">{u.nombre}</div>
                                            <div className="text-xs text-slate-400">{u.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getBadgeClass(u.rol)}`}>
                                                {u.rol}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => { setUsuarioAEliminar(u); setModalEliminar(true); }} 
                                                className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors" 
                                                aria-label={`Eliminar a ${u.nombre}`}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {usuariosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                                            No se encontraron usuarios con esos filtros.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* MODAL ELIMINAR */}
            {modalEliminar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" role="dialog" aria-modal="true">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-700 animate-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-white mb-2">⚠️ Confirmar eliminación</h2>
                        <p className="text-slate-400 mb-6">
                            ¿Seguro que deseas eliminar a <strong className="text-white">{usuarioAEliminar?.nombre}</strong>? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setModalEliminar(false)} 
                                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmarEliminar} 
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-500 transition-colors shadow-lg shadow-red-500/30"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default AdminUsuarios;