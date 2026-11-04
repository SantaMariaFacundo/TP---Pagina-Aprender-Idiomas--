// Página de inicio: buscador y popup de información de los cursos.
import "./buscador.js";
import { abrirInformacionCurso, configurarCierreDialogo } from "./infoCursos.js";

// Cada botón "Más información" abre el popup de su curso.
document.querySelectorAll("[data-info-index]").forEach((boton) => {
    boton.addEventListener("click", () => {
        abrirInformacionCurso(boton.dataset.infoIndex);
    });
});

configurarCierreDialogo();
