import { getOneUser, createTask } from './scripts/controllers/index.js';
import { validar, obtenerClaseEstado, obtenerEtiquetaEstado, obtenerTextoFechaHoraActual, obtenerInicialesUsuario } from './scripts/js/index.js';
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
const seccionBusqueda = document.querySelector('.search-section');

const modalOverlay = document.querySelector('#feedbackModal');
const modalContent = document.querySelector('#feedbackModalContent');

let usuarioActual = null;
let totalTareas = 0;

const reglasBusqueda = {
    documento: { required: true, mensaje: 'Por favor ingrese un número de documento válido.' }
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
            mostrarModalFeedback(
                'error',
                'Error al Guardar',
                'Error al guardar la tarea. Verifique la conexión con el servidor.'
            );
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
