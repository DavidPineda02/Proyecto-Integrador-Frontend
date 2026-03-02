// =============================================================================
// VARIABLES GLOBALES Y SELECTORES DEL DOM - controllers/variables.js
// =============================================================================
// Este archivo centraliza todas las variables globales y selectores del DOM.
// Facilita el mantenimiento y evita duplicación de selectores.

// =============================================================================
// SELECTORES DEL DOM
// =============================================================================
// Selectores CSS para todos los elementos del DOM que se utilizan en la aplicación
export const selectores = {
    formularioBusqueda: '#searchForm',
    inputDocumento: '#userDocument',
    errorDocumento: '#userDocumentError',
    formularioTarea: '#taskForm',
    inputTituloTarea: '#taskName',
    inputEstadoTarea: '#taskStatus',
    inputDescripcionTarea: '#taskDescription',
    botonGuardarTarea: '#submitBtn',
    errorTituloTarea: '#taskNameError',
    errorEstadoTarea: '#taskStatusError',
    errorDescripcionTarea: '#taskDescriptionError',
    contenedorTareas: '#tasksContainer',
    estadoVacio: '#emptyState',
    contadorTareas: '#tasksCount',
    seccionFormularioTarea: '.task-form-section',
    seccionListaTareas: '.tasks-section',
    modalOverlay: '#feedbackModal',
    modalContent: '#feedbackModalContent'
};

// =============================================================================
// VARIABLES DE ESTADO GLOBAL
// =============================================================================
// Variables que mantienen el estado actual de la aplicación
export const estado = {
    usuarioActual: null,
    totalTareas: 0,
    editandoId: null
};

// =============================================================================
// REFERENCIAS A ELEMENTOS DEL DOM
// =============================================================================
// Obtención de todos los elementos del DOM usando los selectores definidos
// Estas variables se usan throughout toda la aplicación
export const formularioBusqueda = document.querySelector(selectores.formularioBusqueda);
export const inputDocumento = document.querySelector(selectores.inputDocumento);
export const errorDocumento = document.querySelector(selectores.errorDocumento);
export const formularioTarea = document.querySelector(selectores.formularioTarea);
export const inputTituloTarea = document.querySelector(selectores.inputTituloTarea);
export const inputEstadoTarea = document.querySelector(selectores.inputEstadoTarea);
export const inputDescripcionTarea = document.querySelector(selectores.inputDescripcionTarea);
export const botonGuardarTarea = document.querySelector(selectores.botonGuardarTarea);
export const errorTituloTarea = document.querySelector(selectores.errorTituloTarea);
export const errorEstadoTarea = document.querySelector(selectores.errorEstadoTarea);
export const errorDescripcionTarea = document.querySelector(selectores.errorDescripcionTarea);
export const contenedorTareas = document.querySelector(selectores.contenedorTareas);
export const estadoVacio = document.querySelector(selectores.estadoVacio);
export const contadorTareas = document.querySelector(selectores.contadorTareas);
export const seccionFormularioTarea = document.querySelector(selectores.seccionFormularioTarea);
export const seccionListaTareas = document.querySelector(selectores.seccionListaTareas);
export const modalOverlay = document.querySelector(selectores.modalOverlay);
export const modalContent = document.querySelector(selectores.modalContent);
