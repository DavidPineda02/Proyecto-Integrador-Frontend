export function crearEmptyState() {
    const div = document.createElement('div');
    div.className = 'tasks-empty';
    div.id = 'emptyState';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'tasks-empty__icon');
    svg.setAttribute('width', '64');
    svg.setAttribute('height', '64');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z');
    svg.appendChild(path);

    const p1 = document.createElement('p');
    p1.className = 'tasks-empty__text';
    p1.textContent = 'Aún no hay tareas';

    const p2 = document.createElement('p');
    p2.className = 'tasks-empty__subtext';
    p2.textContent = 'Completa el formulario para agregar tu primera tarea';

    div.appendChild(svg);
    div.appendChild(p1);
    div.appendChild(p2);

    return div;
}
