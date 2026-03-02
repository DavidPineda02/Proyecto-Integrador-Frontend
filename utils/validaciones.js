export function esTextoValido(texto) {
    return texto.trim().length > 0;
}

export const validar = (form, reglas) => {
    const errores = {};
    let valido = true;

    for (const name in reglas) {
        const campo = form.elements[name];
        const regla = reglas[name];

        if (campo.type === 'text' || campo.type === 'textarea' || campo.type === 'number') {
            const { esValido, mensaje } = validarCampoTexto(campo, regla);
            if (!esValido) {
                valido = false;
                errores[name] = mensaje;
            }
        } else if (campo.type === 'select-one') {
            const { esValido, mensaje } = validarCampoSelect(campo, regla);
            if (!esValido) {
                valido = false;
                errores[name] = mensaje;
            }
        }
    }

    if (Object.keys(errores).length !== 0) {
        valido = false;
    }

    return { valido, errores };
};

const validarCampoTexto = (elemento, regla) => {
    const valor = elemento.type === 'number' ? String(elemento.value) : elemento.value.trim();

    if (regla.required && valor === '') {
        return {
            esValido: false,
            mensaje: regla.mensaje
        };
    }

    if (!valor && valor !== '0') {
        return { esValido: true };
    }

    if (regla.min && regla.min > valor.length) {
        return {
            esValido: false,
            mensaje: regla.mensajeMin || `El campo debe tener como mínimo ${regla.min} caracteres.`
        };
    }

    if (regla.max && regla.max < valor.length) {
        return {
            esValido: false,
            mensaje: regla.mensajeMax || `El campo debe tener como máximo ${regla.max} caracteres.`
        };
    }

    return { esValido: true };
};

const validarCampoSelect = (elemento, regla) => {
    if (regla.required && elemento.selectedIndex === 0) {
        return {
            esValido: false,
            mensaje: regla.mensaje
        };
    }

    return { esValido: true };
};
