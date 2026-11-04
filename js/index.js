import "./buscador.js";
import { abrirInformacionCurso, configurarCierreDialogo } from "./infoCursos.js";

document.querySelectorAll("[data-info-index]").forEach((boton) => {
    boton.addEventListener("click", () => {
        abrirInformacionCurso(boton.dataset.infoIndex);
    });
});

configurarCierreDialogo();
