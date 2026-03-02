// =============================================================================
// FUNCIONES DE MANEJO DE FORMULARIOS - controllers/funcionesFormulario.js
// =============================================================================
// Este archivo contiene todas las funciones relacionadas con el manejo
// de formularios: limpieza, validación, carga de datos, etc.

// Importación de variables del DOM necesarias para los formularios
import { formularioTarea, errorTituloTarea, errorEstadoTarea, errorDescripcionTarea, inputTituloTarea, inputEstadoTarea, inputDescripcionTarea, botonGuardarTarea, contenedorTareas, estado } from './variables.js';

// =============================================================================
// FUNCIONES DE LIMPIEZA Y VALIDACIÓN DE FORMULARIOS
// =============================================================================

/**
 * Limpia completamente el formulario de tareas
 * - Resetea todos los campos
 * - Limpia mensajes de error
 * - Remueve clases de error
 * - Restablece el estado de edición
 */
export function limpiarFormularioDeTarea() {
    // Resetea el formulario a su estado inicial
    formularioTarea.reset();
    
    // Limpia todos los mensajes de error
    errorTituloTarea.textContent = '';
    errorEstadoTarea.textContent = '';
    errorDescripcionTarea.textContent = '';
    
    // Remueve las clases de error visual
    inputTituloTarea.classList.remove('error');
    inputEstadoTarea.classList.remove('error');
    inputDescripcionTarea.classList.remove('error');
    
    // Si estaba editando, habilita el botón eliminar de la tarea original
    if (estado.editandoId) {
        const btnDesbloquear = contenedorTareas.querySelector(`.btn-eliminar[data-id="${estado.editandoId}"]`);
        if (btnDesbloquear) {
            btnDesbloquear.disabled = false;
        }
    }
    
    // Restablece el estado de edición
    estado.editandoId = null;
    
    // Restablece el texto del botón a "Agregar Tarea"
    botonGuardarTarea.querySelector('.task-form__btn-text').textContent = 'Agregar Tarea';
}

/**
 * Carga los datos de una tarea existente en el formulario
 * Extrae la información de la tarjeta y la coloca en los campos correspondientes
 * @param {HTMLElement} card - Elemento de la tarjeta de tarea
 */
export function cargarTareaEnFormulario(card) {
    // Extrae el título de la tarea
    const titulo = card.querySelector('strong').textContent;
    
    // Extrae la descripción del contenido de la tarjeta
    const contenido = card.querySelector('.message-card__content');
    const nodos = contenido.childNodes;
    let descripcion = '';

    // Busca el nodo de texto que contiene la descripción
    for (const nodo of nodos) {
        if (nodo.nodeType === Node.TEXT_NODE && nodo.textContent.trim() !== '') {
            descripcion = nodo.textContent.trim();
            break;
        }
    }

    // Extrae y convierte el estado de texto a valor
    const estadoTexto = card.querySelector('.message-card__status b').textContent;
    let estadoValor = '';
    if (estadoTexto === 'En Proceso') estadoValor = 'en-proceso';
    if (estadoTexto === 'Incompleta') estadoValor = 'incompleta';
    if (estadoTexto === 'Finalizada') estadoValor = 'finalizada';

    // Carga los datos en el formulario
    inputTituloTarea.value = titulo;
    inputDescripcionTarea.value = descripcion;
    inputEstadoTarea.value = estadoValor;

    // Deshabilita el botón eliminar de la tarea que se está editando
    const btnEliminarCard = card.querySelector('.btn-eliminar');
    if (btnEliminarCard) {
        btnEliminarCard.disabled = true;
    }

    // Cambia el texto del botón a "Editar Tarea"
    botonGuardarTarea.querySelector('.task-form__btn-text').textContent = 'Editar Tarea';
    
    // Pone el foco en el campo de título
    inputTituloTarea.focus();
}
