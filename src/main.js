// Punto de entrada para Vite.
import './styles.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import { iniciarAplicacion } from './controllers/index.js';
document.addEventListener('DOMContentLoaded', iniciarAplicacion);
