import { getOneUser, createTask, deleteTask, patchTask } from './scripts/controllers/index.js';
import { obtenerClaseEstado, obtenerEtiquetaEstado, obtenerTextoFechaHoraActual, obtenerInicialesUsuario } from './scripts/utils/index.js';
import { validar } from './scripts/validations/index.js';
import { crearContenidoModal, crearTarjetaTarea } from './scripts/components/index.js';

export const urlAPI = 'http://localhost:3000';

const formularioBusqueda = document.querySelector('#searchForm');
const inputDocumento = document.querySelector('#userDocument');
const errorDocumento = document.querySelector('#userDocumentError');

const formularioTarea = document.querySelector('#taskForm');
const inputTituloTarea = document.querySelector('#taskName');
const inputEstadoTarea = document.querySelector('#taskStatus');
const inputDescripcionTarea = document.querySelector('#taskDescription');
const botonGuardarTarea = document.querySelector('#submitBtn');

const errorTituloTarea = document.querySelector('#taskNameError');
const errorEstadoTarea = document.querySelector('#taskStatusError');
const errorDescripcionTarea = document.querySelector('#taskDescriptionError');

const contenedorTareas = document.querySelector('#tasksContainer');
const estadoVacio = document.querySelector('#emptyState');
const contadorTareas = document.querySelector('#tasksCount');

const seccionFormularioTarea = document.querySelector('.task-form-section');
const seccionListaTareas = document.querySelector('.tasks-section');

const modalOverlay = document.querySelector('#feedbackModal');
const modalContent = document.querySelector('#feedbackModalContent');

let usuarioActual = null;
let totalTareas = 0;
let editandoId = null;

const reglasBusqueda = {
    documento: {
        required: true,
        min: 8,
        max: 10,
        mensaje: 'El número de documento es obligatorio.',
        mensajeMin: 'El documento debe tener mínimo 8 dígitos.',
        mensajeMax: 'El documento debe tener máximo 10 dígitos.'
    }
};

const reglasTarea = {
    titulo: { required: true, mensaje: 'El título de la tarea es obligatorio.' },
    estado: { required: true, mensaje: 'Debe seleccionar un estado para la tarea.' },
    descripcion: { required: true, mensaje: 'La descripción de la tarea es obligatoria.' }
};

function actualizarContador() {
    let textoContador = `${totalTareas} tarea`;

    if (totalTareas !== 1) {
        textoContador = `${textoContador}s`;
    }

    contadorTareas.textContent = textoContador;
}

function ocultarSeccionesInferiores() {
    seccionFormularioTarea.classList.add('hidden');
    seccionListaTareas.classList.add('hidden');

    inputTituloTarea.disabled = true;
    inputEstadoTarea.disabled = true;
    inputDescripcionTarea.disabled = true;
    botonGuardarTarea.disabled = true;
}

function mostrarSeccionesInferiores() {
    seccionFormularioTarea.classList.remove('hidden');
    seccionListaTareas.classList.remove('hidden');

    inputTituloTarea.disabled = false;
    inputEstadoTarea.disabled = false;
    inputDescripcionTarea.disabled = false;
    botonGuardarTarea.disabled = false;
}

function cerrarModalFeedback() {
    modalOverlay.classList.remove('modal-overlay--visible');
    document.removeEventListener('keydown', manejarTeclaModal);
}

function manejarTeclaModal(evento) {
    if (evento.key === 'Enter') {
        evento.preventDefault();
        cerrarModalFeedback();
    }
}

function mostrarModalFeedback(tipo, titulo, texto, pista = '') {
    modalContent.className = `modal-content modal-content--${tipo}`;
    modalContent.textContent = '';

    const fragmento = crearContenidoModal(tipo, titulo, texto, pista);
    modalContent.appendChild(fragmento);

    modalOverlay.classList.add('modal-overlay--visible');

    const botonCerrar = document.getElementById('modalCloseBtn');
    botonCerrar.addEventListener('click', cerrarModalFeedback);
    document.addEventListener('keydown', manejarTeclaModal);
    botonCerrar.focus();
}

function limpiarFormularioDeTarea() {
    formularioTarea.reset();
    errorTituloTarea.textContent = '';
    errorEstadoTarea.textContent = '';
    errorDescripcionTarea.textContent = '';
    inputTituloTarea.classList.remove('error');
    inputEstadoTarea.classList.remove('error');
    inputDescripcionTarea.classList.remove('error');
    if (editandoId) {
        const btnDesbloquear = contenedorTareas.querySelector(`.btn-eliminar[data-id="${editandoId}"]`);
        if (btnDesbloquear) {
            btnDesbloquear.disabled = false;
        }
    }
    editandoId = null;
    botonGuardarTarea.querySelector('.task-form__btn-text').textContent = 'Agregar Tarea';
}

function cargarTareaEnFormulario(card) {
    const titulo = card.querySelector('strong').textContent;
    const contenido = card.querySelector('.message-card__content');
    const nodos = contenido.childNodes;
    let descripcion = '';

    for (const nodo of nodos) {
        if (nodo.nodeType === Node.TEXT_NODE && nodo.textContent.trim() !== '') {
            descripcion = nodo.textContent.trim();
            break;
        }
    }

    const estadoTexto = card.querySelector('.message-card__status b').textContent;
    let estadoValor = '';
    if (estadoTexto === 'En Proceso') estadoValor = 'en-proceso';
    if (estadoTexto === 'Incompleta') estadoValor = 'incompleta';
    if (estadoTexto === 'Finalizada') estadoValor = 'finalizada';

    inputTituloTarea.value = titulo;
    inputDescripcionTarea.value = descripcion;
    inputEstadoTarea.value = estadoValor;

    const btnEliminarCard = card.querySelector('.btn-eliminar');
    btnEliminarCard.disabled = true;

    botonGuardarTarea.querySelector('.task-form__btn-text').textContent = 'Editar Tarea';
    inputTituloTarea.focus();
}

async function eliminarTarea(taskId, card) {
    card.classList.add('eliminando');

    try {
        await deleteTask(taskId);
        card.remove();
        totalTareas -= 1;
        actualizarContador();

        if (totalTareas === 0) {
            estadoVacio.classList.remove('hidden');
        }

        // mostrarModalFeedback(
        //     'success',
        //     'Tarea Eliminada',
        //     'La tarea ha sido eliminada correctamente.'
        // );
    } catch (error) {
        card.classList.remove('eliminando');
        console.error('Error al eliminar la tarea:', error);
        // mostrarModalFeedback(
        //     'error',
        //     'Error al Eliminar',
        //     'No se pudo eliminar la tarea. Verifique la conexión con el servidor.'
        // );
    }
}

function pintarTareaEnDOM(tareaCreada) {
    const nombreCompleto = `${usuarioActual.firstName} ${usuarioActual.lastName}`;
    const iniciales = obtenerInicialesUsuario(nombreCompleto);
    const estadoClase = obtenerClaseEstado(tareaCreada.status);
    const estadoTexto = obtenerEtiquetaEstado(tareaCreada.status);
    const fechaHora = obtenerTextoFechaHoraActual();

    const tarjetaTarea = crearTarjetaTarea(nombreCompleto, iniciales, tareaCreada, estadoClase, estadoTexto, fechaHora);

    contenedorTareas.insertBefore(tarjetaTarea, contenedorTareas.firstChild);
    totalTareas += 1;
    actualizarContador();
    estadoVacio.classList.add('hidden');
}

function iniciarAplicacion() {
    ocultarSeccionesInferiores();
    actualizarContador();

    formularioBusqueda.setAttribute('onsubmit', 'return false;');
    formularioTarea.setAttribute('onsubmit', 'return false;');

    formularioBusqueda.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        errorDocumento.textContent = '';
        inputDocumento.classList.remove('error');
        cerrarModalFeedback();

        const { valido, errores } = validar(formularioBusqueda, reglasBusqueda);

        if (!valido) {
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
            const usuario = await getOneUser(documento);

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

    formularioTarea.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        evento.stopPropagation();

        inputTituloTarea.classList.remove('error');
        inputEstadoTarea.classList.remove('error');
        inputDescripcionTarea.classList.remove('error');
        errorTituloTarea.textContent = '';
        errorEstadoTarea.textContent = '';
        errorDescripcionTarea.textContent = '';

        const { valido, errores } = validar(formularioTarea, reglasTarea);

        if (!valido) {
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
            try {
                await patchTask(editandoId, {
                    title: inputTituloTarea.value.trim(),
                    body: inputDescripcionTarea.value.trim(),
                    status: inputEstadoTarea.value
                });

                const cardEditada = contenedorTareas.querySelector(`[data-id="${editandoId}"]`);
                if (cardEditada) {
                    const card = cardEditada.closest('.message-card');
                    card.querySelector('strong').textContent = inputTituloTarea.value.trim();

                    const contenido = card.querySelector('.message-card__content');
                    for (const nodo of contenido.childNodes) {
                        if (nodo.nodeType === Node.TEXT_NODE && nodo.textContent.trim() !== '') {
                            nodo.textContent = inputDescripcionTarea.value.trim();
                            break;
                        }
                    }

                    const divEstado = card.querySelector('.message-card__status');
                    divEstado.className = `message-card__status ${obtenerClaseEstado(inputEstadoTarea.value)}`;
                    divEstado.querySelector('b').textContent = obtenerEtiquetaEstado(inputEstadoTarea.value);
                }

                limpiarFormularioDeTarea();
                // mostrarModalFeedback(
                //     'success',
                //     'Tarea Actualizada',
                //     'La tarea ha sido actualizada correctamente.'
                // );
            } catch (error) {
                console.error('Error al actualizar la tarea:', error);
                // mostrarModalFeedback(
                //     'error',
                //     'Error al Actualizar',
                //     'No se pudo actualizar la tarea. Verifique la conexión con el servidor.'
                // );
            }
        } else {
            try {
                const nuevaTarea = await createTask({
                    userId: usuarioActual.id,
                    title: inputTituloTarea.value.trim(),
                    body: inputDescripcionTarea.value.trim(),
                    status: inputEstadoTarea.value
                });

                pintarTareaEnDOM(nuevaTarea);
                limpiarFormularioDeTarea();
                inputTituloTarea.focus();
            } catch (error) {
                console.error('Error al crear la tarea:', error);
                // mostrarModalFeedback(
                //     'error',
                //     'Error al Guardar',
                //     'Error al guardar la tarea. Verifique la conexión con el servidor.'
                // );
            }
        }
    });

    contenedorTareas.addEventListener('click', async (evento) => {
        const btnEditar = evento.target.closest('.btn-editar');

        if (btnEditar) {
            const id = btnEditar.getAttribute('data-id');
            const card = btnEditar.closest('.message-card');
            editandoId = id;
            cargarTareaEnFormulario(card);
            return;
        }

        const btnEliminar = evento.target.closest('.btn-eliminar');

        if (btnEliminar) {
            const confirmado = confirm('¿Está seguro de que desea eliminar esta tarea?');
            if (!confirmado) return;

            const id = btnEliminar.getAttribute('data-id');
            const card = btnEliminar.closest('.message-card');
            await eliminarTarea(id, card);
        }
    });

    inputDocumento.addEventListener('input', () => {
        errorDocumento.textContent = '';
    });

    inputTituloTarea.addEventListener('input', () => {
        errorTituloTarea.textContent = '';
        inputTituloTarea.classList.remove('error');
    });

    inputEstadoTarea.addEventListener('change', () => {
        errorEstadoTarea.textContent = '';
        inputEstadoTarea.classList.remove('error');
    });

    inputDescripcionTarea.addEventListener('input', () => {
        errorDescripcionTarea.textContent = '';
        inputDescripcionTarea.classList.remove('error');
    });
}

document.addEventListener('DOMContentLoaded', iniciarAplicacion);
