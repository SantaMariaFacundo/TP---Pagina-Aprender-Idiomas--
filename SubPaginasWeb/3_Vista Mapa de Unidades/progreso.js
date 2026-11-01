
console.log("Mapa de unidades conectado correctamente");

// Buscar el mapa del idioma que está abierto

const mapaUnidades = document.querySelector("main[data-curso]");

if (mapaUnidades) {

    // Obtener el idioma del mapa

    const idioma = mapaUnidades.dataset.curso;

    // Recuperar el usuario activo

    const usuario = obtenerUsuarioActivo();

    // Archivos de las lecciones según el idioma

    const archivosLecciones = {
        ingles: "leccionIngles.html",
        aleman: "leccionAleman.html",
        chino: "leccionMandarin.html"
    };

    // Archivos de los exámenes según el idioma

    const archivosExamenes = {
        ingles: "examenIngles.html",
        aleman: "examenAleman.html",
        chino: "examenChino.html"
    };

    // Niveles y actividades disponibles

    const niveles = ["a", "b", "c"];

    const actividades = [
        "listening",
        "vocabulario",
        "gramatica"
    ];

    if (!usuario) {

        window.location.replace("../1_Vista Login/login.html");

    } else {

        // Recuperar el progreso guardado de este curso

        const cursos = usuario.cursos || {};
        const curso = cursos[idioma] || {};

        const completadas = curso.leccionesCompletadas || [];
        const examenesAprobados = curso.examenesAprobados || [];

        // Crear el identificador de cada actividad

        function obtenerIdLeccion(nivel, actividad) {

            if (nivel === "a" && actividad === "listening") {
                return idioma + "-1";
            }

            return idioma + "-" + nivel + "-" + actividad;

        }

        // Comprobar si se completaron las tres actividades de un nivel

        function actividadesCompletadas(nivel) {

            return actividades.every(function(actividad) {

                const id = obtenerIdLeccion(nivel, actividad);

                return completadas.includes(id);

            });

        }

        // Comprobar si un examen fue aprobado

        function examenAprobado(nivel) {

            return examenesAprobados.includes(nivel);

        }

        // Comprobar si un nivel está desbloqueado

        function nivelDisponible(nivel) {

            if (nivel === "a") {
                return true;
            }

            if (nivel === "b") {
                return examenAprobado("a");
            }

            if (nivel === "c") {
                return examenAprobado("a") && examenAprobado("b");
            }

            return false;

        }

        // Construir el enlace de una actividad

        function obtenerEnlaceLeccion(nivel, actividad) {

            return "../4_Vista Leccion Interativa/" +
                archivosLecciones[idioma] +
                "?nivel=" + nivel +
                "&actividad=" + actividad;

        }

        // Construir el enlace del examen

        function obtenerEnlaceExamen(nivel) {

            return "../4_Vista Leccion Interativa/examenes/" +
                archivosExamenes[idioma] +
                "?nivel=" + nivel;

        }

        // Actualizar una barra de progreso y su porcentaje

        function actualizarBarra(contenedor, porcentaje) {

            const barra = contenedor.querySelector("progress");

            const texto = contenedor.querySelector(
                ".barra-progreso span"
            );

            if (barra) {

                barra.value = porcentaje;
                barra.textContent = porcentaje + "%";

            }

            if (texto) {

                texto.textContent = porcentaje + "%";

            }

        }

        // Habilitar o bloquear un enlace sin modificar su diseño

        function configurarEnlace(enlace, disponible, direccion) {

            if (!enlace) {
                return;
            }

            if (disponible) {

                enlace.href = direccion;

                enlace.textContent = "Ir al curso";

                enlace.removeAttribute("aria-disabled");
                enlace.removeAttribute("tabindex");

            } else {

                enlace.removeAttribute("href");

                enlace.textContent = "Próximamente";

                enlace.setAttribute("aria-disabled", "true");
                enlace.setAttribute("tabindex", "-1");

            }

        }

        // Actualizar las tres tarjetas de un nivel

        function configurarActividades(seccion, nivel) {

            const tarjetas = seccion.querySelectorAll(".cards-a1a2");

            tarjetas.forEach(function(tarjeta, indice) {

                const actividad = actividades[indice];

                if (!actividad) {
                    return;
                }

                const idLeccion = obtenerIdLeccion(nivel, actividad);

                const completada = completadas.includes(idLeccion);

                const disponible = nivelDisponible(nivel);

                // Guardar el identificador en la tarjeta

                tarjeta.dataset.leccion = idLeccion;

                // Mostrar 100% si está completada o 0% si está pendiente

                actualizarBarra(
                    tarjeta,
                    completada ? 100 : 0
                );

                // Configurar el botón para entrar a la lección

                const enlace = tarjeta.querySelector(".boton-card");

                configurarEnlace(
                    enlace,
                    disponible,
                    obtenerEnlaceLeccion(nivel, actividad)
                );

            });

        }

        // Actualizar el examen de un nivel

        function configurarExamen(seccion, nivel) {

            const tarjetaExamen = seccion.querySelector(".card-examen");

            if (!tarjetaExamen) {
                return;
            }

            const enlace = tarjetaExamen.querySelector(".boton-card");

            // El examen requiere las tres actividades completadas

            const disponible =
                nivelDisponible(nivel) &&
                actividadesCompletadas(nivel);

            configurarEnlace(
                enlace,
                disponible,
                obtenerEnlaceExamen(nivel)
            );

            // Mostrar si el examen ya fue aprobado

            if (examenAprobado(nivel) && enlace) {

                enlace.textContent = "Examen aprobado";

            }

            // Controlar el candado visual del examen

            const candado = tarjetaExamen.querySelector(".card-bloqueada");

            if (candado) {

                candado.style.display = disponible ? "none" : "flex";

            }

        }

        // Recorrer los niveles A1-A2, B1-B2 y C1-C2

        const secciones = mapaUnidades.querySelectorAll(
            ".seccion-unidades"
        );

        secciones.forEach(function(seccion, indice) {

            const nivel = niveles[indice];

            if (!nivel) {
                return;
            }

            configurarActividades(seccion, nivel);

            configurarExamen(seccion, nivel);

        });

        // Contar las actividades y los exámenes aprobados

        let cantidadCompletada = 0;

        niveles.forEach(function(nivel) {

            actividades.forEach(function(actividad) {

                const id = obtenerIdLeccion(nivel, actividad);

                if (completadas.includes(id)) {
                    cantidadCompletada++;
                }

            });

            if (examenAprobado(nivel)) {
                cantidadCompletada++;
            }

        });

        // El curso contiene 9 actividades y 3 exámenes

        const total = 12;

        const porcentajeGeneral = Math.round(
            (cantidadCompletada / total) * 100
        );

        // Actualizar la barra principal del curso

        const barraPrincipal = mapaUnidades.querySelector(
            ".barra-principal"
        );

        if (barraPrincipal) {

            barraPrincipal.value = porcentajeGeneral;

            barraPrincipal.textContent = porcentajeGeneral + "%";

            barraPrincipal.setAttribute(
                "aria-label",
                "Progreso del curso: " + porcentajeGeneral + "%"
            );

        }

    }

}
