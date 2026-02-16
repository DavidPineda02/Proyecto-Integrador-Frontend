// Importamos la URL base de la API desde el archivo principal
import { urlAPI } from "../script.js";

/**
 * Crea una nueva tarea enviando los datos a la API
 * @param {Object} taskData - Objeto con los datos de la tarea {userId, title, body, status}
 * @returns {Promise<Object>} - Retorna una promesa con los datos de la tarea creada
 */
export const createTask = async (taskData) => {
    try {
        // Hacemos una petición POST a la API para guardar la nueva tarea
        // Usamos fetch con opciones para indicar el método, headers y body
        const response = await fetch(`${urlAPI}/tasks`, {
            // Indicamos que el método HTTP es 'POST'
            method: 'POST',

            // Especificamos en los headers que el cuerpo de la petición es JSON
            headers: {
                'Content-Type': 'application/json'
            },

            // Convertimos el objeto de JavaScript a una cadena JSON para enviarlo
            body: JSON.stringify(taskData)
        });

        // Verificamos si la respuesta de la API no fue exitosa (status diferente a 200-299)
        if (!response.ok) {
            // Lanzamos un error si la creación falló
            throw new Error(`Error al crear la tarea. Código: ${response.status}`);
        }

        // Si la petición fue exitosa, convertimos la respuesta a un objeto JSON
        // Esto contiene los datos de la tarea recién creada (incluyendo su ID generado)
        const data = await response.json();

        // Retornamos los datos de la tarea
        return data;

    } catch (error) {
        // Si ocurre algún error en el proceso (red, servidor, o el error lanzado arriba)
        // Lo mostramos en la consola para depuración
        console.error(`Ocurrió un problema al crear la tarea: ${error.message}`);

        // Relanzamos el error para que quien llame a esta función pueda manejarlo
        throw error;
    }
};
