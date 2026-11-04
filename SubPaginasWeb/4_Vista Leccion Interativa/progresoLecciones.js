// Importamos las funciones de usuarios utilizadas en esta vista.
import { obtenerUsuarioActivo, actualizarUsuario, formatearFecha } from "../../js/usuarios.js";


 // Este archivo controla el progreso y las recompensas.

 // Consultar si una lección ya fue completada.
export function leccionCompletada(usuario, idioma, idLeccion) {

    const curso = usuario.cursos?.[idioma];

    const completadas = curso?.leccionesCompletadas || [];

    return completadas.includes(idLeccion);

}

// Consultar si el usuario aprobó un examen.
function examenAprobado(usuario, idioma, nivel) {

    const curso = usuario.cursos?.[idioma];

    const aprobados = curso?.examenesAprobados || [];

    return aprobados.includes(nivel);

}

// Comprobar si el nivel está desbloqueado.
export function nivelDisponible(usuario, idioma, nivel) {

    if (nivel === "a") {
        return true;
    }

    if (nivel === "b") {
        return examenAprobado(usuario, idioma, "a");
    }

    if (nivel === "c") {
        return examenAprobado(usuario, idioma, "a") &&
               examenAprobado(usuario, idioma, "b");
    }

    return false;

}

/**
 * Calcula los datos del usuario que cambian al ganar una recompensa:
 * experiencia, monedas, racha, días con actividad y meta diaria.
 * Lo usan las lecciones y los exámenes.
 */
export function calcularRecompensa(usuario, xpBase, monedasGanadas) {

    // Si compró Doble XP en la tienda, esta recompensa vale el doble.
    const dobleXp = usuario.dobleXpPendiente === true;
    const xpGanados = dobleXp ? xpBase * 2 : xpBase;

    // Calcular la racha diaria.
    const hoy = formatearFecha();

    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const fechaAyer = formatearFecha(ayer);

    let racha = Number(usuario.racha) || 0;

    if (usuario.ultimaFechaActividad === hoy) {
        racha = Math.max(1, racha);
    } else if (usuario.ultimaFechaActividad === fechaAyer) {
        racha++;
    } else {
        racha = 1;
    }

    // Registrar los días con actividad.
    const diasActividad = [...(usuario.diasActividad || [])];

    if (!diasActividad.includes(hoy)) {
        diasActividad.push(hoy);
    }

    // Calcular los XP ganados hoy.
    const xpAnteriorHoy = usuario.fechaXpDiario === hoy
        ? Number(usuario.xpDiario) || 0
        : 0;

    return {
        xpGanados: xpGanados,
        monedasGanadas: monedasGanadas,
        dobleXp: dobleXp,
        cambios: {
            xp: (Number(usuario.xp) || 0) + xpGanados,
            xpSemanal: (Number(usuario.xpSemanal) || 0) + xpGanados,
            monedas: (Number(usuario.monedas) || 0) + monedasGanadas,
            racha: racha,
            ultimaFechaActividad: hoy,
            diasActividad: diasActividad,
            xpDiario: xpAnteriorHoy + xpGanados,
            fechaXpDiario: hoy,
            dobleXpPendiente: false
        }
    };
}

// Guardar una actividad completada y sus recompensas.
export function guardarProgresoLeccion(idioma, idLeccion) {

    const usuario = obtenerUsuarioActivo();

    if (!usuario) {
        return { estado: "error" };
    }

    // No premiar dos veces la misma actividad.
    if (leccionCompletada(usuario, idioma, idLeccion)) {
        return { estado: "repetida" };
    }

    // Actualizar las lecciones completadas.
    const cursos = usuario.cursos || {};
    const curso = cursos[idioma] || {};

    const completadas = [
        ...(curso.leccionesCompletadas || []),
        idLeccion
    ];

    const cursosActualizados = {
        ...cursos,
        [idioma]: {
            ...curso,
            leccionesCompletadas: completadas
        }
    };

    // Cada lección da 10 XP y 30 monedas.
    const recompensa = calcularRecompensa(usuario, 10, 30);

    // Guardar todos los cambios.
    const guardado = actualizarUsuario({
        ...recompensa.cambios,
        cursos: cursosActualizados
    });

    if (!guardado) {
        return { estado: "error" };
    }

    return {
        estado: "guardada",
        xp: recompensa.xpGanados,
        monedas: recompensa.monedasGanadas,
        dobleXp: recompensa.dobleXp
    };
}
