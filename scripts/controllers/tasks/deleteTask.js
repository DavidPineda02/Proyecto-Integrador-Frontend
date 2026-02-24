// Importamos la URL base de la API desde el archivo principal
import { urlAPI } from "../../../app.js";

/**
 * Elimina una tarea por su ID
 * @param {string} taskId - El ID de la tarea a eliminar
 * @returns {Promise<void>}
 */
export const deleteTask = async (taskId) => {
    try {
        const response = await fetch(`${urlAPI}/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar la tarea. Código: ${response.status}`);
        }

    } catch (error) {
        console.error(`Ocurrió un problema al eliminar la tarea: ${error.message}`);
        throw error;
    }
};
