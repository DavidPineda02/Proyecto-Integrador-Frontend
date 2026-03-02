// =============================================================================
// CONFIGURACIÓN GLOBAL DE LA APLICACIÓN - config/index.js
// =============================================================================
// Este archivo contiene toda la configuración centralizada de la aplicación.
// Incluye URLs de API, reglas de validación y constantes globales.

// =============================================================================
// CONFIGURACIÓN DE API
// =============================================================================
// URL base para todas las llamadas a la API del backend
export const urlAPI = 'http://localhost:3000';

// =============================================================================
// REGLAS DE VALIDACIÓN - BÚSQUEDA DE USUARIO
// =============================================================================
// Define las reglas de validación para el campo de documento de usuario
export const reglasBusqueda = {
    documento: {
        required: true,                                    // Campo obligatorio
        min: 8,                                           // Mínimo 8 caracteres
        max: 10,                                          // Máximo 10 caracteres
        mensaje: 'El número de documento es obligatorio.',
        mensajeMin: 'El documento debe tener mínimo 8 dígitos.',
        mensajeMax: 'El documento debe tener máximo 10 dígitos.'
    }
};

// =============================================================================
// REGLAS DE VALIDACIÓN - FORMULARIO DE TAREAS
// =============================================================================
// Define las reglas de validación para los campos del formulario de tareas
export const reglasTarea = {
    titulo: { 
        required: true, 
        mensaje: 'El título de la tarea es obligatorio.' 
    },
    estado: { 
        required: true, 
        mensaje: 'Debe seleccionar un estado para la tarea.' 
    },
    descripcion: { 
        required: true, 
        mensaje: 'La descripción de la tarea es obligatoria.' 
    }
};
