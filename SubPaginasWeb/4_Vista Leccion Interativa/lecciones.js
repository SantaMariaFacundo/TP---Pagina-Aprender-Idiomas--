// Importamos los ejercicios y las funciones de progreso de cada lección.
import { ejerciciosLecciones } from "./datosLecciones.js";
import { leccionCompletada, nivelDisponible, guardarProgresoLeccion } from "./progresoLecciones.js";

// Importamos los módulos compartidos necesarios para esta página.
import "../../js/header.js";
import "../../js/buscador.js";
import "../../js/traductor.js";

// Importamos las funciones de usuarios utilizadas en esta vista.
import { obtenerUsuarioActivo } from "../../js/usuarios.js";


const actividad = document.querySelector("main[data-idioma][data-leccion]");

if (actividad) {

    // Obtener el idioma y los datos de la URL.
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

    // Buscar el ejercicio en datosLecciones.js.
    const ejercicio = ejerciciosLecciones[idioma]?.[tipoActividad];

    // Obtener los elementos del HTML.
    const formulario = actividad.querySelector(".card");
    const titulo = formulario.querySelector("h1");
    const frase = formulario.querySelector(".frase p");
    const botonComprobar = formulario.querySelector(".comprobar");
    const barraProgreso = actividad.querySelector("progress");

    const mensaje = document.createElement("p");
    mensaje.className = "mensaje-leccion";
    mensaje.setAttribute("role", "status");

    formulario.insertBefore(mensaje, botonComprobar);

    // Mostrar mensajes al usuario.
    function mostrarMensaje(texto, correcto = false) {

        mensaje.textContent = texto;
        mensaje.style.color = correcto ? "#2A9C8D" : "#c0392b";

    }

    function limpiarMensaje() {
        mensaje.textContent = "";
    }

    // Crear el identificador único de la lección.
    function obtenerIdLeccion() {

        if (nivel === "a" && tipoActividad === "listening") {
            return idioma + "-1";
        }

        return idioma + "-" + nivel + "-" + tipoActividad;

    }

    const idLeccion = obtenerIdLeccion();

    // Archivos de los mapas de cada idioma.
    const mapas = {
        ingles: "progreso-ingles.html",
        aleman: "progreso-aleman.html",
        chino: "progreso-chino.html"
    };

    function volverAlMapa() {

        window.location.href =
            "../3_Vista Mapa de Unidades/" + mapas[idioma];

    }

    // Crear las opciones de respuesta.
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

    // Crear las palabras para ordenar.
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

        // Mover palabras a la respuesta.
        banco.addEventListener("click", function(evento) {

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

        // Devolver palabras al banco.
        respuesta.addEventListener("click", function(evento) {

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

    // Obtener la respuesta elegida por el usuario.
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

    // Marcar la actividad como completada.
    function completarBarra() {

        if (barraProgreso) {
            barraProgreso.value = 100;
            barraProgreso.textContent = "100%";
        }

    }

    // Comprobar si la respuesta es correcta.
    function comprobarRespuesta() {

        const respuesta = obtenerRespuesta();

        if (!respuesta) {

            mostrarMensaje("Seleccioná una respuesta antes de comprobar.");
            return;

        }

        if (respuesta !== ejercicio.correcta) {

            mostrarMensaje("Respuesta incorrecta. ¡Intentá otra vez!");
            return;

        }

        // Guardar el progreso usando progresoLecciones.js.
        const resultado = guardarProgresoLeccion(idioma, idLeccion);

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

            mostrarMensaje("No se pudo guardar el progreso.");
            return;

        }

        completarBarra();

    }

    // Iniciar la actividad.
    const usuario = obtenerUsuarioActivo();

    if (!usuario) {

        window.location.replace("../1_Vista Login/login.html");

    } else if (!ejercicio) {

        mostrarMensaje("Esta lección todavía no está configurada.");
        botonComprobar.disabled = true;

    } else if (!nivelDisponible(usuario, idioma, nivel)) {

        volverAlMapa();

    } else {

        titulo.textContent = ejercicio.titulo;
        frase.textContent = ejercicio.frase;

        // Ocultar los controles de audio fuera de Listening.
        if (tipoActividad !== "listening") {

            const audio = formulario.querySelector(".audio-ingles");
            const botonAudio = formulario.querySelector(".btn-audio-ingles");
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

        // Evitar que el formulario recargue la página.
        formulario.addEventListener("submit", function(evento) {
            evento.preventDefault();
        });

        botonComprobar.addEventListener("click", comprobarRespuesta);

        // Recuperar el progreso si ya completó esta actividad.
        if (leccionCompletada(usuario, idioma, idLeccion)) {
            completarBarra();
        }

    }

}
