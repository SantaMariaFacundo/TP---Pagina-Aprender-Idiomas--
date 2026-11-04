/**
 * Vista de opiniones del mapa de unidades.
 * Muestra el promedio, la lista de opiniones del curso
 * y el formulario para valorar el curso.
 */
import { obtenerUsuarios } from "../../js/usuarios.js";
import {
    obtenerOpinionesDelCurso,
    obtenerOpinionDelUsuario,
    validarOpinion,
    guardarOpinion,
    calcularPromedio
} from "../../js/opiniones.js";
import {
    mostrarMensaje,
    ocultarMensaje,
    mostrarErroresCampos,
    limpiarErroresCampos
} from "../../js/mensajes.js";

// Arma un texto de estrellas: 3 → "★★★☆☆".
function dibujarEstrellas(puntuacion) {
    return "★".repeat(puntuacion) + "☆".repeat(5 - puntuacion);
}

// Busca el nombre de usuario actual de quien publicó la opinión.
function obtenerNombreAutor(usuarioId) {
    const autor = obtenerUsuarios().find((usuario) => usuario.id === usuarioId);

    return autor ? autor.usuario : "Usuario";
}

// Dibuja la lista de opiniones del curso.
function mostrarOpiniones(curso, usuarioActivo) {
    const lista = document.getElementById("lista-opiniones");
    const promedio = document.getElementById("promedio-opiniones");
    const opiniones = obtenerOpinionesDelCurso(curso);

    lista.replaceChildren();

    // Estado vacío.
    if (opiniones.length === 0) {
        promedio.textContent = "Todavía no hay opiniones. ¡Sé el primero en valorar este curso!";
        return;
    }

    const media = calcularPromedio(opiniones).toFixed(1);
    promedio.textContent = `Calificación promedio: ${media} de 5 (${opiniones.length} opiniones)`;

    opiniones.forEach((opinion) => {
        const item = document.createElement("li");
        const autor = document.createElement("p");
        const estrellas = document.createElement("p");
        const comentario = document.createElement("p");

        item.className = "opinion";
        autor.className = "opinion-autor";
        estrellas.className = "opinion-estrellas";
        comentario.className = "opinion-comentario";

        // Marcamos la opinión propia para reconocerla.
        if (opinion.usuarioId === usuarioActivo.id) {
            item.classList.add("opinion-propia");
            autor.textContent = `${obtenerNombreAutor(opinion.usuarioId)} (vos) · ${opinion.fecha}`;
        } else {
            autor.textContent = `${obtenerNombreAutor(opinion.usuarioId)} · ${opinion.fecha}`;
        }

        estrellas.textContent = dibujarEstrellas(opinion.puntuacion);
        estrellas.setAttribute("aria-label", `${opinion.puntuacion} de 5 estrellas`);

        // textContent evita que se interprete HTML escrito por el usuario.
        comentario.textContent = opinion.comentario;

        item.append(autor, estrellas, comentario);
        lista.append(item);
    });
}

/**
 * Prepara la sección de opiniones de un curso.
 * Se llama desde progreso.js con el curso del mapa y el usuario activo.
 */
export function iniciarOpiniones(curso, usuarioActivo) {
    const formulario = document.getElementById("formulario-opinion");

    if (!formulario) {
        return;
    }

    const campoPuntuacion = document.getElementById("puntuacion-opinion");
    const campoComentario = document.getElementById("comentario-opinion");
    const boton = document.getElementById("btn-publicar-opinion");
    const mensaje = document.getElementById("mensaje-opinion");

    // Si el usuario ya opinó, cargamos su opinión para que pueda editarla.
    const opinionPrevia = obtenerOpinionDelUsuario(curso, usuarioActivo.id);

    if (opinionPrevia) {
        campoPuntuacion.value = String(opinionPrevia.puntuacion);
        campoComentario.value = opinionPrevia.comentario;
        boton.textContent = "Actualizar mi opinión";
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const datos = {
            curso: curso,
            usuarioId: usuarioActivo.id,
            puntuacion: Number(campoPuntuacion.value),
            comentario: campoComentario.value.trim()
        };

        const errores = validarOpinion(datos);

        if (Object.keys(errores).length > 0) {
            mostrarErroresCampos(formulario, errores);
            mostrarMensaje(mensaje, "Revisá los campos señalados antes de publicar.", "error");
            return;
        }

        limpiarErroresCampos(formulario);

        const resultado = guardarOpinion(datos);

        if (resultado === "creada") {
            mostrarMensaje(mensaje, "¡Gracias! Tu opinión se publicó correctamente.", "exito");
        } else {
            mostrarMensaje(mensaje, "Tu opinión se actualizó correctamente.", "exito");
        }

        boton.textContent = "Actualizar mi opinión";
        mostrarOpiniones(curso, usuarioActivo);
    });

    // Al cambiar algo, ocultamos el mensaje anterior.
    formulario.addEventListener("input", () => {
        ocultarMensaje(mensaje);
    });

    mostrarOpiniones(curso, usuarioActivo);
}
