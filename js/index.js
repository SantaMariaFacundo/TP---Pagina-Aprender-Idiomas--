
import "./buscador.js";

const dialogo = document.getElementById("dialogo-curso");
const titulo = document.getElementById("titulo-dialogo-curso");
const introduccion = document.getElementById("introduccion-curso");
const contenidos = document.getElementById("contenidos-curso");
const estructura = document.getElementById("estructura-curso");
const cierre = document.getElementById("cerrar-dialogo-curso");

const informacionCursos = {
    ingles: {
        titulo: "Inglés",
        introduccion: "El inglés te permite conectar con personas de distintas partes del mundo y ampliar tus oportunidades para viajar, estudiar y trabajar.",
        contenidos: [
            "Vocabulario para situaciones cotidianas.",
            "Gramática y construcción de oraciones.",
            "Ejercicios de comprensión auditiva.",
            "Actividades prácticas y exámenes."
        ],
        estructura: "Vas a encontrar tres etapas: A1-A2, B1-B2 y C1-C2. Cada una tiene actividades de Listening, Vocabulario y Gramática, además de un examen para avanzar."
    },

    chino: {
        titulo: "Chino Mandarín",
        introduccion: "Aprender mandarín es una excelente forma de descubrir una cultura diferente y desafiarte a incorporar nuevos conocimientos.",
        contenidos: [
            "Palabras y expresiones básicas.",
            "Vocabulario para situaciones cotidianas.",
            "Actividades de comprensión.",
            "Ejercicios interactivos y exámenes."
        ],
        estructura: "El recorrido está organizado en tres etapas: A1-A2, B1-B2 y C1-C2. Avanzás completando actividades y aprobando las evaluaciones correspondientes."
    },

    aleman: {
        titulo: "Alemán",
        introduccion: "El alemán es un idioma con una gran presencia cultural, científica y académica. Es ideal si querés ampliar tus horizontes.",
        contenidos: [
            "Vocabulario de uso cotidiano.",
            "Estructuras y reglas gramaticales.",
            "Ejercicios de comprensión auditiva.",
            "Actividades prácticas y exámenes."
        ],
        estructura: "El curso se divide en las etapas A1-A2, B1-B2 y C1-C2. Cada etapa contiene actividades y un examen que permite desbloquear el siguiente nivel."
    }
};

function crearLista(elemento, datos) {

    elemento.replaceChildren();

    datos.forEach(function(texto) {

        const item = document.createElement("li");

        item.textContent = texto;

        elemento.appendChild(item);
    });
}

function abrirInformacionCurso(id) {

    const curso = informacionCursos[id];

    if (!curso || !dialogo) {
        return;
    }

    titulo.textContent = curso.titulo;
    introduccion.textContent = curso.introduccion;
    estructura.textContent = curso.estructura;

    crearLista(contenidos, curso.contenidos);

    dialogo.showModal();
}

document.querySelectorAll("[data-info-index]").forEach(function(boton) {

    boton.addEventListener("click", function() {

        abrirInformacionCurso(boton.dataset.infoIndex);
    });
});

if (cierre) {

    cierre.addEventListener("click", function() {

        dialogo.close();
    });
}

if (dialogo) {

    dialogo.addEventListener("click", function(evento) {

        if (evento.target === dialogo) {
            dialogo.close();
        }
    });
}
