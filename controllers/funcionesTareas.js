// =============================================================================
// FUNCIONES DE MANEJO DE TAREAS - controllers/funcionesTareas.js
// =============================================================================
// Este archivo contiene todas las funciones relacionadas con el CRUD de tareas:
// creación, eliminación, actualización y renderizado en el DOM.

// Importación de dependencias necesarias para el manejo de tareas
import { deleteTask } from '../api/index.js';
import { totalTareas, estadoVacio, contenedorTareas, usuarioActual } from './variables.js';
import { actualizarContador } from './funcionesUI.js';
import { obtenerInicialesUsuario, obtenerClaseEstado, obtenerEtiquetaEstado, obtenerTextoFechaHoraActual } from '../services/index.js';
import { crearTarjetaTarea } from '../ui/index.js';

// =============================================================================
// FUNCIONES DE ELIMINACIÓN Y CREACIÓN DE TAREAS
// =============================================================================

/**
 * Elimina una tarea tanto del DOM como del servidor
 * @param {string} taskId - ID de la tarea a eliminar
 * @param {HTMLElement} card - Elemento de la tarjeta de tarea
 */
export async function eliminarTarea(taskId, card) {
    // Agrega clase CSS para animación de eliminación
    card.classList.add('eliminando');

    try {
        // Elimina la tarea del servidor
        await deleteTask(taskId);
        
        // Elimina la tarjeta del DOM
        card.remove();
        
        // Actualiza el contador de tareas
        totalTareas -= 1;
        actualizarContador();

        // Muestra el estado vacío si no hay más tareas
        if (totalTareas === 0) {
            estadoVacio.classList.remove('hidden');
        }

        // NOTA: Los siguientes comentarios están en el código original
        // Se mantienen para preservar la lógica existente
        // mostrarModalFeedback(
        //     'success',
        //     'Tarea Eliminada',
        //     'La tarea ha sido eliminada correctamente.'
        // );
    } catch (error) {
        // Remueve la animación si hay error
        card.classList.remove('eliminando');
        console.error('Error al eliminar la tarea:', error);
        
        // NOTA: Comentarios del código original
        // mostrarModalFeedback(
        //     'error',
        //     'Error al Eliminar',
        //     'No se pudo eliminar la tarea. Verifique la conexión con el servidor.'
        // );
    }
}

/**
 * Renderiza una nueva tarea en el DOM
 * Crea la tarjeta y la agrega al contenedor de tareas
 * @param {Object} tareaCreada - Objeto de la tarea creada
 */
export function pintarTareaEnDOM(tareaCreada) {
    // Construye el nombre completo del usuario
    const nombreCompleto = `${usuarioActual.firstName} ${usuarioActual.lastName}`;
    
    // Obtiene las iniciales del usuario
    const iniciales = obtenerInicialesUsuario(nombreCompleto);
    
    // Obtiene la clase CSS según el estado
    const estadoClase = obtenerClaseEstado(tareaCreada.status);
    
    // Obtiene el texto descriptivo del estado
    const estadoTexto = obtenerEtiquetaEstado(tareaCreada.status);
    
    // Obtiene la fecha y hora actual
    const fechaHora = obtenerTextoFechaHoraActual();

    // Crea la tarjeta de tarea con todos los datos
    const tarjetaTarea = crearTarjetaTarea(nombreCompleto, iniciales, tareaCreada, estadoClase, estadoTexto, fechaHora);

    // Inserta la tarjeta al principio del contenedor
    contenedorTareas.insertBefore(tarjetaTarea, contenedorTareas.firstChild);
    
    // Actualiza el contador de tareas
    totalTareas += 1;
    actualizarContador();
    
    // Oculta el estado vacío
    estadoVacio.classList.add('hidden');
}
