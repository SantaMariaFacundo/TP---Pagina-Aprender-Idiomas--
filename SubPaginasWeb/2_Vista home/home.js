import "../../js/header.js";
import "../../js/buscador.js";

import { obtenerUsuarioActivo, actualizarUsuario } from "../../js/usuarios.js";
import { abrirInformacionCurso, configurarCierreDialogo } from "../../js/infoCursos.js";
import { mostrarResumenHome } from "./resumenHome.js";


const botonesAgregar = document.querySelectorAll("[data-curso]");
const botonesQuitar = document.querySelectorAll("[data-cerrar]");

const tarjetas = {
    ingles: document.getElementById("card-ingles-progreso"),
    aleman: document.getElementById("card-aleman-progreso"),
    chino: document.getElementById("card-chino-progreso")
};

const nombres = {
    ingles: "Inglés",
    aleman: "Alemán",
    chino: "Chino Mandarín"
};

const archivos = {
    ingles: "progreso-ingles.html",
    aleman: "progreso-aleman.html",
    chino: "progreso-chino.html"
};

const saludo = document.getElementById("titulo-bienvenida");
const aviso = document.getElementById("mensajeSinCursos");
const continuar = document.querySelector(".boton-sc1 a");

const usuario = obtenerUsuarioActivo();

let seleccionados = usuario && Array.isArray(usuario.cursosSeleccionados)
    ? [...usuario.cursosSeleccionados]
    : [];

function textoHome(texto) { return texto; }

function nombreCurso(id) {
    return textoHome(nombres[id]);
}

function mostrarSaludo() {

    if (!usuario || !saludo) {
        return;
    }
    saludo.textContent = "Hola, bienvenido " + usuario.usuario + ".";

}

function progresoDe(id) {

    const actual = obtenerUsuarioActivo();
    const curso = (((actual || {}).cursos || {})[id]) || {};

    const completadas = curso.leccionesCompletadas || [];
    const aprobados = curso.examenesAprobados || [];

    let cantidad = 0;

    for (const nivel of ["a", "b", "c"]) {

        for (const tipo of ["listening", "vocabulario", "gramatica"]) {

            const clave = nivel === "a" && tipo === "listening"
                ? id + "-1"
                : id + "-" + nivel + "-" + tipo;

            if (completadas.includes(clave)) {
                cantidad++;
            }

        }

        if (aprobados.includes(nivel)) {
            cantidad++;
        }

    }

    const nivelActual = aprobados.includes("b")
        ? "c"
        : aprobados.includes("a")
            ? "b"
            : "a";

    const titulo = nivelActual === "a"
        ? "A1 - A2"
        : nivelActual === "b"
            ? "B1 - B2"
            : "C1 - C2";

    const suffix = nivelActual === "a"
        ? "A1A2"
        : nivelActual === "b"
            ? "B1B2"
            : "C1C2";

    const url = "../3_Vista Mapa de Unidades/" +
        archivos[id] + "#" + id + suffix;

    return {
        porcentaje: Math.round(cantidad / 12 * 100),
        titulo: titulo,
        url: url
    };

}

function refrescarTarjeta(id) {

    const tarjeta = tarjetas[id];

    if (!tarjeta) {
        return;
    }

    const datos = progresoDe(id);

    const titulo = tarjeta.querySelector(".curso");
    const porcentaje = tarjeta.querySelector(".unidad span");
    const barra = tarjeta.querySelector("progress");
    const enlace = tarjeta.querySelector(".boton-cards a");

    if (titulo) {
        titulo.textContent =
            textoHome("Curso:") + " " +
            nombreCurso(id) + " " + datos.titulo;
    }

    if (porcentaje) {
        porcentaje.textContent = datos.porcentaje + "%";
    }

    if (barra) {
        barra.value = datos.porcentaje;
        barra.textContent = datos.porcentaje + "%";
    }

    if (enlace) {

        enlace.href = datos.url;

        enlace.textContent = datos.porcentaje
            ? textoHome("Reanudar")
            : textoHome("Empezar");

        enlace.setAttribute(
            "aria-label",
            textoHome("Continuar curso de") + " " +
            nombreCurso(id) + " " + datos.titulo
        );

    }

}

function mostrarCursos() {

    Object.keys(tarjetas).forEach(function(id) {

        if (!tarjetas[id]) {
            return;
        }

        tarjetas[id].style.display = seleccionados.includes(id)
            ? "grid"
            : "none";

        if (seleccionados.includes(id)) {
            refrescarTarjeta(id);
        }

    });

    if (aviso) {
        aviso.style.display = seleccionados.length ? "none" : "flex";
    }

    botonesAgregar.forEach(function(boton) {

        const agregado = seleccionados.includes(boton.dataset.curso);

        boton.disabled = agregado;
        boton.textContent = agregado ? "Curso agregado ✔" : "Agregar Curso";
    });

    if (continuar) {

        const primero = seleccionados.find(function(id) {
            return archivos[id];
        });

        if (primero) {

            const datos = progresoDe(primero);

            continuar.href = datos.url;

            continuar.textContent =
                textoHome("Continuar lección:") + " " +
                nombreCurso(primero) + " " +
                datos.titulo;

        } else {

            continuar.href = "#seccion-2";
            continuar.textContent = textoHome("Explorar cursos");

        }

    }

}

function guardarCursos() {

    return !!usuario && actualizarUsuario({
        cursosSeleccionados: [...seleccionados]
    });

}

function agregarCurso(id) {

    if (!tarjetas[id] || seleccionados.includes(id)) {
        return;
    }

    seleccionados.push(id);

    if (!guardarCursos()) {

        seleccionados = seleccionados.filter(function(curso) {
            return curso !== id;
        });

        alert("No se pudo guardar el curso.");

    }

    mostrarCursos();

}

function quitarCurso(id) {

    if (!seleccionados.includes(id)) {
        return;
    }

    const anterior = [...seleccionados];

    seleccionados = seleccionados.filter(function(curso) {
        return curso !== id;
    });

    if (!guardarCursos()) {

        seleccionados = anterior;
        alert("No se pudo quitar el curso.");

    }

    mostrarCursos();

}

botonesAgregar.forEach(function(boton) {

    boton.addEventListener("click", function() {
        agregarCurso(boton.dataset.curso);
    });

});

botonesQuitar.forEach(function(boton) {

    boton.addEventListener("click", function() {
        quitarCurso(boton.dataset.cerrar);
    });

});




const dialogoCurso = document.getElementById("dialogo-curso");
const botonAccionDialogo = document.getElementById("accion-dialogo-curso");

let cursoDelDialogo = "";

function actualizarBotonDialogo() {
    if (seleccionados.includes(cursoDelDialogo)) {
        botonAccionDialogo.textContent = "IR AL CURSO";
    } else {
        botonAccionDialogo.textContent = "AGREGAR CURSO";
    }
}

document.querySelectorAll("[data-info-curso]").forEach((boton) => {
    boton.addEventListener("click", () => {
        cursoDelDialogo = boton.dataset.infoCurso;

        if (abrirInformacionCurso(cursoDelDialogo)) {
            actualizarBotonDialogo();
        }
    });
});

if (botonAccionDialogo) {
    botonAccionDialogo.addEventListener("click", () => {

        if (seleccionados.includes(cursoDelDialogo)) {
            window.location.href = "../3_Vista Mapa de Unidades/" + archivos[cursoDelDialogo];
            return;
        }

        agregarCurso(cursoDelDialogo);
        dialogoCurso.close();
    });
}

configurarCierreDialogo();


mostrarSaludo();
mostrarCursos();
mostrarResumenHome(usuario);
