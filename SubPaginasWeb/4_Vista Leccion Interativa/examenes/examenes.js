import "../../../js/header.js";
import "../../../js/buscador.js";

import { obtenerUsuarioActivo, actualizarUsuario } from "../../../js/usuarios.js";

import { calcularRecompensa } from "../progresoLecciones.js";

const XP_EXAMEN = 30;
const MONEDAS_EXAMEN = 50;



const examen = document.querySelector("main[data-idioma]");

if (examen) {


    const idioma = examen.dataset.idioma;

    const parametros = new URLSearchParams(window.location.search);

    const nivel = parametros.get("nivel") || "a";

    const nivelesValidos = ["a", "b", "c"];


    const respuestasExamenes = {

        ingles: {
            pregunta1: "is",
            pregunta2: "i-am",
            pregunta3: "podrias repetir eso por favor"
        },

        aleman: {
            pregunta1: "wiedersehen",
            pregunta2: "ichbin",
            pregunta3: "vengo de argentina y estoy aprendiendo aleman"
        },

        chino: {
            pregunta1: "gracias",
            pregunta2: "shi",
            pregunta3: "como estas"
        }

    };


    const archivosMapas = {
        ingles: "progreso-ingles.html",
        aleman: "progreso-aleman.html",
        chino: "progreso-chino.html"
    };


    const formulario = examen.querySelector("form");

    const botonComprobar = formulario.querySelector(".comprobar");

    const banco = formulario.querySelector(".banco-palabras");

    const respuesta = formulario.querySelector(".respuesta");

    const contenedorBoton = formulario.querySelector(".container-boton");


    const mensaje = document.createElement("p");

    mensaje.className = "mensaje-examen";
    mensaje.setAttribute("role", "status");

    formulario.insertBefore(mensaje, contenedorBoton);


    const enlaceVolver = document.createElement("a");

    enlaceVolver.textContent = "Volver al mapa de unidades";

    enlaceVolver.href =
        "../../3_Vista Mapa de Unidades/" + archivosMapas[idioma];

    enlaceVolver.style.display = "none";
    enlaceVolver.style.textAlign = "center";
    enlaceVolver.style.margin = "1rem auto";
    enlaceVolver.style.color = "#CA6035";
    enlaceVolver.style.fontWeight = "bold";

    contenedorBoton.insertAdjacentElement("afterend", enlaceVolver);


    function mostrarMensaje(texto, correcto = false) {

        mensaje.textContent = texto;

        mensaje.style.color = correcto ? "#2A9C8D" : "#c0392b";

        mensaje.style.textAlign = "center";
        mensaje.style.fontWeight = "bold";
        mensaje.style.margin = "1rem 0";

    }


    function limpiarMensaje() {

        mensaje.textContent = "";

    }


    function obtenerDatosCurso(usuario) {

        const cursos = usuario.cursos || {};

        return cursos[idioma] || {};

    }


    function obtenerIdLeccion(nivelActual, actividad) {

        if (nivelActual === "a" && actividad === "listening") {

            return idioma + "-1";

        }

        return idioma + "-" + nivelActual + "-" + actividad;

    }


    function actividadesCompletadas(usuario, nivelActual) {

        const curso = obtenerDatosCurso(usuario);

        const completadas = curso.leccionesCompletadas || [];

        const actividades = [
            "listening",
            "vocabulario",
            "gramatica"
        ];

        return actividades.every(function(actividad) {

            const identificador = obtenerIdLeccion(
                nivelActual,
                actividad
            );

            return completadas.includes(identificador);

        });

    }


    function examenAprobado(usuario, nivelActual) {

        const curso = obtenerDatosCurso(usuario);

        const aprobados = curso.examenesAprobados || [];

        return aprobados.includes(nivelActual);

    }


    function examenDisponible(usuario) {

        if (!nivelesValidos.includes(nivel)) {

            return false;

        }


        if (nivel === "b" && !examenAprobado(usuario, "a")) {

            return false;

        }


        if (nivel === "c") {

            if (
                !examenAprobado(usuario, "a") ||
                !examenAprobado(usuario, "b")
            ) {

                return false;

            }

        }


        return actividadesCompletadas(usuario, nivel);

    }


    let recompensaExamen = null;

    function guardarExamenAprobado() {

        const usuario = obtenerUsuarioActivo();

        if (!usuario) {

            return false;

        }


        if (examenAprobado(usuario, nivel)) {

            return "repetido";

        }

        const cursos = usuario.cursos || {};

        const curso = cursos[idioma] || {};

        const aprobados = [
            ...(curso.examenesAprobados || []),
            nivel
        ];


        const cursosActualizados = {
            ...cursos,
            [idioma]: {
                ...curso,
                examenesAprobados: aprobados
            }
        };

        recompensaExamen = calcularRecompensa(usuario, XP_EXAMEN, MONEDAS_EXAMEN);


        const guardado = actualizarUsuario({
            ...recompensaExamen.cambios,
            cursos: cursosActualizados
        });

        return guardado ? "guardado" : false;

    }


    function configurarBancoPalabras() {

        if (!banco || !respuesta) {

            return;

        }


        respuesta.replaceChildren();


        const botones = banco.querySelectorAll("button");

        botones.forEach(function(boton) {

            boton.dataset.palabra = boton.textContent.trim();

        });


        banco.addEventListener("click", function(evento) {

            const boton = evento.target.closest("button");

            if (!boton || !banco.contains(boton)) {

                return;

            }

            const palabra = boton.dataset.palabra;

            boton.textContent = palabra + " ×";

            boton.setAttribute(
                "aria-label",
                "Quitar " + palabra
            );

            respuesta.appendChild(boton);

            limpiarMensaje();

        });


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


    function obtenerOracion() {

        if (!respuesta) {

            return "";

        }

        const botones = respuesta.querySelectorAll("button");

        const palabras = Array.from(botones).map(function(boton) {

            return boton.dataset.palabra;

        });

        return palabras.join(" ");

    }


    function normalizarTexto(texto) {

        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[¿?¡!.,]/g, "")
            .replace(/\s+/g, " ")
            .trim();

    }


    function mostrarAprobacion(resultado) {

        if (resultado === "repetido") {

            mostrarMensaje(
                "¡Excelente! Ya habías aprobado este examen.",
                true
            );

        } else if (resultado === "guardado") {

            mostrarMensaje(
                "¡Felicitaciones! Aprobaste el examen. Ganaste " +
                recompensaExamen.xpGanados + " XP y " +
                recompensaExamen.monedasGanadas + " monedas.",
                true
            );

        } else {

            mostrarMensaje(
                "No se pudo guardar la aprobación. Intentá nuevamente."
            );

            return;

        }


        enlaceVolver.style.display = "block";


        botonComprobar.disabled = true;

        botonComprobar.textContent = "Examen aprobado";

    }


    function comprobarExamen(evento) {

        evento.preventDefault();


        const pregunta1 = formulario.querySelector(
            'input[name="p1"]:checked'
        );

        const pregunta2 = formulario.querySelector(
            'input[name="p2"]:checked'
        );

        if (!pregunta1 || !pregunta2) {

            mostrarMensaje(
                "Respondé las dos preguntas de opción múltiple."
            );

            return;

        }


        const oracion = obtenerOracion();

        if (oracion === "") {

            mostrarMensaje(
                "Completá también el ejercicio de Listening."
            );

            return;

        }


        const correctas = respuestasExamenes[idioma];

        if (!correctas) {

            mostrarMensaje(
                "Este examen todavía no está configurado."
            );

            return;

        }


        let cantidadCorrectas = 0;

        if (pregunta1.value === correctas.pregunta1) {

            cantidadCorrectas++;

        }

        if (pregunta2.value === correctas.pregunta2) {

            cantidadCorrectas++;

        }

        if (
            normalizarTexto(oracion) ===
            normalizarTexto(correctas.pregunta3)
        ) {

            cantidadCorrectas++;

        }


        if (cantidadCorrectas < 3) {

            mostrarMensaje(
                "Obtuviste " + cantidadCorrectas +
                " de 3 respuestas correctas. Revisá tus respuestas e intentá nuevamente."
            );

            return;

        }


        const resultado = guardarExamenAprobado();

        mostrarAprobacion(resultado);

    }


    const usuarioActivo = obtenerUsuarioActivo();

    if (!usuarioActivo) {

        window.location.replace(
            "../../1_Vista Login/login.html"
        );

    } else if (!respuestasExamenes[idioma]) {


        mostrarMensaje(
            "Este examen todavía no está configurado."
        );

        botonComprobar.disabled = true;

    } else if (!examenDisponible(usuarioActivo)) {


        window.location.replace(
            "../../3_Vista Mapa de Unidades/" +
            archivosMapas[idioma]
        );

    } else {


        configurarBancoPalabras();


        formulario.addEventListener(
            "change",
            limpiarMensaje
        );


        formulario.addEventListener(
            "submit",
            comprobarExamen
        );

    }

}


