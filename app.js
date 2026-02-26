// =============================================================================
// ARCHIVO PRINCIPAL DE LA APLICACIÓN - app.js
// =============================================================================
// Este archivo es el punto de entrada de la aplicación.
// Toda la lógica ha sido modularizada en carpetas específicas.

// Importación de la configuración global de la aplicación
import { urlAPI } from './config/index.js';

// Importación de la función principal que inicializa toda la aplicación
import { iniciarAplicacion } from './controllers/index.js';

// =============================================================================
// INICIALIZACIÓN DE LA APLICACIÓN
// =============================================================================
// Se ejecuta cuando el DOM está completamente cargado y listo
// Esto dispara toda la lógica de event listeners y funcionalidad
document.addEventListener('DOMContentLoaded', iniciarAplicacion);
