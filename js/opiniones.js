/**
 * Servicio de opiniones: guarda y lee las valoraciones de los cursos.
 *
 * Todas las opiniones se guardan en una sola clave de localStorage.
 * Cada una sabe a qué curso pertenece y qué usuario la publicó.
 */
import { OPINIONES_DEMO } from "./datos/usuariosDemo.js";

const CLAVE_OPINIONES = "grammatech_opiniones";

// Lee todas las opiniones. Si no hay, carga las de ejemplo.
function obtenerOpiniones() {
    const datos = localStorage.getItem(CLAVE_OPINIONES);

    if (datos === null) {
        guardarOpiniones(OPINIONES_DEMO);
        return [...OPINIONES_DEMO];
    }

    try {
        const opiniones = JSON.parse(datos);

        if (!Array.isArray(opiniones)) {
            throw new Error("Las opiniones guardadas no son un arreglo.");
        }

        return opiniones;

    } catch (error) {
        console.error("Error al leer las opiniones:", error);
        return [];
    }
}

// Guarda la lista completa de opiniones.
function guardarOpiniones(opiniones) {
    localStorage.setItem(CLAVE_OPINIONES, JSON.stringify(opiniones));
}

// Devuelve las opiniones de un curso, de la más nueva a la más vieja.
export function obtenerOpinionesDelCurso(curso) {
    return obtenerOpiniones()
        .filter((opinion) => opinion.curso === curso)
        .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

// Busca la opinión que un usuario ya dejó en un curso.
export function obtenerOpinionDelUsuario(curso, usuarioId) {
    return obtenerOpiniones().find(
        (opinion) => opinion.curso === curso && opinion.usuarioId === usuarioId
    );
}

// Valida los datos antes de guardar. Devuelve un objeto con los errores.
export function validarOpinion(datos) {
    const errores = {};

    if (datos.puntuacion < 1 || datos.puntuacion > 5) {
        errores["puntuacion-opinion"] = "Elegí una calificación de 1 a 5 estrellas.";
    }

    if (datos.comentario.length < 3) {
        errores["comentario-opinion"] = "Escribí un comentario de al menos 3 caracteres.";
    }

    return errores;
}

/**
 * Guarda la opinión de un usuario en un curso.
 * Si ya había opinado, se reemplaza: cada persona tiene una sola opinión por curso.
 * Devuelve "creada" o "actualizada".
 */
export function guardarOpinion(datos) {
    const opiniones = obtenerOpiniones();

    const indice = opiniones.findIndex(
        (opinion) => opinion.curso === datos.curso && opinion.usuarioId === datos.usuarioId
    );

    const opinion = {
        id: indice === -1 ? String(Date.now()) : opiniones[indice].id,
        curso: datos.curso,
        usuarioId: datos.usuarioId,
        puntuacion: datos.puntuacion,
        comentario: datos.comentario,
        fecha: new Date().toISOString().slice(0, 10)
    };

    if (indice === -1) {
        opiniones.push(opinion);
        guardarOpiniones(opiniones);
        return "creada";
    }

    opiniones[indice] = opinion;
    guardarOpiniones(opiniones);
    return "actualizada";
}

// Calcula el promedio de estrellas de una lista de opiniones.
export function calcularPromedio(opiniones) {
    if (opiniones.length === 0) {
        return 0;
    }

    const suma = opiniones.reduce((total, opinion) => total + opinion.puntuacion, 0);

    return suma / opiniones.length;
}
