// Importamos las funciones de usuarios utilizadas en esta vista.
import { obtenerUsuarioActivo, actualizarUsuario } from "../../js/usuarios.js";


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

// Obtener una fecha en formato año-mes-día.
function fechaLocal(fecha = new Date()) {

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;

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

    // Calcular las recompensas.
    const dobleXp = usuario.dobleXpPendiente === true;

    const xpGanados = dobleXp ? 20 : 10;
    const monedasGanadas = 30;

    // Calcular la racha diaria.
    const hoy = fechaLocal();

    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    const fechaAyer = fechaLocal(ayer);

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

    // Guardar todos los cambios.
    const guardado = actualizarUsuario({
        cursos: cursosActualizados,
        xp: (Number(usuario.xp) || 0) + xpGanados,
        xpSemanal: (Number(usuario.xpSemanal) || 0) + xpGanados,
        monedas: (Number(usuario.monedas) || 0) + monedasGanadas,
        racha: racha,
        ultimaFechaActividad: hoy,
        diasActividad: diasActividad,
        xpDiario: xpAnteriorHoy + xpGanados,
        fechaXpDiario: hoy,
        dobleXpPendiente: dobleXp ? false : usuario.dobleXpPendiente === true
    });

    // Verificar que la actividad se guardó.
    const actualizado = obtenerUsuarioActivo();

    if (
        guardado &&
        actualizado &&
        leccionCompletada(actualizado, idioma, idLeccion)
    ) {
        return {
            estado: "guardada",
            xp: xpGanados,
            monedas: monedasGanadas,
            dobleXp: dobleXp
        };
    }

    return { estado: "error" };

}
