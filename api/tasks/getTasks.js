import { urlAPI } from "../../config/index.js";

export const getTasks = async (userId) => {
    try {
        // Obtener todas las tareas y filtrar en cliente
        const response = await fetch(`${urlAPI}/tasks`);
        
        if (!response.ok) {
            throw new Error(`Error al obtener las tareas. Código: ${response.status}`);
        }

        const data = await response.json();
        
        // Filtrar tareas por userId
        const tareasFiltradas = data.filter(tarea => tarea.userId === userId || tarea.userId === Number(userId));
        console.log('Tareas filtradas:', tareasFiltradas);
        return tareasFiltradas;

    } catch (error) {
        console.error(`Ocurrió un problema al obtener las tareas: ${error.message}`);
        throw error;
    }
};
