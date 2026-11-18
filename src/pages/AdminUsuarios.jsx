import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Storage from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

function AdminUsuarios() {
    const { usuario: usuarioLogueado } = useAuth();
    
    // --- ESTADOS ---
    const [usuarios, setUsuarios] = useState(() => Storage.get(Storage.KEYS.USUARIOS) || []);
    const [busqueda, setBusqueda] = useState('');
    const [filtroRol, setFiltroRol] = useState('');
    
    // Estados para el modal de eliminación
    const [modalEliminar, setModalEliminar] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

    // --- ACCESIBILIDAD (a11y) ---
    // Cierra el modal si el usuario presiona la tecla 'Escape'
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && modalEliminar) {
                setModalEliminar(false);
                setUsuarioAEliminar(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalEliminar]);

    // --- LÓGICA DE NEGOCIO ---
    const enmascararRut = (rut) => {
        if (!rut || rut.length < 4) return rut;
        const dv = rut.slice(-1).toUpperCase();
        const cuerpo = rut.slice(0, -1);
        return `${cuerpo.slice(0, 2)}.***.${cuerpo.slice(-2)}-${dv}`;
    };

    const confirmarEliminar = () => {
        if (!usuarioAEliminar) return;
        
        const nuevosUsuarios = usuarios.filter(u => u.rut !== usuarioAEliminar.rut);
        setUsuarios(nuevosUsuarios);
        Storage.save(Storage.KEYS.USUARIOS, nuevosUsuarios);
        Storage.registrarLog(usuarioLogueado.nombre, 'ELIMINAR_USUARIO', `Eliminado: ${usuarioAEliminar.nombre}`);
        
        // Cerrar modal y limpiar estado
        setModalEliminar(false);
        setUsuarioAEliminar(null);
    };

    // --- FILTRADO ---
    const usuariosFiltrados = usuarios.filter(u => {
        const coincideBusqueda = !busqueda || 
            u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
            u.rut.toLowerCase().includes(busqueda.toLowerCase());
        const coincideRol = !filtroRol || u.rol === filtroRol;
        return coincideBusqueda && coincideRol;
    });

    // Helper para colores de los roles
    const getBadgeClass = (rol) => {
        switch(rol) {
            case 'Administrador': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Conserje': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
            default: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans transition-colors duration-200">
            <Header volverA="/admin" />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* Encabezado de la página */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">👥 Gestión de Usuarios</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Mostrando <strong className="text-slate-700 dark:text-slate-200">{usuariosFiltrados.length}</strong> usuarios registrados
                        </p>
                    </div>
                </div>

                {/* Filtros y Búsqueda */}
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <label htmlFor="search" className="sr-only">Buscar usuario</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-slate-400">🔍</span>
                            </div>
                            <input 
                                id="search"
                                type="text" 
                                placeholder="Buscar por nombre, RUT o email..." 
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="rol" className="sr-only">Filtrar por rol</label>
                            <select 
                                id="rol"
                                value={filtroRol} 
                                onChange={(e) => setFiltroRol(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                            >
                                <option value="">Todos los roles</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Conserje">Conserje</option>
                                <option value="Residente">Residente</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabla de Usuarios (Mobile-First: scroll horizontal) */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                    <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">RUT</th>
                                    <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Nombre</th>
                                    <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Rol</th>
                                    <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {usuariosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                            No se encontraron usuarios con esos filtros.
                                        </td>
                                    </tr>
                                ) : (
                                    usuariosFiltrados.map(u => (
                                        <tr key={u.rut} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-300">
                                                {enmascararRut(u.rut)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-slate-800 dark:text-white">{u.nombre}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{u.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeClass(u.rol)}`}>
                                                    {u.rol}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => {
                                                        setUsuarioAEliminar(u);
                                                        setModalEliminar(true);
                                                    }}
                                                    className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    aria-label={`Eliminar usuario ${u.nombre}`}
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* --- MODAL DE ELIMINACIÓN (a11y) --- */}
            {modalEliminar && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                    role="dialog" 
                    aria-modal="true" 
                    aria-labelledby="modal-title"
                >
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <h2 id="modal-title" className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                                ⚠️ Confirmar eliminación
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                ¿Estás seguro de que deseas eliminar a <strong>{usuarioAEliminar?.nombre}</strong>? Esta acción no se puede deshacer.
                            </p>
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
                            <button 
                                onClick={() => setModalEliminar(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmarEliminar}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors shadow-sm"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsuarios;