// =============================================================================
// CONTROLADOR PRINCIPAL DE LA APLICACIÓN - controllers/index.js
// =============================================================================
// Este archivo contiene la función principal que inicializa toda la aplicación.
// Configura todos los event listeners y maneja la lógica principal de la UI.

// Importación de todas las variables y selectores del DOM
import { 
    formularioBusqueda, inputDocumento, errorDocumento, formularioTarea, inputTituloTarea, 
    inputEstadoTarea, inputDescripcionTarea, botonGuardarTarea, errorTituloTarea, 
    errorEstadoTarea, errorDescripcionTarea, contenedorTareas, estadoVacio, 
    contadorTareas, seccionFormularioTarea, seccionListaTareas, modalOverlay, 
    modalContent, usuarioActual, totalTareas, editandoId 
} from './variables.js';

// Importación de configuración y reglas de validación
import { urlAPI, reglasBusqueda, reglasTarea } from '../config/index.js';

// Importación de funciones de interfaz de usuario
import { actualizarContador, ocultarSeccionesInferiores, mostrarSeccionesInferiores, cerrarModalFeedback, manejarTeclaModal, mostrarModalFeedback } from './funcionesUI.js';

// Importación de funciones de manejo de formularios
import { limpiarFormularioDeTarea, cargarTareaEnFormulario } from './funcionesFormulario.js';

// Importación de funciones de manejo de tareas
import { eliminarTarea, pintarTareaEnDOM } from './funcionesTareas.js';

// Importación de funciones de API
import { getOneUser, createTask, deleteTask, patchTask } from '../api/index.js';

// Importación de servicios de utilidad
import { obtenerClaseEstado, obtenerEtiquetaEstado, obtenerTextoFechaHoraActual, obtenerInicialesUsuario } from '../services/index.js';

// Importación de funciones de validación
import { validar } from '../utils/index.js';

// Importación de componentes de UI
import { crearContenidoModal, crearTarjetaTarea } from '../ui/index.js';

// =============================================================================
// FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
// =============================================================================

/**
 * Inicializa toda la aplicación
 * Configura los formularios, establece los event listeners
 * y prepara la interfaz para su uso
 */
export function iniciarAplicacion() {
    // Inicializa el estado de la UI
    ocultarSeccionesInferiores();
    actualizarContador();

    // Previene el comportamiento por defecto de los formularios
    formularioBusqueda.setAttribute('onsubmit', 'return false;');
    formularioTarea.setAttribute('onsubmit', 'return false;');

    // =============================================================================
    // EVENT LISTENER: BÚSQUEDA DE USUARIO
    // =============================================================================
    formularioBusqueda.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        // Limpia estados previos
        errorDocumento.textContent = '';
        inputDocumento.classList.remove('error');
        cerrarModalFeedback();

        // Valida el formulario de búsqueda
        const { valido, errores } = validar(formularioBusqueda, reglasBusqueda);

        if (!valido) {
            // Maneja errores de validación
            inputDocumento.classList.add('error');
            usuarioActual = null;
            ocultarSeccionesInferiores();
            limpiarFormularioDeTarea();

            mostrarModalFeedback(
                'error',
                'Error de Búsqueda',
                errores.documento || 'Dato inválido.',
                'Por favor verifique el campo e intente nuevamente.'
            );
            return;
        }

        const documento = inputDocumento.value.trim();

        try {
            // Busca el usuario en la API
            const usuario = await getOneUser(documento);

            // Usuario encontrado: actualiza el estado
            usuarioActual = usuario;
            mostrarSeccionesInferiores();
            inputTituloTarea.focus();

            mostrarModalFeedback(
                'success',
                'Usuario Verificado',
                [
                    { etiqueta: 'Nombre:', valor: `${usuario.firstName} ${usuario.lastName}` },
                    { etiqueta: 'Email:', valor: usuario.email }
                ]
            );
        } catch {
            // Usuario no encontrado
            usuarioActual = null;
            inputDocumento.classList.add('error');
            ocultarSeccionesInferiores();
            limpiarFormularioDeTarea();

            mostrarModalFeedback(
                'error',
                'Usuario No Encontrado',
                'El número de documento ingresado no corresponde a ningún usuario registrado.',
                'Verifique el número de documento e intente nuevamente.'
            );
        }
    });

    // =============================================================================
    // EVENT LISTENER: FORMULARIO DE TAREAS
    // =============================================================================
    formularioTarea.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        evento.stopPropagation();

        // Limpia estados de error previos
        inputTituloTarea.classList.remove('error');
        inputEstadoTarea.classList.remove('error');
        inputDescripcionTarea.classList.remove('error');
        errorTituloTarea.textContent = '';
        errorEstadoTarea.textContent = '';
        errorDescripcionTarea.textContent = '';

        // Valida el formulario de tarea
        const { valido, errores } = validar(formularioTarea, reglasTarea);

        if (!valido) {
            // Maneja errores de validación específicos
            if (errores.titulo) {
                inputTituloTarea.classList.add('error');
                errorTituloTarea.textContent = errores.titulo;
            }
            if (errores.estado) {
                inputEstadoTarea.classList.add('error');
                errorEstadoTarea.textContent = errores.estado;
            }
            if (errores.descripcion) {
                inputDescripcionTarea.classList.add('error');
                errorDescripcionTarea.textContent = errores.descripcion;
            }
            return;
        }

        if (editandoId) {
            // MODO EDICIÓN: Actualiza tarea existente
            try {
                await patchTask(editandoId, {
                    title: inputTituloTarea.value.trim(),
                    body: inputDescripcionTarea.value.trim(),
                    status: inputEstadoTarea.value
                });

                // Actualiza la tarjeta en el DOM
                const cardEditada = contenedorTareas.querySelector(`[data-id="${editandoId}"]`);
                if (cardEditada) {
                    const card = cardEditada.closest('.message-card');
                    card.querySelector('strong').textContent = inputTituloTarea.value.trim();

                    // Actualiza la descripción
                    const contenido = card.querySelector('.message-card__content');
                    for (const nodo of contenido.childNodes) {
                        if (nodo.nodeType === Node.TEXT_NODE && nodo.textContent.trim() !== '') {
                            nodo.textContent = inputDescripcionTarea.value.trim();
                            break;
                        }
                    }

                    // Actualiza el estado
                    const divEstado = card.querySelector('.message-card__status');
                    divEstado.className = `message-card__status ${obtenerClaseEstado(inputEstadoTarea.value)}`;
                    divEstado.querySelector('b').textContent = obtenerEtiquetaEstado(inputEstadoTarea.value);
                }

                limpiarFormularioDeTarea();
                // NOTA: Comentarios del código original
                // mostrarModalFeedback(
                //     'success',
                //     'Tarea Actualizada',
                //     'La tarea ha sido actualizada correctamente.'
                // );
            } catch (error) {
                console.error('Error al actualizar la tarea:', error);
                // NOTA: Comentarios del código original
                // mostrarModalFeedback(
                //     'error',
                //     'Error al Actualizar',
                //     'No se pudo actualizar la tarea. Verifique la conexión con el servidor.'
                // );
            }
        } else {
            // MODO CREACIÓN: Crea nueva tarea
            try {
                const nuevaTarea = await createTask({
                    userId: usuarioActual.id,
                    title: inputTituloTarea.value.trim(),
                    body: inputDescripcionTarea.value.trim(),
                    status: inputEstadoTarea.value
                });

                // Renderiza la nueva tarea en el DOM
                pintarTareaEnDOM(nuevaTarea);
                limpiarFormularioDeTarea();
                inputTituloTarea.focus();
            } catch (error) {
                console.error('Error al crear la tarea:', error);
                // NOTA: Comentarios del código original
                // mostrarModalFeedback(
                //     'error',
                //     'Error al Guardar',
                //     'Error al guardar la tarea. Verifique la conexión con el servidor.'
                // );
            }
        }
    });

    // =============================================================================
    // EVENT LISTENER: CLICKS EN CONTENEDOR DE TAREAS
    // =============================================================================
    contenedorTareas.addEventListener('click', async (evento) => {
        const btnEditar = evento.target.closest('.btn-editar');

        if (btnEditar) {
            // Maneja clic en botón editar
            const id = btnEditar.getAttribute('data-id');
            const card = btnEditar.closest('.message-card');
            editandoId = id;
            cargarTareaEnFormulario(card);
            return;
        }

        const btnEliminar = evento.target.closest('.btn-eliminar');

        if (btnEliminar) {
            // Maneja clic en botón eliminar
            const confirmado = confirm('¿Está seguro de que desea eliminar esta tarea?');
            if (!confirmado) return;

            const id = btnEliminar.getAttribute('data-id');
            const card = btnEliminar.closest('.message-card');
            await eliminarTarea(id, card);
        }
    });

    // =============================================================================
    // EVENT LISTENERS: LIMPIEZA DE ERRORES
    // =============================================================================

    // Limpia error de documento al escribir
    inputDocumento.addEventListener('input', () => {
        errorDocumento.textContent = '';
    });

    // Limpia error de título al escribir
    inputTituloTarea.addEventListener('input', () => {
        errorTituloTarea.textContent = '';
        inputTituloTarea.classList.remove('error');
    });

    // Limpia error de estado al cambiar
    inputEstadoTarea.addEventListener('change', () => {
        errorEstadoTarea.textContent = '';
        inputEstadoTarea.classList.remove('error');
    });

    // Limpia error de descripción al escribir
    inputDescripcionTarea.addEventListener('input', () => {
        errorDescripcionTarea.textContent = '';
        inputDescripcionTarea.classList.remove('error');
    });
}
