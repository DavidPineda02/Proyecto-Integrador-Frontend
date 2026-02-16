export function crearMarcadoParrafos(textoOLista) {
    let lineas = [textoOLista];

    if (Array.isArray(textoOLista)) {
        lineas = textoOLista;
    }

    return lineas.map((linea) => `<p class="feedback-card__text">${linea}</p>`).join('');
}
