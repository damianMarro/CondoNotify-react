// src/utils/validaciones.js

export function validarRUT(rut) {
    if (rut.length < 7 || rut.length > 9) return false;
    if (!/^[0-9]+[0-9Kk]$/.test(rut)) return false;

    let suma = 0;
    let multiplo = 2;
    for (let i = rut.length - 2; i >= 0; i--) {
        suma += parseInt(rut.charAt(i)) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    const resto = suma % 11;
    const dvEsperado = 11 - resto;
    let dvCalculado;
    if (dvEsperado === 11) dvCalculado = '0';
    else if (dvEsperado === 10) dvCalculado = 'K';
    else dvCalculado = dvEsperado.toString();
    return dvCalculado === rut.charAt(rut.length - 1).toUpperCase();
}

export function validarEmail(email) {
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com', '@condonotify.cl'];
    if (email.length > 100) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    return dominiosPermitidos.some(d => email.endsWith(d));
}

export function validarPassword(pass) {
    if (pass.length < 6 || pass.length > 12) return false;
    if (!/[0-9]/.test(pass)) return false;
    if (!/[a-zA-Z]/.test(pass)) return false;
    return true;
}

export function formatearPrecio(precio) {
    if (precio === 0) return 'FREE';
    return '$' + Number(precio).toLocaleString('es-CL');
}

export function formatearFecha(iso) {
    if (!iso) return '';
    const [yyyy, mm, dd] = iso.split('-');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${dd}/${meses[parseInt(mm) - 1]}/${yyyy}`;
}