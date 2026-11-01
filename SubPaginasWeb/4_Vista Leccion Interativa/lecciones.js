console.log("Sistema de lecciones conectado correctamente");

// Buscar la lección actual

const actividad = document.querySelector("main[data-idioma][data-leccion]");

if (actividad) {

    // Obtener el idioma del HTML

    const idioma = actividad.dataset.idioma;

    // Leer el nivel y la actividad desde la URL

    const parametros = new URLSearchParams(window.location.search);

    const niveles = ["a", "b", "c"];

    const tipos = [
        "listening",
        "vocabulario",
        "gramatica"
    ];

    const nivelSolicitado = parametros.get("nivel");
    const tipoSolicitado = parametros.get("actividad");

    const nivel = niveles.includes(nivelSolicitado)
        ? nivelSolicitado
        : "a";

    const tipoActividad = tipos.includes(tipoSolicitado)
        ? tipoSolicitado
        : "listening";

    // Obtener los elementos del formulario

    const formulario = actividad.querySelector(".card");
    const botonComprobar = formulario.querySelector(".comprobar");
    const barraProgreso = actividad.querySelector("progress");
    const titulo = formulario.querySelector("h1");
    const frase = formulario.querySelector(".frase p");

    // Configurar los ejercicios disponibles

    const ejercicios = {

        ingles: {

            listening: {
                tipo: "opciones",
                titulo: "Elegí la traducción correcta:",
                frase: "I would like to order a coffee, please",
                opciones: [
                    ["te", "Me gustaría pedir un té, por favor"],
                    ["cafe", "Quisiera pedir un café, por favor"],
                    ["mesa", "Necesito una mesa para dos, por favor"],
                    ["cuenta", "¿Podría traerme la cuenta, por favor?"]
                ],
                correcta: "cafe"
            },

            vocabulario: {
                tipo: "opciones",
                titulo: "Elegí la traducción correcta:",
                frase: "Apple",
                opciones: [
                    ["pera", "Pera"],
                    ["manzana", "Manzana"],
                    ["naranja", "Naranja"],
                    ["banana", "Banana"]
                ],
                correcta: "manzana"
            },

            gramatica: {
                tipo: "opciones",
                titulo: "Completá la oración:",
                frase: "She ___ English every day.",
                opciones: [
                    ["study", "study"],
                    ["studies", "studies"],
                    ["studying", "studying"],
                    ["studied", "studied"]
                ],
                correcta: "studies"
            }

        },

        aleman: {

            listening: {
                tipo: "palabras",
                titulo: "Traducí la siguiente oración:",
                frase: "Guten Tag, wie geht es dir?",
                palabras: [
                    "Hola",
                    "días",
                    "estás?",
                    "Gracias",
                    "¿cómo",
                    "Buenos",
                    "Adiós"
                ],
                correcta: "Buenos días ¿cómo estás?"
            },

            vocabulario: {
                tipo: "palabras",
                titulo: "Ordená la traducción correcta:",
                frase: "Danke schön!",
                palabras: [
                    "Adiós",
                    "gracias",
                    "Muchas",
                    "Buenos",
                    "días"
                ],
                correcta: "Muchas gracias"
            },

            gramatica: {
                tipo: "palabras",
                titulo: "Ordená la traducción correcta:",
                frase: "Ich trinke Wasser.",
                palabras: [
                    "agua",
                    "Ella",
                    "bebo",
                    "Yo",
                    "corro"
                ],
                correcta: "Yo bebo agua"
            }

        },

        chino: {

            listening: {
                tipo: "opciones",
                titulo: "Completá la frase:",
                frase: "你 ___ 吗？",
                opciones: [
                    ["hao", "好 (bien)"],
                    ["xiexie", "谢谢 (gracias)"],
                    ["zaijian", "再见 (adiós)"],
                    ["mingzi", "名字 (nombre)"]
                ],
                correcta: "hao"
            },

            vocabulario: {
                tipo: "opciones",
                titulo: "Elegí la traducción correcta:",
                frase: "谢谢",
                opciones: [
                    ["hola", "Hola"],
                    ["gracias", "Gracias"],
                    ["adios", "Adiós"],
                    ["agua", "Agua"]
                ],
                correcta: "gracias"
            },

            gramatica: {
                tipo: "opciones",
                titulo: "Completá la frase:",
                frase: "我 ___ 学生。",
                opciones: [
                    ["hao", "好 (bien)"],
                    ["shi", "是 (ser)"],
                    ["xiexie", "谢谢 (gracias)"],
                    ["ma", "吗 (partícula interrogativa)"]
                ],
                correcta: "shi"
            }

        }

    };

    // Seleccionar el ejercicio del idioma y actividad

    const ejercicio = ejercicios[idioma]
        ? ejercicios[idioma][tipoActividad]
        : null;

    // Mantener los identificadores originales de Listening A1-A2

    function obtenerIdLeccion(nivelActual, tipoActual) {

        if (nivelActual === "a" && tipoActual === "listening") {
            return idioma + "-1";
        }

        return idioma + "-" + nivelActual + "-" + tipoActual;

    }

    const idLeccion = obtenerIdLeccion(nivel, tipoActividad);

    // Crear el mensaje para mostrar las correcciones

    const mensaje = document.createElement("p");

    mensaje.className = "mensaje-leccion";
    mensaje.setAttribute("role", "status");

    formulario.insertBefore(mensaje, botonComprobar);

    // Mostrar mensajes y cambiar su color

    function mostrarMensaje(texto, correcto = false) {

        mensaje.textContent = texto;

        mensaje.style.color = correcto ? "#2A9C8D" : "#c0392b";

    }

    // Borrar el mensaje anterior al cambiar una respuesta

    function limpiarMensaje() {

        mensaje.textContent = "";

    }

    // Recuperar el usuario activo

    const usuarioActivo = obtenerUsuarioActivo();

    if (!usuarioActivo) {

        window.location.replace("../1_Vista Login/login.html");

    } else if (!ejercicio) {

        mostrarMensaje("Esta lección todavía no está configurada.");

        botonComprobar.disabled = true;

    } else {

        // Consultar si el usuario completó una actividad

        function leccionCompletada(usuario, identificador) {

            const cursos = usuario.cursos || {};
            const curso = cursos[idioma] || {};

            const completadas = curso.leccionesCompletadas || [];

            return completadas.includes(identificador);

        }

        // Consultar si el usuario aprobó un examen

        function examenAprobado(usuario, nivelExamen) {

            const cursos = usuario.cursos || {};
            const curso = cursos[idioma] || {};

            const aprobados = curso.examenesAprobados || [];

            return aprobados.includes(nivelExamen);

        }

        // Verificar si el nivel está disponible

        function nivelDisponible(usuario) {

            if (nivel === "a") {
                return true;
            }

            if (nivel === "b") {
                return examenAprobado(usuario, "a");
            }

            if (nivel === "c") {

                return examenAprobado(usuario, "a") &&
                    examenAprobado(usuario, "b");

            }

            return false;

        }

        // Obtener el archivo del mapa correspondiente

        const mapas = {
            ingles: "progreso-ingles.html",
            aleman: "progreso-aleman.html",
            chino: "progreso-chino.html"
        };

        // Impedir el ingreso directo a niveles bloqueados

        if (!nivelDisponible(usuarioActivo)) {

            window.location.replace(
                "../3_Vista Mapa de Unidades/" + mapas[idioma]
            );

        } else {

            // Mostrar la pregunta correspondiente

            titulo.textContent = ejercicio.titulo;
            frase.textContent = ejercicio.frase;

            // Ocultar el audio en las actividades que no son Listening

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

            // Preparar las actividades de opción múltiple

            function configurarOpciones() {

                const contenedor = formulario.querySelector(".opciones");

                if (!contenedor) {
                    return;
                }

                // Eliminar las opciones anteriores

                contenedor.replaceChildren();

                // Crear las opciones del ejercicio actual

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

                // Borrar el mensaje cuando se elige otra opción

                contenedor.addEventListener("change", limpiarMensaje);

            }

            // Preparar las actividades de ordenar palabras

            function configurarPalabras() {

                const banco = formulario.querySelector(".banco-palabras");

                const respuesta = formulario.querySelector(".respuesta");

                if (!banco || !respuesta) {
                    return;
                }

                // Vaciar el banco y las respuestas anteriores

                banco.replaceChildren();
                respuesta.replaceChildren();

                // Crear las palabras disponibles

                ejercicio.palabras.forEach(function(palabra) {

                    const boton = document.createElement("button");

                    boton.type = "button";
                    boton.textContent = palabra;
                    boton.dataset.palabra = palabra;

                    banco.appendChild(boton);

                });

                // Mover una palabra del banco a la respuesta

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

                // Devolver una palabra desde la respuesta al banco

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

            // Guardar la actividad completada y otorgar 10 XP

            function guardarLeccion() {

                const usuario = obtenerUsuarioActivo();

                if (!usuario) {
                    return false;
                }

                // Evitar sumar XP dos veces por la misma actividad

                if (leccionCompletada(usuario, idLeccion)) {
                    return "repetida";
                }

                const cursos = usuario.cursos || {};
                const curso = cursos[idioma] || {};

                const completadas = [
                    ...(curso.leccionesCompletadas || []),
                    idLeccion
                ];

                // Conservar los demás datos del curso

                const cursosActualizados = {
                    ...cursos,
                    [idioma]: {
                        ...curso,
                        leccionesCompletadas: completadas
                    }
                };

                // Guardar el progreso y los XP

                actualizarUsuario({
                    cursos: cursosActualizados,
                    xp: (Number(usuario.xp) || 0) + 10,
                    xpSemanal: (Number(usuario.xpSemanal) || 0) + 10
                });

                // Verificar que se guardó correctamente

                const actualizado = obtenerUsuarioActivo();

                if (
                    actualizado &&
                    leccionCompletada(actualizado, idLeccion)
                ) {

                    return "guardada";

                }

                return false;

            }

            // Comprobar la respuesta del usuario

            function comprobarRespuesta() {

                let respuestaUsuario = "";

                // Obtener la opción seleccionada

                if (ejercicio.tipo === "opciones") {

                    const seleccionada = formulario.querySelector(
                        'input[name="respuesta"]:checked'
                    );

                    if (!seleccionada) {

                        mostrarMensaje(
                            "Seleccioná una respuesta antes de comprobar."
                        );

                        return;

                    }

                    respuestaUsuario = seleccionada.value;

                }

                // Obtener las palabras en el orden elegido

                if (ejercicio.tipo === "palabras") {

                    const respuesta = formulario.querySelector(".respuesta");

                    const botones = respuesta.querySelectorAll("button");

                    if (botones.length === 0) {

                        mostrarMensaje(
                            "Seleccioná palabras para formar la oración."
                        );

                        return;

                    }

                    const palabras = Array.from(botones).map(function(boton) {

                        return boton.dataset.palabra;

                    });

                    respuestaUsuario = palabras.join(" ");

                }

                // Corregir una respuesta incorrecta

                if (respuestaUsuario !== ejercicio.correcta) {

                    mostrarMensaje(
                        "Respuesta incorrecta. ¡Intentá otra vez!"
                    );

                    return;

                }

                // Registrar una respuesta correcta

                const resultado = guardarLeccion();

                if (resultado === "repetida") {

                    mostrarMensaje(
                        "¡Correcto! Ya completaste esta actividad.",
                        true
                    );

                } else if (resultado === "guardada") {

                    mostrarMensaje(
                        "¡Respuesta correcta! Ganaste 10 XP.",
                        true
                    );

                } else {

                    mostrarMensaje("No se pudo guardar el progreso.");

                    return;

                }

                // Completar la barra de progreso

                barraProgreso.value = 100;
                barraProgreso.textContent = "100%";

            }

            // Preparar la interfaz según el tipo de ejercicio

            if (ejercicio.tipo === "opciones") {

                configurarOpciones();

            } else if (ejercicio.tipo === "palabras") {

                configurarPalabras();

            }

            // Evitar que el formulario recargue la página

            formulario.addEventListener("submit", function(evento) {

                evento.preventDefault();

            });

            // Conectar el botón Comprobar

            botonComprobar.addEventListener(
                "click",
                comprobarRespuesta
            );

            // Recuperar la barra si ya completó la actividad

            if (leccionCompletada(usuarioActivo, idLeccion)) {

                barraProgreso.value = 100;
                barraProgreso.textContent = "100%";

            }

        }

    }

}
