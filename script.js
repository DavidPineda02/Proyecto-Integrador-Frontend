import { getOneUser } from './scripts/get.js';
import { createTask } from './scripts/post.js';
import { esTextoValido, validarDatosDeTarea } from './scripts/js/validaciones.js';
import { crearMarcadoParrafos } from './scripts/js/marcado.js';
import { obtenerClaseEstado, obtenerEtiquetaEstado, obtenerTextoFechaHoraActual, obtenerInicialesUsuario } from './scripts/js/tareas.js';

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

let usuarioActual = null;
let totalTareas = 0;

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

function limpiarTarjetaFeedbackBusqueda() {
    const tarjetaExistente = document.getElementById('userFeedbackCard');
    if (tarjetaExistente) tarjetaExistente.remove();
}

function mostrarTarjetaFeedback(tipo, titulo, texto, pista = '') {
    limpiarTarjetaFeedbackBusqueda();

    const tarjeta = document.createElement('div');
    tarjeta.id = 'userFeedbackCard';
    tarjeta.className = `feedback-card feedback-card--${tipo}`;

    let pistaHTML = '';

    if (pista) {
        pistaHTML = `<p class="feedback-card__hint">${pista}</p>`;
    }

    tarjeta.innerHTML = `
        <h3 class="feedback-card__title">${titulo}</h3>
        ${crearMarcadoParrafos(texto)}
        ${pistaHTML}
    `;

    seccionBusqueda.appendChild(tarjeta);
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
    const tarjetaTarea = document.createElement('div');
    tarjetaTarea.className = 'message-card';

    const nombreCompleto = `${usuarioActual.firstName} ${usuarioActual.lastName}`;
    const iniciales = obtenerInicialesUsuario(nombreCompleto);
    const estadoClase = obtenerClaseEstado(tareaCreada.status);
    const estadoTexto = obtenerEtiquetaEstado(tareaCreada.status);
    const fechaHora = obtenerTextoFechaHoraActual();

    tarjetaTarea.innerHTML = `
        <div class="message-card__header">
            <div class="message-card__user">
                <div class="message-card__avatar">${iniciales}</div>
                <span class="message-card__username">${nombreCompleto}</span>
            </div>
            <span class="message-card__timestamp">${fechaHora}</span>
        </div>
        <div class="message-card__content">
            <strong>${tareaCreada.title}</strong><br>
            ${tareaCreada.body}
            <div class="message-card__status ${estadoClase}">
                Estado: <b>${estadoTexto}</b>
            </div>
        </div>
    `;

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
        limpiarTarjetaFeedbackBusqueda();

        const documento = inputDocumento.value.trim();

        if (!esTextoValido(documento)) {
            usuarioActual = null;
            ocultarSeccionesInferiores();
            limpiarFormularioDeTarea();

            mostrarTarjetaFeedback(
                'error',
                'Error de Búsqueda',
                'Por favor ingrese un número de documento válido.',
                'Por favor verifique el campo e intente nuevamente.'
            );
            return;
        }

        try {
            const usuario = await getOneUser(documento);

            usuarioActual = usuario;
            mostrarSeccionesInferiores();
            inputTituloTarea.focus();

            mostrarTarjetaFeedback(
                'success',
                'Usuario Verificado',
                [
                    `<strong>Nombre:</strong> ${usuario.firstName} ${usuario.lastName}`,
                    `<strong>Email:</strong> ${usuario.email}`
                ]
            );
        } catch {
            usuarioActual = null;
            ocultarSeccionesInferiores();
            limpiarFormularioDeTarea();

            mostrarTarjetaFeedback(
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

        const titulo = inputTituloTarea.value;
        const estado = inputEstadoTarea.value;
        const descripcion = inputDescripcionTarea.value;

        const validacion = validarDatosDeTarea(titulo, descripcion, estado);

        errorTituloTarea.textContent = validacion.errorTitulo;
        errorEstadoTarea.textContent = validacion.errorEstado || '';
        errorDescripcionTarea.textContent = validacion.errorDescripcion;

        inputTituloTarea.classList.toggle('error', Boolean(validacion.errorTitulo));
        inputEstadoTarea.classList.toggle('error', Boolean(validacion.errorEstado));
        inputDescripcionTarea.classList.toggle('error', Boolean(validacion.errorDescripcion));

        if (!validacion.esValido) return;

        /*
        if (!usuarioActual) {
            errorDocumento.textContent = 'Primero busque un usuario válido.';
            return;
        }
        */

        try {
            const nuevaTarea = await createTask({
                userId: usuarioActual.id,
                title: titulo.trim(),
                body: descripcion.trim(),
                status: estado
            });

            pintarTareaEnDOM(nuevaTarea);
            limpiarFormularioDeTarea();
            inputTituloTarea.focus();
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            alert('Error al guardar la tarea. Verifique la conexión con el servidor.');
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
