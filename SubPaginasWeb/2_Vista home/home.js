// Importamos los módulos compartidos necesarios para esta página.
import "../../js/header.js";
import "../../js/buscador.js";

// Importamos las funciones de usuarios utilizadas en esta vista.
import { obtenerUsuarioActivo, actualizarUsuario } from "../../js/usuarios.js";


// Botones para agregar y quitar cursos.
const botonesAgregar = document.querySelectorAll("[data-curso]");
const botonesQuitar = document.querySelectorAll("[data-cerrar]");

// Tarjetas de los cursos.
const tarjetas = {
    ingles: document.getElementById("card-ingles-progreso"),
    aleman: document.getElementById("card-aleman-progreso"),
    chino: document.getElementById("card-chino-progreso")
};

// Nombres y archivos de los idiomas.
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

// Elementos de Home.
const saludo = document.getElementById("titulo-bienvenida");
const aviso = document.getElementById("mensajeSinCursos");
const continuar = document.querySelector(".boton-sc1 a");

// Obtener el usuario activo.
const usuario = obtenerUsuarioActivo();

// Obtener sus cursos seleccionados.
let seleccionados = usuario && Array.isArray(usuario.cursosSeleccionados)
    ? [...usuario.cursosSeleccionados]
    : [];

function textoHome(texto) { return texto; }

// Mostrar el nombre del idioma traducido.
function nombreCurso(id) {
    return textoHome(nombres[id]);
}

// Mostrar el saludo del usuario.
function mostrarSaludo() {

    if (!usuario || !saludo) {
        return;
    }
    saludo.textContent = "Hola, bienvenido " + usuario.usuario + ".";

}

// Calcular el progreso de cada curso.
function progresoDe(id) {

    const actual = obtenerUsuarioActivo();
    const curso = (((actual || {}).cursos || {})[id]) || {};

    const completadas = curso.leccionesCompletadas || [];
    const aprobados = curso.examenesAprobados || [];

    let cantidad = 0;

    // Contar las actividades y exámenes completados.
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

    // Obtener el nivel desbloqueado.
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

// Actualizar cada tarjeta.
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

// Mostrar los cursos seleccionados.
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

    // Mostrar aviso si no hay cursos.
    if (aviso) {
        aviso.style.display = seleccionados.length ? "none" : "flex";
    }

    // Actualizar el botón principal.
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

// Guardar los cursos en la cuenta.
function guardarCursos() {

    return !!usuario && actualizarUsuario({
        cursosSeleccionados: [...seleccionados]
    });

}

// Agregar un curso.
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

// Quitar un curso.
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

// Detectar clics en Agregar Curso.
botonesAgregar.forEach(function(boton) {

    boton.addEventListener("click", function() {
        agregarCurso(boton.dataset.curso);
    });

});

// Detectar clics en Quitar Curso.
botonesQuitar.forEach(function(boton) {

    boton.addEventListener("click", function() {
        quitarCurso(boton.dataset.cerrar);
    });

});



// Mostrar los datos al abrir Home.
mostrarSaludo();
mostrarCursos();


// Meta diaria compartida con Tienda: XP del día actual, no valores de ejemplo.
function actualizarMetaDiariaHome() {
    const usuarioActual = obtenerUsuarioActivo();
    if (!usuarioActual) return;
    const fecha = new Date();
    const hoy = fecha.getFullYear() + "-" +
        String(fecha.getMonth() + 1).padStart(2, "0") + "-" +
        String(fecha.getDate()).padStart(2, "0");
    const meta = 40;
    const xpHoy = usuarioActual.fechaXpDiario === hoy ? Number(usuarioActual.xpDiario) || 0 : 0;
    const porcentaje = Math.min(Math.round(xpHoy / meta * 100), 100);
    const seccion = document.querySelector(".metaDiaria");
    if (!seccion) return;
    const cantidad = seccion.querySelector(".datos-titulo p");
    const mensaje = seccion.querySelector(".mensaje-meta-home");
    const barra = seccion.querySelector("progress");
    const indicador = seccion.querySelector(".datos-progress span");
    if (cantidad) cantidad.textContent = xpHoy + " / " + meta + " XP";
    if (barra) { barra.max = meta; barra.value = Math.min(xpHoy, meta); barra.textContent = porcentaje + "%"; }
    if (indicador) indicador.textContent = porcentaje + "%";
    if (mensaje) mensaje.textContent = xpHoy >= meta
        ? "¡Felicitaciones! Alcanzaste tu meta diaria."
        : "Te faltan " + (meta - xpHoy) + " XP para alcanzar tu meta diaria.";
}
actualizarMetaDiariaHome();
window.addEventListener("pageshow", actualizarMetaDiariaHome);

// Ventana informativa de los cursos. Se usa un solo diálogo para las tres tarjetas.
const dialogoCurso = document.getElementById("dialogo-info-curso");
const detalleCurso = {
    ingles: { nombre: "Inglés", descripcion: "Practicá comprensión auditiva, vocabulario y gramática con actividades y exámenes." },
    aleman: { nombre: "Alemán", descripcion: "Aprendé expresiones, vocabulario y estructuras de alemán con actividades interactivas." },
    chino: { nombre: "Chino mandarín", descripcion: "Conocé palabras y expresiones de chino mandarín mientras avanzás por niveles." }
};

document.querySelectorAll("[data-info-curso]").forEach(function(boton) {
    boton.addEventListener("click", function() {
        const datos = detalleCurso[boton.dataset.infoCurso];
        if (!datos || !dialogoCurso) return;
        dialogoCurso.querySelector("h2").textContent = "Curso de " + datos.nombre;
        dialogoCurso.querySelector(".descripcion-curso-popup").textContent = datos.descripcion;
        dialogoCurso.showModal();
    });
});
const cerrarInfoCurso = document.getElementById("cerrar-info-curso");
if (cerrarInfoCurso) cerrarInfoCurso.addEventListener("click", function() { dialogoCurso.close(); });
