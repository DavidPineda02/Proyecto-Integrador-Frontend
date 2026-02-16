export function esTextoValido(texto) {
    return texto.trim().length > 0;
}

export function validarDatosDeTarea(titulo, descripcion, estado) {
    let errorTitulo = '';
    let errorDescripcion = '';
    let errorEstado = '';

    if (!esTextoValido(titulo)) {
        errorTitulo = 'El título de la tarea es obligatorio.';
    }

    if (!esTextoValido(estado)) {
        errorEstado = 'Debe seleccionar un estado para la tarea.';
    }

    if (!esTextoValido(descripcion)) {
        errorDescripcion = 'La descripción de la tarea es obligatoria.';
    }

    return {
        errorTitulo,
        errorEstado,
        errorDescripcion,
        esValido: !errorTitulo && !errorEstado && !errorDescripcion
    };
}
