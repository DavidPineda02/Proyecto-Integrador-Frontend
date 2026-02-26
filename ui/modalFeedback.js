export function crearContenidoModal(tipo, titulo, texto, pista = '') {
    const icono = tipo === 'success' ? '\u2714' : '\u2718';

    const divIcono = document.createElement('div');
    divIcono.className = 'modal-content__icon';
    divIcono.textContent = icono;

    const h3Titulo = document.createElement('h3');
    h3Titulo.className = 'modal-content__title';
    h3Titulo.textContent = titulo;

    const parrafos = crearParrafosTexto(texto);

    const botonCerrar = document.createElement('button');
    botonCerrar.className = 'modal-content__btn';
    botonCerrar.id = 'modalCloseBtn';
    botonCerrar.style.outline = 'none';
    botonCerrar.textContent = 'Aceptar';

    const fragmento = document.createDocumentFragment();
    fragmento.appendChild(divIcono);
    fragmento.appendChild(h3Titulo);

    parrafos.forEach((parrafo) => {
        fragmento.appendChild(parrafo);
    });

    if (pista) {
        const pPista = document.createElement('p');
        pPista.className = 'modal-content__hint';
        pPista.textContent = pista;
        fragmento.appendChild(pPista);
    }

    fragmento.appendChild(botonCerrar);

    return fragmento;
}

function crearParrafosTexto(textoOLista) {
    let lineas = [textoOLista];

    if (Array.isArray(textoOLista)) {
        lineas = textoOLista;
    }

    return lineas.map((linea) => {
        const parrafo = document.createElement('p');
        parrafo.className = 'modal-content__text';

        if (typeof linea === 'object' && linea.etiqueta) {
            const strong = document.createElement('strong');
            strong.textContent = linea.etiqueta;

            const textoValor = document.createTextNode(` ${linea.valor}`);

            parrafo.appendChild(strong);
            parrafo.appendChild(textoValor);
        } else {
            parrafo.textContent = linea;
        }

        return parrafo;
    });
}
