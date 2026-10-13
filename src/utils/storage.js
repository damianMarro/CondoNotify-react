/**
 * storage.js
 * Módulo encargado de la gestión de persistencia en LocalStorage.
 * Proporciona funciones para guardar, obtener y eliminar datos.
 * Proyecto: CondoNotify - DSY1104
 */



/**
 Abres index.html → ingresas RUT + contraseña.

auth.js valida → guarda sesión en localStorage.

Redirige a pages/dashboard-{rol}.html.

El dashboard verifica que la sesión sea válida y del rol correcto.

Si alguien intenta acceder a un dashboard sin permiso → lo devuelve al login.

El botón "Cerrar Sesión" elimina la sesión y vuelve al login.
 */

const Storage = {
    // =========================================
    // CLAVES DE ALMACENAMIENTO
    // =========================================
    KEYS: {
        USUARIOS: 'condonotify_usuarios',
        PRODUCTOS: 'condonotify_productos',
        DELIVERIES: 'condonotify_deliveries',
        INVITADOS: 'condonotify_invitados',
        REPORTES: 'condonotify_reportes',
        ANUNCIOS: 'condonotify_anuncios',
        LOGS: 'condonotify_logs',
        SESION_ACTIVA: 'condonotify_sesion'
    },

    /**
     * Guarda un objeto en LocalStorage.
     * @param {string} key - Clave de almacenamiento.
     * @param {any} data - Datos a guardar.
     */
    save(key, data) {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
        } catch (error) {
            console.error(`Error al guardar en LocalStorage [${key}]:`, error);
        }
    },

    /**
     * Obtiene un objeto desde LocalStorage.
     * @param {string} key - Clave de almacenamiento.
     * @returns {any} - Datos parseados o null si no existen.
     */
    get(key) {
        try {
            const jsonData = localStorage.getItem(key);
            return jsonData ? JSON.parse(jsonData) : null;
        } catch (error) {
            console.error(`Error al leer de LocalStorage [${key}]:`, error);
            return null;
        }
    },

    /**
     * Elimina un elemento de LocalStorage.
     * @param {string} key - Clave de almacenamiento.
     */
    remove(key) {
        localStorage.removeItem(key);
    },

    /**
     * Limpia toda la sesión activa.
     */
    logout() {
        this.remove(this.KEYS.SESION_ACTIVA);
    },

    /**
     * Registra una acción en los logs del sistema.
     * @param {string} usuario - Nombre del usuario.
     * @param {string} accion - Acción realizada.
     * @param {string} detalle - Detalle adicional.
     */
    registrarLog(usuario, accion, detalle = '') {
        const logs = this.get(this.KEYS.LOGS) || [];
        logs.push({
            usuario,
            accion,
            detalle,
            fecha: new Date().toISOString()
        });
        this.save(this.KEYS.LOGS, logs);
    },

    /**
     * Inicializa datos de prueba si no existen.
     * Se simulan 3 roles base: Administrador, Conserje y Residente.
     * RUTs válidos según algoritmo de dígito verificador chileno.
     */
    initTestData() {
        const usuarios = this.get(this.KEYS.USUARIOS);
        
        // Si ya existen usuarios, no sobreescribimos
        if (usuarios && usuarios.length > 0) {
            console.log('Usuarios ya inicializados en LocalStorage.');
            return;
        }

        const testUsers = [
            {
                rut: '190110222',       // digito verificador es 2 o k?
                nombre: 'Admin General',
                email: 'admin@condonotify.cl',
                password: 'admin123',
                rol: 'Administrador',
                telefono: '+56911111111',
                direccion: 'Oficina Central 1'
            },
            {
                rut: '222222222',       
                nombre: 'Carlos Conserje',
                email: 'conserje@condonotify.cl',
                password: 'conserje123',
                rol: 'Conserje',
                telefono: '+56922222222',
                direccion: 'Conserjería Torre A'
            },
            {
                rut: '187848601',       // datos personales como residente 
                nombre: 'Damian Marro',
                email: 'da.marro@duocuc.cl',
                password: '129D6A19d.',
                rol: 'Residente',
                telefono: '+56956201095',
                direccion: 'Av. providencia 1645, depto 2206'
            }
        ];

        this.save(this.KEYS.USUARIOS, testUsers);
        console.log('✅ Datos de prueba inicializados en LocalStorage.');
        console.table(testUsers);
    }
};

// Inicializar datos de prueba al cargar el script
Storage.initTestData();
export default Storage;