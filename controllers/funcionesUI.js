// =============================================================================
// FUNCIONES DE INTERFAZ DE USUARIO - controllers/funcionesUI.js
// =============================================================================
// Este archivo contiene todas las funciones relacionadas con la manipulación
// de la interfaz de usuario: mostrar/ocultar elementos, actualizar contadores,
// manejar modales, etc.

// Importación de variables del DOM y funciones de UI
import { estado, contadorTareas, seccionFormularioTarea, seccionListaTareas, inputTituloTarea, inputEstadoTarea, inputDescripcionTarea, botonGuardarTarea, modalOverlay, modalContent } from './variables.js';
import { crearContenidoModal } from '../ui/index.js';

let manejadorCerrarModal = null;
let manejadorTeclaModal = null;

// =============================================================================
// FUNCIONES DE CONTADOR Y VISUALIZACIÓN
// =============================================================================

/**
 * Actualiza el texto del contador de tareas
 * Muestra "1 tarea" o "X tareas" según corresponda
 */
export function actualizarContador() {
    let textoContador = `${estado.totalTareas} tarea`;

    // Agrega 's' si hay más de una tarea
    if (estado.totalTareas !== 1) {
        textoContador = `${textoContador}s`;
    }

    contadorTareas.textContent = textoContador;
}

/**
 * Oculta las secciones inferiores de la aplicación
 * Se usa cuando no hay usuario autenticado
 */
export function ocultarSeccionesInferiores() {
    seccionFormularioTarea.classList.add('hidden');
    seccionListaTareas.classList.add('hidden');

    // Deshabilita todos los campos del formulario
    inputTituloTarea.disabled = true;
    inputEstadoTarea.disabled = true;
    inputDescripcionTarea.disabled = true;
    botonGuardarTarea.disabled = true;
}

/**
 * Muestra las secciones inferiores de la aplicación
 * Se usa cuando hay usuario autenticado
 */
export function mostrarSeccionesInferiores() {
    seccionFormularioTarea.classList.remove('hidden');
    seccionListaTareas.classList.remove('hidden');

    // Habilita todos los campos del formulario
    inputTituloTarea.disabled = false;
    inputEstadoTarea.disabled = false;
    inputDescripcionTarea.disabled = false;
    botonGuardarTarea.disabled = false;
}

// =============================================================================
// FUNCIONES DE MANEJO DE MODALES
// =============================================================================

/**
 * Cierra el modal de feedback
 * Remueve la clase visible y elimina el event listener de teclado
 */
export function cerrarModalFeedback() {
    modalOverlay.classList.remove('modal-overlay--visible');
    
    if (manejadorTeclaModal) {
        document.removeEventListener('keydown', manejadorTeclaModal);
        manejadorTeclaModal = null;
    }
    
    const botonCerrar = document.getElementById('modalCloseBtn');
    if (botonCerrar && manejadorCerrarModal) {
        botonCerrar.removeEventListener('click', manejadorCerrarModal);
        manejadorCerrarModal = null;
    }
}

/**
 * Muestra el modal de feedback con el contenido especificado
 * @param {string} tipo - Tipo de modal ('success', 'error', 'warning')
 * @param {string} titulo - Título del modal
 * @param {string|Array} texto - Contenido del modal
 * @param {string} pista - Texto adicional opcional
 */
export function mostrarModalFeedback(tipo, titulo, texto, pista = '') {
    // Cierra cualquier modal abierto primero para evitar acumulación
    cerrarModalFeedback();
    
    // Configura la clase CSS según el tipo
    modalContent.className = `modal-content modal-content--${tipo}`;
    modalContent.textContent = '';

    // Crea y agrega el contenido al modal
    const fragmento = crearContenidoModal(tipo, titulo, texto, pista);
    modalContent.appendChild(fragmento);

    // Muestra el modal
    modalOverlay.classList.add('modal-overlay--visible');

    // Crea los handlers para esta instancia del modal
    manejadorCerrarModal = () => cerrarModalFeedback();
    manejadorTeclaModal = (evento) => {
        if (evento.key === 'Enter') {
            evento.preventDefault();
            cerrarModalFeedback();
        }
    };

    // Configura los event listeners
    const botonCerrar = document.getElementById('modalCloseBtn');
    botonCerrar.addEventListener('click', manejadorCerrarModal);
    document.addEventListener('keydown', manejadorTeclaModal);
    botonCerrar.focus();
}
