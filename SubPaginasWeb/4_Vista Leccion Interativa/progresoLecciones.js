import { obtenerUsuarioActivo, actualizarUsuario, formatearFecha } from "../../js/usuarios.js";



export function leccionCompletada(usuario, idioma, idLeccion) {

    const curso = usuario.cursos?.[idioma];

    const completadas = curso?.leccionesCompletadas || [];

    return completadas.includes(idLeccion);

}

function examenAprobado(usuario, idioma, nivel) {

    const curso = usuario.cursos?.[idioma];

    const aprobados = curso?.examenesAprobados || [];

    return aprobados.includes(nivel);

}

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


export function calcularRecompensa(usuario, xpBase, monedasGanadas) {

    const dobleXp = usuario.dobleXpPendiente === true;
    const xpGanados = dobleXp ? xpBase * 2 : xpBase;

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

    const diasActividad = [...(usuario.diasActividad || [])];

    if (!diasActividad.includes(hoy)) {
        diasActividad.push(hoy);
    }

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

export function guardarProgresoLeccion(idioma, idLeccion) {

    const usuario = obtenerUsuarioActivo();

    if (!usuario) {
        return { estado: "error" };
    }

    if (leccionCompletada(usuario, idioma, idLeccion)) {
        return { estado: "repetida" };
    }

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

    const recompensa = calcularRecompensa(usuario, 10, 30);

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
