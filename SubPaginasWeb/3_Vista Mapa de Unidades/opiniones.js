
console.log("Opiniones de cursos conectadas correctamente");

(function () {

    const mapa = document.querySelector("main[data-curso]");

    if (!mapa) {
        return;
    }

    const cursoActual = mapa.dataset.curso;
    const usuarioActivo = obtenerUsuarioActivo();

    if (!usuarioActivo) {
        return;
    }

    const CLAVE_OPINIONES = "grammatech_opiniones";

    const nombresCursos = {
        ingles: "Inglés",
        aleman: "Alemán",
        chino: "Chino Mandarín"
    };

    // Textos de la interfaz en ambos idiomas.
    const textos = {
        es: {
            titulo: "Opiniones del curso",
            subtitulo: "Valorá el curso y compartí tu experiencia.",
            calificar: "Calificá este curso",
            comentario: "Tu comentario",
            placeholder: "Contanos qué te pareció el curso...",
            publicar: "Publicar opinión",
            actualizar: "Actualizar opinión",
            lista: "Opiniones de estudiantes",
            vacio: "Todavía no hay opiniones. ¡Sé el primero!",
            promedio: "Calificación promedio",
            cantidad: "opiniones",
            seleccionar: "Seleccioná una calificación.",
            escribir: "Escribí un comentario antes de publicar.",
            guardado: "¡Tu opinión se publicó correctamente!",
            actualizado: "¡Tu opinión se actualizó correctamente!",
            error: "No se pudo guardar tu opinión.",
            estrellas: "estrellas",
            estrella: "estrella"
        },
        en: {
            titulo: "Course reviews",
            subtitulo: "Rate this course and share your experience.",
            calificar: "Rate this course",
            comentario: "Your comment",
            placeholder: "Tell us what you thought of this course...",
            publicar: "Publish review",
            actualizar: "Update review",
            lista: "Student reviews",
            vacio: "There are no reviews yet. Be the first!",
            promedio: "Average rating",
            cantidad: "reviews",
            seleccionar: "Choose a star rating.",
            escribir: "Write a comment before publishing.",
            guardado: "Your review was published successfully!",
            actualizado: "Your review was updated successfully!",
            error: "Your review could not be saved.",
            estrellas: "stars",
            estrella: "star"
        }
    };

    function idiomaActual() {
        return localStorage.getItem("grammatech_idioma") === "en"
            ? "en"
            : "es";
    }

    function t(clave) {
        return textos[idiomaActual()][clave];
    }

    // Recuperar todas las opiniones guardadas.
    function obtenerOpiniones() {

        try {
            const guardadas = JSON.parse(
                localStorage.getItem(CLAVE_OPINIONES) || "[]"
            );

            return Array.isArray(guardadas) ? guardadas : [];

        } catch (error) {
            console.error("Error al leer las opiniones:", error);
            return [];
        }

    }

    // Obtener únicamente las opiniones del curso abierto.
    function opinionesDelCurso() {

        return obtenerOpiniones().filter(function(opinion) {
            return opinion.curso === cursoActual;
        });

    }

    // Obtener la opinión del usuario actual.
    function miOpinion() {

        return opinionesDelCurso().find(function(opinion) {
            return opinion.usuarioId === usuarioActivo.id;
        });

    }

    // Agregar la sección al final del mapa.
    const seccion = document.createElement("section");

    seccion.className = "seccion-opiniones";
    seccion.id = "opiniones-curso";

    seccion.innerHTML = `
        <h2 id="titulo-opiniones"></h2>

        <p id="subtitulo-opiniones"></p>

        <div class="tarjeta-opiniones">

            <form id="formulario-opiniones">

                <h3 id="titulo-calificar"></h3>

                <div id="estrellas-opiniones"
                    role="group"
                    aria-label="Calificación del curso">
                </div>

                <label for="comentario-opinion"
                    id="label-comentario">
                </label>

                <textarea
                    id="comentario-opinion"
                    maxlength="500"
                    rows="4"
                    required>
                </textarea>

                <button type="submit"
                    id="btn-publicar-opinion">
                </button>

                <p id="mensaje-opinion"
                    role="status"
                    aria-live="polite">
                </p>

            </form>

        </div>

        <div class="tarjeta-opiniones">

            <h3 id="titulo-lista-opiniones"></h3>

            <p id="promedio-opiniones"></p>

            <div id="lista-opiniones"></div>

        </div>
    `;

    mapa.appendChild(seccion);

    // Estilos propios para no modificar el CSS existente.
    const estilos = document.createElement("style");

    estilos.textContent = `
        .seccion-opiniones {
            width: 100%;
            max-width: 850px;
            margin: 4rem auto;
            padding: 1rem;
            text-align: center;
        }

        .seccion-opiniones h2 {
            font-size: 2rem;
            margin-bottom: 0.7rem;
        }

        #subtitulo-opiniones {
            margin-bottom: 2rem;
        }

        .tarjeta-opiniones {
            background-color: white;
            border-radius: 1.8rem;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 0.0625rem 0.375rem
                rgba(68, 68, 68, 0.3);
            text-align: left;
        }

        .tarjeta-opiniones h3 {
            color: #6D2508;
            margin-bottom: 1rem;
        }

        #estrellas-opiniones {
            display: flex;
            gap: 0.4rem;
            margin-bottom: 1.5rem;
        }

        .estrella-opinion {
            border: none;
            background: transparent;
            color: #bbbbbb;
            font-size: 2.3rem;
            cursor: pointer;
            padding: 0.1rem;
        }

        .estrella-opinion.seleccionada {
            color: #E7A400;
        }

        .estrella-opinion:hover {
            transform: scale(1.1);
        }

        #label-comentario {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }

        #comentario-opinion {
            display: block;
            width: 100%;
            padding: 0.9rem;
            border: 1px solid #d8bda9;
            border-radius: 0.8rem;
            background-color: #F8E9DB;
            font: inherit;
            resize: vertical;
            margin-bottom: 1rem;
        }

        #btn-publicar-opinion {
            border: none;
            background-color: #CA6035;
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 0.9rem;
            font-weight: bold;
            cursor: pointer;
        }

        #btn-publicar-opinion:hover {
            background-color: #a84925;
        }

        #mensaje-opinion {
            margin-top: 1rem;
            font-weight: bold;
        }

        #promedio-opiniones {
            margin-bottom: 1rem;
            font-weight: bold;
        }

        .opinion-publicada {
            padding: 1rem 0;
            border-bottom: 1px solid #eeeeee;
        }

        .opinion-publicada:last-child {
            border-bottom: none;
        }

        .opinion-usuario {
            font-weight: bold;
            color: #6D2508;
        }

        .opinion-estrellas {
            color: #E7A400;
            margin: 0.4rem 0;
        }

        .opinion-fecha {
            font-size: 0.85rem;
            color: #666666;
            margin-bottom: 0.5rem;
        }

        .opinion-comentario {
            white-space: pre-wrap;
            overflow-wrap: anywhere;
        }

        @media screen and (max-width: 600px) {
            .seccion-opiniones {
                padding: 1rem;
            }

            .tarjeta-opiniones {
                padding: 1.3rem;
            }
        }
    `;

    document.head.appendChild(estilos);

    // Referencias a los elementos del formulario.
    const formulario = document.getElementById("formulario-opiniones");
    const contenedorEstrellas = document.getElementById("estrellas-opiniones");
    const comentario = document.getElementById("comentario-opinion");
    const botonPublicar = document.getElementById("btn-publicar-opinion");
    const mensaje = document.getElementById("mensaje-opinion");
    const lista = document.getElementById("lista-opiniones");
    const promedio = document.getElementById("promedio-opiniones");

    let puntuacion = 0;

    // Crear los cinco botones de estrellas.
    for (let numero = 1; numero <= 5; numero++) {

        const estrella = document.createElement("button");

        estrella.type = "button";
        estrella.className = "estrella-opinion";
        estrella.textContent = "★";
        estrella.dataset.valor = numero;

        estrella.addEventListener("click", function() {
            puntuacion = numero;
            actualizarEstrellas();
        });

        contenedorEstrellas.appendChild(estrella);

    }

    // Pintar las estrellas seleccionadas.
    function actualizarEstrellas() {

        contenedorEstrellas.querySelectorAll("button").forEach(
            function(estrella) {

                const valor = Number(estrella.dataset.valor);
                const seleccionada = valor <= puntuacion;

                estrella.classList.toggle(
                    "seleccionada",
                    seleccionada
                );

                estrella.setAttribute(
                    "aria-pressed",
                    String(valor === puntuacion)
                );

                estrella.setAttribute(
                    "aria-label",
                    valor + " " +
                    (valor === 1 ? t("estrella") : t("estrellas"))
                );

            }
        );

    }

    // Mostrar el mensaje de resultado.
    function mostrarMensaje(clave, correcto = false) {

        mensaje.textContent = t(clave);
        mensaje.style.color = correcto ? "#2A9C8D" : "#c0392b";

    }

    // Mostrar las opiniones del curso.
    function mostrarOpiniones() {

        lista.replaceChildren();

        const opiniones = opinionesDelCurso().sort(function(a, b) {
            return new Date(b.fecha) - new Date(a.fecha);
        });

        if (opiniones.length === 0) {
            promedio.textContent = "";
            lista.textContent = t("vacio");
            return;
        }

        const suma = opiniones.reduce(function(total, opinion) {
            return total + Number(opinion.puntuacion);
        }, 0);

        const media = (suma / opiniones.length).toFixed(1);

        promedio.textContent =
            t("promedio") + ": " +
            media + "/5 · " +
            opiniones.length + " " + t("cantidad");

        opiniones.forEach(function(opinion) {

            const articulo = document.createElement("article");
            articulo.className = "opinion-publicada";

            const usuario = document.createElement("p");
            usuario.className = "opinion-usuario";
            usuario.textContent = opinion.nombreUsuario;

            const estrellas = document.createElement("p");
            estrellas.className = "opinion-estrellas";
            estrellas.textContent =
                "★".repeat(opinion.puntuacion) +
                "☆".repeat(5 - opinion.puntuacion);

            const fecha = document.createElement("p");
            fecha.className = "opinion-fecha";

            fecha.textContent = new Date(opinion.fecha)
                .toLocaleDateString(
                    idiomaActual() === "en" ? "en-US" : "es-AR"
                );

            const texto = document.createElement("p");
            texto.className = "opinion-comentario";
            texto.textContent = opinion.comentario;

            articulo.append(usuario, estrellas, fecha, texto);
            lista.appendChild(articulo);

        });

    }

    // Guardar la opinión en localStorage.
    formulario.addEventListener("submit", function(evento) {

        evento.preventDefault();

        if (puntuacion < 1 || puntuacion > 5) {
            mostrarMensaje("seleccionar");
            return;
        }

        const texto = comentario.value.trim();

        if (texto === "") {
            mostrarMensaje("escribir");
            return;
        }

        const opiniones = obtenerOpiniones();

        const indice = opiniones.findIndex(function(opinion) {
            return opinion.curso === cursoActual &&
                opinion.usuarioId === usuarioActivo.id;
        });

        const opinionNueva = {
            curso: cursoActual,
            usuarioId: usuarioActivo.id,
            nombreUsuario: usuarioActivo.usuario,
            puntuacion: puntuacion,
            comentario: texto,
            fecha: new Date().toISOString()
        };

        if (indice === -1) {
            opiniones.push(opinionNueva);
        } else {
            opiniones[indice] = opinionNueva;
        }

        try {

            localStorage.setItem(
                CLAVE_OPINIONES,
                JSON.stringify(opiniones)
            );

            mostrarMensaje(
                indice === -1 ? "guardado" : "actualizado",
                true
            );

            actualizarIdioma();
            mostrarOpiniones();

        } catch (error) {

            console.error("Error al guardar la opinión:", error);
            mostrarMensaje("error");

        }

    });

    // Actualizar los textos al cambiar Es / En.
    function actualizarIdioma() {

        document.getElementById("titulo-opiniones").textContent =
            t("titulo");

        document.getElementById("subtitulo-opiniones").textContent =
            t("subtitulo");

        document.getElementById("titulo-calificar").textContent =
            t("calificar");

        document.getElementById("label-comentario").textContent =
            t("comentario");

        document.getElementById("titulo-lista-opiniones").textContent =
            t("lista");

        comentario.placeholder = t("placeholder");

        botonPublicar.textContent = miOpinion()
            ? t("actualizar")
            : t("publicar");

        contenedorEstrellas.setAttribute(
            "aria-label",
            t("calificar")
        );

        actualizarEstrellas();
        mostrarOpiniones();

    }

    // Cargar la opinión que el usuario ya publicó.
    const opinionGuardada = miOpinion();

    if (opinionGuardada) {
        puntuacion = opinionGuardada.puntuacion;
        comentario.value = opinionGuardada.comentario;
    }

    actualizarIdioma();

    // Responder al selector de idioma del header.
    window.addEventListener("idiomaActualizado", function() {
        actualizarIdioma();
    });

})();
