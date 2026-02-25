export function obtenerClaseEstado(estado) {
    if (estado === 'finalizada') return 'status--completed';
    if (estado === 'en-proceso') return 'status--in-progress';
    if (estado === 'incompleta') return 'status--pending';
    return 'status--pending';
}

export function obtenerEtiquetaEstado(estado) {
    if (estado === 'finalizada') return 'Finalizada';
    if (estado === 'en-proceso') return 'En Proceso';
    if (estado === 'incompleta') return 'Incompleta';
    return 'Incompleta';
}

export function obtenerTextoFechaHoraActual() {
    return new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function obtenerInicialesUsuario(nombreCompleto) {
    const palabras = nombreCompleto.trim().split(/\s+/);

    if (palabras.length === 1) {
        return palabras[0].slice(0, 2).toUpperCase();
    }

    return palabras.map((palabra) => palabra[0]).join('').toUpperCase();
}
