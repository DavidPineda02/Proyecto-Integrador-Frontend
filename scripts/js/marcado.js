export function crearMarcadoParrafos(textoOLista) {
    let lineas = [textoOLista];

    if (Array.isArray(textoOLista)) {
        lineas = textoOLista;
    }

    return lineas.map((linea) => {
        const parrafo = document.createElement('p');
        parrafo.className = 'feedback-card__text';
        parrafo.textContent = linea;
        return parrafo;
    });
}
