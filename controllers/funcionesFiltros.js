// =============================================================================
// MÓDULO DE FILTROS Y ORDENAMIENTO - controllers/funcionesFiltros.js
// =============================================================================
// RF01: Filtro avanzado por estado y usuario, combinables simultáneamente.
// RF02: Ordenamiento dinámico por fecha, nombre y estado.
// Trabaja sobre estado.tareas (fuente de verdad en memoria) y re-renderiza
// el DOM sin recargar la página.

import { estado, contenedorTareas } from './variables.js';
import { obtenerClaseEstado, obtenerEtiquetaEstado, obtenerInicialesUsuario } from '../services/index.js';
import { crearTarjetaTarea } from '../ui/index.js';

// Orden numérico de los estados para el sort
const ORDEN_ESTADO = { 'incompleta': 0, 'en-proceso': 1, 'finalizada': 2 };

// =============================================================================
// FUNCIONES INTERNAS
// =============================================================================

/**
 * Aplica el ordenamiento actual al array de tareas recibido.
 * @param {Array<Object>} tareas - Tareas a ordenar
 * @returns {Array<Object>} - Nuevo array ordenado (no muta el original)
 */
function ordenarTareas(tareas) {
    const { campo, direccion } = estado.ordenamiento;

    return [...tareas].sort((a, b) => {
        let cmp = 0;

        if (campo === 'fecha') {
            cmp = new Date(a._fechaISO) - new Date(b._fechaISO);
        } else if (campo === 'nombre') {
            cmp = a.title.localeCompare(b.title, 'es');
        } else if (campo === 'estado') {
            cmp = (ORDEN_ESTADO[a.status] ?? 0) - (ORDEN_ESTADO[b.status] ?? 0);
        }

        return direccion === 'asc' ? cmp : -cmp;
    });
}

/**
 * Reconstruye el DOM del contenedor de tareas con la lista recibida.
 * Elimina las tarjetas existentes y las vuelve a crear desde el estado.
 * Actualiza estado.tareasVisibles para que el módulo de exportación
 * siempre acceda a las tareas actualmente visibles.
 * @param {Array<Object>} tareas - Tareas filtradas y ordenadas a renderizar
 */
function renderizarTareas(tareas) {
    // Guardar las tareas visibles en el estado para que exportar.js las use
    estado.tareasVisibles = tareas;

    const emptyState = contenedorTareas.querySelector('#emptyState');

    // Eliminar solo las tarjetas de tarea (no el emptyState)
    contenedorTareas.querySelectorAll('.message-card').forEach((card) => card.remove());

    if (tareas.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    for (const tarea of tareas) {
        const iniciales = obtenerInicialesUsuario(tarea._usuario);
        const estadoClase = obtenerClaseEstado(tarea.status);
        const estadoTexto = obtenerEtiquetaEstado(tarea.status);

        const tarjeta = crearTarjetaTarea(
            tarea._usuario,
            iniciales,
            tarea,
            estadoClase,
            estadoTexto,
            tarea._fechaHora
        );

        if (emptyState) {
            contenedorTareas.insertBefore(tarjeta, emptyState);
        } else {
            contenedorTareas.appendChild(tarjeta);
        }
    }
}

// =============================================================================
// API PÚBLICA
// =============================================================================

/**
 * Aplica los filtros y el ordenamiento actuales sobre estado.tareas
 * y actualiza el DOM sin recargar la página.
 * Punto de entrada principal de este módulo (RF01 + RF02).
 */
export function aplicarFiltrosYOrden() {
    let visibles = [...estado.tareas];

    // RF01 – Filtrar por estado
    if (estado.filtros.estado) {
        visibles = visibles.filter((t) => t.status === estado.filtros.estado);
    }

    // RF01 – Filtrar por usuario o título (combinado)
    if (estado.filtros.texto) {
        const texto = estado.filtros.texto.toLowerCase();
        visibles = visibles.filter(
            (t) =>
                t.title.toLowerCase().includes(texto) ||
                t._usuario.toLowerCase().includes(texto)
        );
    }

    // RF02 – Ordenar el resultado filtrado
    visibles = ordenarTareas(visibles);

    // Renderizar sin recargar
    renderizarTareas(visibles);
}

/**
 * Reinicia el estado de filtros y ordenamiento al buscar un nuevo usuario.
 * También actualiza visualmente los controles del DOM.
 */
export function resetearFiltros() {
    estado.filtros.estado = '';
    estado.filtros.texto = '';
    estado.ordenamiento.campo = 'fecha';
    estado.ordenamiento.direccion = 'desc';
    estado.tareasVisibles = [];

    // Reiniciar UI de filtros
    const inputUsuario = document.getElementById('filtroUsuario');
    if (inputUsuario) inputUsuario.value = '';

    const ordenSelect = document.getElementById('ordenCampo');
    if (ordenSelect) ordenSelect.value = 'fecha';

    const ordenBtn = document.getElementById('ordenDireccion');
    if (ordenBtn) {
        ordenBtn.dataset.direccion = 'desc';
        const icono = ordenBtn.querySelector('i');
        if (icono) {
            icono.className = 'fa-solid fa-sort-down';
        }
    }

    // Reiniciar botones de filtro de estado
    const botones = document.querySelectorAll('#filtroEstadoBotones .btn-filtro');
    botones.forEach((btn) => btn.classList.remove('btn-filtro--activo'));
    const btnTodos = document.querySelector('#filtroEstadoBotones [data-estado=""]');
    if (btnTodos) btnTodos.classList.add('btn-filtro--activo');
}
