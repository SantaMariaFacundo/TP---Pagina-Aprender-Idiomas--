// Importamos los módulos compartidos necesarios para esta página.
import "../../js/header.js";
import "../../js/buscador.js";

// Importamos las funciones de usuarios y la vista de opiniones.
import { obtenerUsuarioActivo } from "../../js/usuarios.js";
import { iniciarOpiniones } from "./opinionesVista.js";


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

    // Nombres que se muestran en los mensajes
    const nombresNiveles = {
        a: "A1-A2",
        b: "B1-B2",
        c: "C1-C2"
    };

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
                return completadas.includes(obtenerIdLeccion(nivel, actividad));
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

        // Explicar por qué un nivel todavía está bloqueado
        function motivoNivelBloqueado(nivel) {

            if (nivel === "b") {
                return "Aprobá el examen A1-A2 para desbloquear este nivel.";
            }

            if (!examenAprobado("a")) {
                return "Aprobá los exámenes A1-A2 y B1-B2 para desbloquear este nivel.";
            }

            return "Aprobá el examen B1-B2 para desbloquear este nivel.";
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
            const texto = contenedor.querySelector(".barra-progreso span");

            if (barra) {
                barra.value = porcentaje;
                barra.textContent = porcentaje + "%";
            }

            if (texto) {
                texto.textContent = porcentaje + "%";
            }
        }

        // Mostrar el estado de una tarjeta con texto (no solo con color)
        function mostrarEstado(tarjeta, estado, texto) {

            const parrafo = tarjeta.querySelector(".estado-leccion");

            if (!parrafo) {
                return;
            }

            parrafo.textContent = texto;
            parrafo.className = "estado-leccion estado-" + estado;
        }

        // Habilitar o bloquear un enlace
        function configurarEnlace(enlace, disponible, direccion, textoBoton, descripcion) {

            if (!enlace) {
                return;
            }

            enlace.textContent = textoBoton;
            enlace.setAttribute("aria-label", descripcion);

            if (disponible) {

                enlace.href = direccion;
                enlace.removeAttribute("aria-disabled");
                enlace.removeAttribute("tabindex");

            } else {

                enlace.removeAttribute("href");
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
                const titulo = tarjeta.querySelector("h3").textContent.trim();
                const enlace = tarjeta.querySelector(".boton-card");

                tarjeta.dataset.leccion = idLeccion;

                actualizarBarra(tarjeta, completada ? 100 : 0);

                if (!disponible) {

                    // Bloqueada: explicamos qué falta para desbloquearla.
                    mostrarEstado(tarjeta, "bloqueada", "Bloqueada. " + motivoNivelBloqueado(nivel));

                    configurarEnlace(enlace, false, "", "Bloqueado",
                        titulo + " " + nombresNiveles[nivel] + " bloqueado");

                } else if (completada) {

                    // Completada: se puede repetir.
                    mostrarEstado(tarjeta, "completada", "Completada ✔");

                    configurarEnlace(enlace, true, obtenerEnlaceLeccion(nivel, actividad), "Repetir",
                        "Repetir " + titulo + " " + nombresNiveles[nivel]);

                } else {

                    // Disponible y sin terminar: está en curso.
                    mostrarEstado(tarjeta, "en-curso", "En curso");

                    configurarEnlace(enlace, true, obtenerEnlaceLeccion(nivel, actividad), "Empezar",
                        "Empezar " + titulo + " " + nombresNiveles[nivel]);
                }
            });
        }

        // Actualizar el examen de un nivel
        function configurarExamen(seccion, nivel) {

            const tarjetaExamen = seccion.querySelector(".card-examen");

            if (!tarjetaExamen) {
                return;
            }

            const enlace = tarjetaExamen.querySelector(".boton-card");
            const nombreNivel = nombresNiveles[nivel];

            // El examen requiere el nivel desbloqueado y las tres actividades completadas
            const disponible = nivelDisponible(nivel) && actividadesCompletadas(nivel);

            if (examenAprobado(nivel)) {

                mostrarEstado(tarjetaExamen, "completada", "Examen aprobado ✔");
                configurarEnlace(enlace, true, obtenerEnlaceExamen(nivel), "Repetir examen",
                    "Repetir examen " + nombreNivel);

            } else if (disponible) {

                mostrarEstado(tarjetaExamen, "en-curso", "Listo para rendir");
                configurarEnlace(enlace, true, obtenerEnlaceExamen(nivel), "Rendir examen",
                    "Rendir examen " + nombreNivel);

            } else if (!nivelDisponible(nivel)) {

                mostrarEstado(tarjetaExamen, "bloqueada", "Bloqueado. " + motivoNivelBloqueado(nivel));
                configurarEnlace(enlace, false, "", "Bloqueado", "Examen " + nombreNivel + " bloqueado");

            } else {

                mostrarEstado(tarjetaExamen, "bloqueada",
                    "Bloqueado. Completá Listening, Vocabulario y Gramática de este nivel para rendirlo.");
                configurarEnlace(enlace, false, "", "Bloqueado", "Examen " + nombreNivel + " bloqueado");
            }

            // Controlar el candado visual del examen
            const candado = tarjetaExamen.querySelector(".card-bloqueada");

            if (candado) {
                candado.style.display = disponible || examenAprobado(nivel) ? "none" : "flex";
            }
        }

        // Recorrer los niveles A1-A2, B1-B2 y C1-C2
        const secciones = mapaUnidades.querySelectorAll(".seccion-unidades");

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

                if (completadas.includes(obtenerIdLeccion(nivel, actividad))) {
                    cantidadCompletada++;
                }
            });

            if (examenAprobado(nivel)) {
                cantidadCompletada++;
            }
        });

        // El curso contiene 9 actividades y 3 exámenes
        const total = 12;
        const porcentajeGeneral = Math.round((cantidadCompletada / total) * 100);

        // Actualizar la barra principal del curso
        const barraPrincipal = mapaUnidades.querySelector(".barra-principal");

        if (barraPrincipal) {
            barraPrincipal.value = porcentajeGeneral;
            barraPrincipal.textContent = porcentajeGeneral + "%";
            barraPrincipal.setAttribute("aria-label", "Progreso del curso: " + porcentajeGeneral + "%");
        }

        // Mostrar la opción de volver al Home cuando se completó todo el curso
        if (porcentajeGeneral >= 100) {

            const enlaceFinal = document.createElement("a");

            enlaceFinal.href = "../2_Vista home/home.html";
            enlaceFinal.className = "volver-curso-completo";
            enlaceFinal.textContent = "¡Curso completado! Volver a mis cursos";

            // Lo agregamos al final del último nivel, antes de las opiniones.
            secciones[secciones.length - 1].append(enlaceFinal);
        }

        // Sección de valoraciones y comentarios del curso
        iniciarOpiniones(idioma, usuario);
    }
}
