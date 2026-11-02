
import { ejerciciosLecciones } from "./datosLecciones.js";
import {
    leccionCompletada,
    nivelDisponible,
    guardarProgresoLeccion
} from "./progresoLecciones.js";

import "../../js/header.js";
import "../../js/buscador.js";

import { obtenerUsuarioActivo } from "../../js/usuarios.js";

const actividad = document.querySelector("main[data-idioma][data-leccion]");

if (actividad) {

    const idioma = actividad.dataset.idioma;
    const parametros = new URLSearchParams(window.location.search);

    const nivelSolicitado = parametros.get("nivel");
    const tipoSolicitado = parametros.get("actividad");

    const nivel = ["a", "b", "c"].includes(nivelSolicitado)
        ? nivelSolicitado
        : "a";

    const tipoActividad = ["listening", "vocabulario", "gramatica"]
        .includes(tipoSolicitado)
        ? tipoSolicitado
        : "listening";

    const ejercicio = ejerciciosLecciones[idioma]?.[tipoActividad];

    const formulario = actividad.querySelector(".card");
    const titulo = formulario.querySelector("h1");
    const frase = formulario.querySelector(".frase p");
    const botonComprobar = formulario.querySelector(".comprobar");
    const barraProgreso = actividad.querySelector("progress");
    const barraSuperior = actividad.querySelector(".barra");

    let vidas = 3;
    let leccionFinalizada = false;

    const mensaje = document.createElement("p");
    mensaje.className = "mensaje-leccion";
    mensaje.setAttribute("role", "status");

    formulario.insertBefore(mensaje, botonComprobar);

    const contenedorVidas = document.createElement("div");
    contenedorVidas.className = "contenedor-vidas";
    contenedorVidas.setAttribute("aria-label", "Vidas disponibles");

    const corazones = [];

    const corazonLleno = new URL(
        "../../images/icons-general/icono-corazon.svg",
        import.meta.url
    ).href;

    const corazonVacio = new URL(
        "../../images/icons-general/icono-corazonvacio.svg",
        import.meta.url
    ).href;

    for (let i = 0; i < 3; i++) {

        const corazon = document.createElement("img");

        corazon.src = corazonLleno;
        corazon.alt = "";

        contenedorVidas.appendChild(corazon);
        corazones.push(corazon);
    }

    const textoVidas = document.createElement("span");
    textoVidas.className = "vidas";

    contenedorVidas.appendChild(textoVidas);

    if (barraSuperior) {
        barraSuperior.appendChild(contenedorVidas);
    }

    function actualizarVidas() {

        corazones.forEach(function(corazon, indice) {

            if (indice < vidas) {
                corazon.src = corazonLleno;
            } else {
                corazon.src = corazonVacio;
            }
        });

        textoVidas.textContent = vidas + "/3";
        contenedorVidas.setAttribute(
            "aria-label",
            "Vidas disponibles: " + vidas + " de 3"
        );
    }

    actualizarVidas();

    function mostrarMensaje(texto, correcto = false) {

        mensaje.textContent = texto;
        mensaje.style.color = correcto ? "#2A9C8D" : "#c0392b";
    }

    function limpiarMensaje() {

        if (!leccionFinalizada && vidas > 0) {
            mensaje.textContent = "";
        }
    }

    function obtenerIdLeccion() {

        if (nivel === "a" && tipoActividad === "listening") {
            return idioma + "-1";
        }

        return idioma + "-" + nivel + "-" + tipoActividad;
    }

    const idLeccion = obtenerIdLeccion();

    const mapas = {
        ingles: "progreso-ingles.html",
        aleman: "progreso-aleman.html",
        chino: "progreso-chino.html"
    };

    function volverAlMapa() {

        window.location.href =
            "../3_Vista Mapa de Unidades/" + mapas[idioma];
    }

    function configurarOpciones() {

        const contenedor = formulario.querySelector(".opciones");

        if (!contenedor) {
            return;
        }

        contenedor.replaceChildren();

        ejercicio.opciones.forEach(function(opcion, indice) {

            const grupo = document.createElement("div");
            const input = document.createElement("input");
            const label = document.createElement("label");

            input.type = "radio";
            input.name = "respuesta";
            input.id = "op" + (indice + 1);
            input.value = opcion[0];

            label.setAttribute("for", input.id);
            label.textContent = opcion[1];

            grupo.appendChild(input);
            grupo.appendChild(label);
            contenedor.appendChild(grupo);
        });

        contenedor.addEventListener("change", limpiarMensaje);
    }

    function configurarPalabras() {

        const banco = formulario.querySelector(".banco-palabras");
        const respuesta = formulario.querySelector(".respuesta");

        if (!banco || !respuesta) {
            return;
        }

        banco.replaceChildren();
        respuesta.replaceChildren();

        ejercicio.palabras.forEach(function(palabra) {

            const boton = document.createElement("button");

            boton.type = "button";
            boton.textContent = palabra;
            boton.dataset.palabra = palabra;

            banco.appendChild(boton);
        });

        banco.addEventListener("click", function(evento) {

            if (leccionFinalizada || vidas === 0) {
                return;
            }

            const boton = evento.target.closest("button");

            if (!boton || !banco.contains(boton)) {
                return;
            }

            boton.textContent = boton.dataset.palabra + " ×";
            boton.setAttribute(
                "aria-label",
                "Quitar " + boton.dataset.palabra
            );

            respuesta.appendChild(boton);
            limpiarMensaje();
        });

        respuesta.addEventListener("click", function(evento) {

            if (leccionFinalizada || vidas === 0) {
                return;
            }

            const boton = evento.target.closest("button");

            if (!boton || !respuesta.contains(boton)) {
                return;
            }

            boton.textContent = boton.dataset.palabra;
            boton.removeAttribute("aria-label");

            banco.appendChild(boton);
            limpiarMensaje();
        });
    }

    function obtenerRespuesta() {

        if (ejercicio.tipo === "opciones") {

            const seleccionada = formulario.querySelector(
                'input[name="respuesta"]:checked'
            );

            return seleccionada ? seleccionada.value : "";
        }

        if (ejercicio.tipo === "palabras") {

            const botones = formulario.querySelectorAll(
                ".respuesta button"
            );

            const palabras = Array.from(botones).map(function(boton) {
                return boton.dataset.palabra;
            });

            return palabras.join(" ");
        }

        return "";
    }

    const volverCompletada = document.createElement("a");
    volverCompletada.textContent = "Volver al mapa de unidades";
    volverCompletada.className = "volver-leccion-completa";

    volverCompletada.href =
        "../3_Vista Mapa de Unidades/" + mapas[idioma];

    volverCompletada.hidden = true;

    formulario.appendChild(volverCompletada);

    const botonReintentar = document.createElement("button");

    botonReintentar.type = "button";
    botonReintentar.className = "comprobar boton-reintentar";
    botonReintentar.textContent = "Reintentar lección";
    botonReintentar.hidden = true;

    botonReintentar.addEventListener("click", function() {
        window.location.reload();
    });

    formulario.appendChild(botonReintentar);

    function completarBarra() {

        leccionFinalizada = true;
        volverCompletada.hidden = false;
        botonComprobar.disabled = true;

        if (barraProgreso) {
            barraProgreso.value = 100;
            barraProgreso.textContent = "100%";
        }
    }

    function perderVida() {

        vidas--;
        actualizarVidas();

        if (vidas === 0) {

            mostrarMensaje(
                "Te quedaste sin vidas. Reintentá la lección."
            );

            botonComprobar.disabled = true;
            botonReintentar.hidden = false;

            const opciones = formulario.querySelectorAll(
                'input[name="respuesta"]'
            );

            opciones.forEach(function(opcion) {
                opcion.disabled = true;
            });

            const botonesPalabras = formulario.querySelectorAll(
                ".banco-palabras button, .respuesta button"
            );

            botonesPalabras.forEach(function(boton) {
                boton.disabled = true;
            });

        } else {

            mostrarMensaje(
                "Respuesta incorrecta. Te quedan " +
                vidas + " vidas."
            );
        }
    }

    function comprobarRespuesta() {

        if (vidas === 0 || leccionFinalizada || !ejercicio) {
            return;
        }

        const respuesta = obtenerRespuesta();

        if (!respuesta) {

            mostrarMensaje(
                "Seleccioná una respuesta antes de comprobar."
            );

            return;
        }

        if (respuesta !== ejercicio.correcta) {

            perderVida();
            return;
        }

        const resultado = guardarProgresoLeccion(
            idioma,
            idLeccion
        );

        if (resultado.estado === "repetida") {

            mostrarMensaje(
                "¡Correcto! Ya completaste esta actividad.",
                true
            );

        } else if (resultado.estado === "guardada") {

            const avisoDobleXp = resultado.dobleXp
                ? " ¡Usaste tu beneficio de doble XP!"
                : "";

            mostrarMensaje(
                "¡Respuesta correcta! Ganaste " +
                resultado.xp + " XP y " +
                resultado.monedas + " monedas." +
                avisoDobleXp,
                true
            );

        } else {

            mostrarMensaje(
                "No se pudo guardar el progreso."
            );

            return;
        }

        completarBarra();
    }

    const usuario = obtenerUsuarioActivo();

    if (!usuario) {

        window.location.replace(
            "../1_Vista Login/login.html"
        );

    } else if (!ejercicio) {

        mostrarMensaje(
            "Esta lección todavía no está configurada."
        );

        botonComprobar.disabled = true;

    } else if (!nivelDisponible(usuario, idioma, nivel)) {

        volverAlMapa();

    } else {

        titulo.textContent = ejercicio.titulo;
        frase.textContent = ejercicio.frase;

        if (tipoActividad !== "listening") {

            const audio = formulario.querySelector(
                ".audio-ingles"
            );

            const botonAudio = formulario.querySelector(
                ".btn-audio-ingles"
            );

            const contenedorAudio = formulario.querySelector(
                ".conteiner-audio-ingles"
            );

            if (audio) {
                audio.checked = false;
                audio.style.display = "none";
            }

            if (botonAudio) {
                botonAudio.style.display = "none";
            }

            if (contenedorAudio) {
                contenedorAudio.style.display = "none";
            }
        }

        if (ejercicio.tipo === "opciones") {
            configurarOpciones();
        }

        if (ejercicio.tipo === "palabras") {
            configurarPalabras();
        }

        formulario.addEventListener("submit", function(evento) {
            evento.preventDefault();
        });

        botonComprobar.addEventListener(
            "click",
            comprobarRespuesta
        );

        if (leccionCompletada(usuario, idioma, idLeccion)) {
            completarBarra();
        }
    }
}
