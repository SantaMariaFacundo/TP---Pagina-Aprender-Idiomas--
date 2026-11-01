
console.log("Sistema de exámenes conectado correctamente");

// Buscar el examen actual

const examen = document.querySelector("main[data-idioma]");

if (examen) {

    // Obtener el idioma y el nivel desde la URL

    const idioma = examen.dataset.idioma;

    const parametros = new URLSearchParams(window.location.search);

    const nivel = parametros.get("nivel") || "a";

    const nivelesValidos = ["a", "b", "c"];

    // Guardar las respuestas correctas de cada idioma

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

    // Archivos de los mapas de unidades

    const archivosMapas = {
        ingles: "progreso-ingles.html",
        aleman: "progreso-aleman.html",
        chino: "progreso-chino.html"
    };

    // Obtener los elementos del formulario

    const formulario = examen.querySelector("form");

    const botonComprobar = formulario.querySelector(".comprobar");

    const banco = formulario.querySelector(".banco-palabras");

    const respuesta = formulario.querySelector(".respuesta");

    const contenedorBoton = formulario.querySelector(".container-boton");

    // Crear el mensaje que informa el resultado

    const mensaje = document.createElement("p");

    mensaje.className = "mensaje-examen";
    mensaje.setAttribute("role", "status");

    formulario.insertBefore(mensaje, contenedorBoton);

    // Crear el enlace para regresar al mapa

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

    // Mostrar mensajes de error o aprobación

    function mostrarMensaje(texto, correcto = false) {

        mensaje.textContent = texto;

        mensaje.style.color = correcto ? "#2A9C8D" : "#c0392b";

        mensaje.style.textAlign = "center";
        mensaje.style.fontWeight = "bold";
        mensaje.style.margin = "1rem 0";

    }

    // Borrar el mensaje anterior cuando cambia una respuesta

    function limpiarMensaje() {

        mensaje.textContent = "";

    }

    // Obtener los datos del curso de un usuario

    function obtenerDatosCurso(usuario) {

        const cursos = usuario.cursos || {};

        return cursos[idioma] || {};

    }

    // Generar el identificador de una actividad

    function obtenerIdLeccion(nivelActual, actividad) {

        if (nivelActual === "a" && actividad === "listening") {

            return idioma + "-1";

        }

        return idioma + "-" + nivelActual + "-" + actividad;

    }

    // Comprobar si terminó las tres actividades de un nivel

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

    // Comprobar si ya aprobó un examen

    function examenAprobado(usuario, nivelActual) {

        const curso = obtenerDatosCurso(usuario);

        const aprobados = curso.examenesAprobados || [];

        return aprobados.includes(nivelActual);

    }

    // Verificar si el usuario puede rendir el examen

    function examenDisponible(usuario) {

        if (!nivelesValidos.includes(nivel)) {

            return false;

        }

        // El examen B requiere aprobar primero el examen A

        if (nivel === "b" && !examenAprobado(usuario, "a")) {

            return false;

        }

        // El examen C requiere aprobar los exámenes A y B

        if (nivel === "c") {

            if (
                !examenAprobado(usuario, "a") ||
                !examenAprobado(usuario, "b")
            ) {

                return false;

            }

        }

        // En todos los niveles deben completarse las tres tarjetas

        return actividadesCompletadas(usuario, nivel);

    }

    // Guardar el examen aprobado en la cuenta

    function guardarExamenAprobado() {

        const usuario = obtenerUsuarioActivo();

        if (!usuario) {

            return false;

        }

        // No registrar dos veces el mismo examen

        if (examenAprobado(usuario, nivel)) {

            return "repetido";

        }

        const cursos = usuario.cursos || {};

        const curso = cursos[idioma] || {};

        const aprobados = [
            ...(curso.examenesAprobados || []),
            nivel
        ];

        // Conservar las demás propiedades del curso

        const cursosActualizados = {
            ...cursos,
            [idioma]: {
                ...curso,
                examenesAprobados: aprobados
            }
        };

        // Guardar el progreso actualizado

        actualizarUsuario({
            cursos: cursosActualizados
        });

        // Verificar que la aprobación se haya guardado

        const usuarioActualizado = obtenerUsuarioActivo();

        if (
            usuarioActualizado &&
            examenAprobado(usuarioActualizado, nivel)
        ) {

            return "guardado";

        }

        return false;

    }

    // Preparar los botones del banco de palabras

    function configurarBancoPalabras() {

        if (!banco || !respuesta) {

            return;

        }

        // Limpiar el área de respuesta

        respuesta.replaceChildren();

        // Guardar el texto original de cada botón

        const botones = banco.querySelectorAll("button");

        botones.forEach(function(boton) {

            boton.dataset.palabra = boton.textContent.trim();

        });

        // Mover una palabra del banco a la respuesta

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

        // Devolver una palabra al banco

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

    // Obtener las palabras seleccionadas en su orden

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

    // Normalizar las respuestas para ignorar tildes y puntuación

    function normalizarTexto(texto) {

        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[¿?¡!.,]/g, "")
            .replace(/\s+/g, " ")
            .trim();

    }

    // Mostrar la aprobación y permitir volver al mapa

    function mostrarAprobacion(resultado) {

        if (resultado === "repetido") {

            mostrarMensaje(
                "¡Excelente! Ya habías aprobado este examen.",
                true
            );

        } else if (resultado === "guardado") {

            mostrarMensaje(
                "¡Felicitaciones! Aprobaste el examen y guardamos tu progreso.",
                true
            );

        } else {

            mostrarMensaje(
                "No se pudo guardar la aprobación. Intentá nuevamente."
            );

            return;

        }

        // Mostrar el enlace para volver al mapa

        enlaceVolver.style.display = "block";

        // Deshabilitar un nuevo envío del examen

        botonComprobar.disabled = true;

        botonComprobar.textContent = "Examen aprobado";

    }

    // Corregir las tres preguntas del examen

    function comprobarExamen(evento) {

        evento.preventDefault();

        // Buscar las respuestas de opción múltiple

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

        // Obtener la oración formada con palabras

        const oracion = obtenerOracion();

        if (oracion === "") {

            mostrarMensaje(
                "Completá también el ejercicio de Listening."
            );

            return;

        }

        // Obtener las respuestas correctas del idioma

        const correctas = respuestasExamenes[idioma];

        if (!correctas) {

            mostrarMensaje(
                "Este examen todavía no está configurado."
            );

            return;

        }

        // Contar las respuestas correctas

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

        // Informar los errores cuando no aprueba

        if (cantidadCorrectas < 3) {

            mostrarMensaje(
                "Obtuviste " + cantidadCorrectas +
                " de 3 respuestas correctas. Revisá tus respuestas e intentá nuevamente."
            );

            return;

        }

        // Guardar la aprobación si las tres son correctas

        const resultado = guardarExamenAprobado();

        mostrarAprobacion(resultado);

    }

    // Recuperar el usuario que inició sesión

    const usuarioActivo = obtenerUsuarioActivo();

    if (!usuarioActivo) {

        window.location.replace(
            "../../1_Vista Login/login.html"
        );

    } else if (!respuestasExamenes[idioma]) {

        // Evitar corregir un idioma no configurado

        mostrarMensaje(
            "Este examen todavía no está configurado."
        );

        botonComprobar.disabled = true;

    } else if (!examenDisponible(usuarioActivo)) {

        // Regresar al mapa si el examen está bloqueado

        window.location.replace(
            "../../3_Vista Mapa de Unidades/" +
            archivosMapas[idioma]
        );

    } else {

        // Activar el banco de palabras

        configurarBancoPalabras();

        // Limpiar mensajes al cambiar las respuestas

        formulario.addEventListener(
            "change",
            limpiarMensaje
        );

        // Corregir el examen cuando se envía el formulario

        formulario.addEventListener(
            "submit",
            comprobarExamen
        );

    }

}


