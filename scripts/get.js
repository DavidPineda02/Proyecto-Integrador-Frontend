// Importamos la URL base de la API desde el archivo principal
import { urlAPI } from "../script.js";

/**
 * Obtiene un usuario por su número de documento (ID)
 * @param {string} id - El ID del usuario a buscar
 * @returns {Promise<Object>} - Retorna una promesa con los datos del usuario
 */
export const getOneUser = async (id) => {
    try {
        // Hacemos una petición GET a la API para buscar el usuario por su ID
        // Usamos template literals para concatenar la URL base con el ID
        const response = await fetch(`${urlAPI}/users/${id}`);

        // Verificamos si la respuesta de la API no fue exitosa (status diferente a 200-299)
        if (!response.ok) {
            // Lanzamos un error personalizado dependiendo del código de estado
            // Si es 404, significa que el usuario no existe
            let mensajeError = `Error en la petición. Código: ${response.status}`;

            if (response.status === 404) {
                mensajeError = "Usuario no encontrado.";
            }

            throw new Error(mensajeError);
        }

        // Si la respuesta es exitosa, convertimos el cuerpo de la respuesta a JSON
        // Esto devuelve una promesa con los datos del usuario
        const data = await response.json();

        // Retornamos los datos del usuario
        return data;

    } catch (error) {
        // Si ocurre algún error en el proceso (red, servidor, o el error lanzado arriba)
        // Lo mostramos en la consola para depuración
        console.error(`Ocurrió un problema al obtener el usuario: ${error.message}`);

        // Relanzamos el error para que quien llame a esta función pueda manejarlo
        throw error;
    }
};
