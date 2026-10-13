import {createContext, useContext, useState } from 'react';
import Storage from '../utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const[usuario, setUsuario] = useState(() => {
        return Storage.get(Storage.KEYS.SESION_ACTIVA);
    });

    function login(rut, password) {
        const usuarios = Storage.get(Storage.KEYS.USUARIOS) || [];
        const encontrado = usuarios.find(u => u.rut === rut && u.password === password );

            if (encontrado) {
                Storage.save(Storage.KEYS.SESION_ACTIVA, encontrado);
                Storage.registrarLog(encontrado.nombre, 'LOGIN', `Ingreso como ${encontrado.rol}`);
                setUsuario(encontrado);
                return {exito: true, rol: encontrado.rol };
            }
            return{exito: false};
    }

    function logout(){
        if(usuario) {
            Storage.registrarLog(usuario.nombre, 'LOGOUT', 'cierre de sesion');
        }
       Storage.remove(Storage.KEYS.SESION_ACTIVA);
       setUsuario(null); 
    }

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}


/* FLUJO DE AUTHCONTEXT

1. Usuario entra a la app
   ↓
2. <AuthProvider> se monta (envuelve toda la app)
   ↓
3. useState inicializa "usuario" leyendo Storage.get(SESION_ACTIVA)
   - Si había sesión → usuario = { nombre: 'Admin', rol: 'Administrador', ... }
   - Si no → usuario = null
   ↓
4. Componentes hijos usan useAuth() para leer { usuario, login, logout }
   ↓
5. Usuario escribe RUT y contraseña en Login.jsx
   ↓
6. Login.jsx llama a login(rut, password)
   ↓
7. login() busca en Storage. Si encuentra:
   - Storage.save(SESION_ACTIVA, encontrado) → Guarda sesión
   - setUsuario(encontrado) → Actualiza el estado
   - return { exito: true, rol: 'Administrador' }
   ↓
8. Login.jsx recibe { exito: true, rol } y navega a /admin
   ↓
9. Como el estado cambió, TODOS los componentes que usan useAuth se actualizan
   ↓
10. El Header ahora muestra el nombre del usuario y el botón "Cerrar Sesión"
**/ 







