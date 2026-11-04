import "../../js/header.js";
import "../../js/buscador.js";

import { obtenerUsuarioActivo } from "../../js/usuarios.js";
import { iniciarOpiniones } from "./opinionesVista.js";


const mapaUnidades = document.querySelector("main[data-curso]");

if (mapaUnidades) {

    const idioma = mapaUnidades.dataset.curso;

    const usuario = obtenerUsuarioActivo();

    const archivosLecciones = {
        ingles: "leccionIngles.html",
        aleman: "leccionAleman.html",
        chino: "leccionMandarin.html"
    };

    const archivosExamenes = {
        ingles: "examenIngles.html",
        aleman: "examenAleman.html",
        chino: "examenChino.html"
    };

    const niveles = ["a", "b", "c"];

    const actividades = [
        "listening",
        "vocabulario",
        "gramatica"
    ];

    const nombresNiveles = {
        a: "A1-A2",
        b: "B1-B2",
        c: "C1-C2"
    };

    if (!usuario) {

        window.location.replace("../1_Vista Login/login.html");

    } else {

        const cursos = usuario.cursos || {};
        const curso = cursos[idioma] || {};

        const completadas = curso.leccionesCompletadas || [];
        const examenesAprobados = curso.examenesAprobados || [];

        function obtenerIdLeccion(nivel, actividad) {

            if (nivel === "a" && actividad === "listening") {
                return idioma + "-1";
            }

            return idioma + "-" + nivel + "-" + actividad;
        }

        function actividadesCompletadas(nivel) {

            return actividades.every(function(actividad) {
                return completadas.includes(obtenerIdLeccion(nivel, actividad));
            });
        }

        function examenAprobado(nivel) {
            return examenesAprobados.includes(nivel);
        }

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

        function motivoNivelBloqueado(nivel) {

            if (nivel === "b") {
                return "Aprobá el examen A1-A2 para desbloquear este nivel.";
            }

            if (!examenAprobado("a")) {
                return "Aprobá los exámenes A1-A2 y B1-B2 para desbloquear este nivel.";
            }

            return "Aprobá el examen B1-B2 para desbloquear este nivel.";
        }

        function obtenerEnlaceLeccion(nivel, actividad) {

            return "../4_Vista Leccion Interativa/" +
                archivosLecciones[idioma] +
                "?nivel=" + nivel +
                "&actividad=" + actividad;
        }

        function obtenerEnlaceExamen(nivel) {

            return "../4_Vista Leccion Interativa/examenes/" +
                archivosExamenes[idioma] +
                "?nivel=" + nivel;
        }

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

        function mostrarEstado(tarjeta, estado, texto) {

            const parrafo = tarjeta.querySelector(".estado-leccion");

            if (!parrafo) {
                return;
            }

            parrafo.textContent = texto;
            parrafo.className = "estado-leccion estado-" + estado;
        }

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

                    mostrarEstado(tarjeta, "bloqueada", "Bloqueada. " + motivoNivelBloqueado(nivel));

                    configurarEnlace(enlace, false, "", "Bloqueado",
                        titulo + " " + nombresNiveles[nivel] + " bloqueado");

                } else if (completada) {

                    mostrarEstado(tarjeta, "completada", "Completada ✔");

                    configurarEnlace(enlace, true, obtenerEnlaceLeccion(nivel, actividad), "Repetir",
                        "Repetir " + titulo + " " + nombresNiveles[nivel]);

                } else {

                    mostrarEstado(tarjeta, "en-curso", "En curso");

                    configurarEnlace(enlace, true, obtenerEnlaceLeccion(nivel, actividad), "Empezar",
                        "Empezar " + titulo + " " + nombresNiveles[nivel]);
                }
            });
        }

        function configurarExamen(seccion, nivel) {

            const tarjetaExamen = seccion.querySelector(".card-examen");

            if (!tarjetaExamen) {
                return;
            }

            const enlace = tarjetaExamen.querySelector(".boton-card");
            const nombreNivel = nombresNiveles[nivel];

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

            const candado = tarjetaExamen.querySelector(".card-bloqueada");

            if (candado) {
                candado.style.display = disponible || examenAprobado(nivel) ? "none" : "flex";
            }
        }

        const secciones = mapaUnidades.querySelectorAll(".seccion-unidades");

        secciones.forEach(function(seccion, indice) {

            const nivel = niveles[indice];

            if (!nivel) {
                return;
            }

            configurarActividades(seccion, nivel);
            configurarExamen(seccion, nivel);
        });

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

        const total = 12;
        const porcentajeGeneral = Math.round((cantidadCompletada / total) * 100);

        const barraPrincipal = mapaUnidades.querySelector(".barra-principal");

        if (barraPrincipal) {
            barraPrincipal.value = porcentajeGeneral;
            barraPrincipal.textContent = porcentajeGeneral + "%";
            barraPrincipal.setAttribute("aria-label", "Progreso del curso: " + porcentajeGeneral + "%");
        }

        if (porcentajeGeneral >= 100) {

            const enlaceFinal = document.createElement("a");

            enlaceFinal.href = "../2_Vista home/home.html";
            enlaceFinal.className = "volver-curso-completo";
            enlaceFinal.textContent = "¡Curso completado! Volver a mis cursos";

            secciones[secciones.length - 1].append(enlaceFinal);
        }

        iniciarOpiniones(idioma, usuario);
    }
}
