
import { formatearFecha, obtenerRachaActual } from "../../js/usuarios.js";

const META_DIARIA = 40;

function contarLecciones(usuario) {
    const cursos = usuario.cursos || {};
    let total = 0;

    for (const idioma of ["ingles", "aleman", "chino"]) {
        const curso = cursos[idioma] || {};
        total += (curso.leccionesCompletadas || []).length;
    }

    return total;
}

function contarExamenes(usuario) {
    const cursos = usuario.cursos || {};
    let total = 0;

    for (const idioma of ["ingles", "aleman", "chino"]) {
        const curso = cursos[idioma] || {};
        total += (curso.examenesAprobados || []).length;
    }

    return total;
}

function contarDiasEstaSemana(usuario) {
    const lunes = new Date();
    const diaSemana = lunes.getDay();

    lunes.setDate(lunes.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));

    const fechaLunes = formatearFecha(lunes);
    const dias = usuario.diasActividad || [];

    return dias.filter((dia) => dia >= fechaLunes).length;
}

function mostrarDato(id, valor) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.value = valor;
        elemento.textContent = valor;
    }
}

function mostrarEstadisticas(usuario) {
    mostrarDato("dato-racha", obtenerRachaActual(usuario));
    mostrarDato("dato-xp", Number(usuario.xp) || 0);
    mostrarDato("dato-lecciones", contarLecciones(usuario));

    const dias = contarDiasEstaSemana(usuario);
    const textoDias = document.getElementById("texto-dias-semana");

    if (textoDias) {
        textoDias.textContent = `${dias} ${dias === 1 ? "día" : "días"} con actividad esta semana`;
    }
}

function mostrarMetaDiaria(usuario) {
    const seccion = document.querySelector(".metaDiaria");

    if (!seccion) {
        return;
    }

    const hoy = formatearFecha();
    const xpHoy = usuario.fechaXpDiario === hoy ? Number(usuario.xpDiario) || 0 : 0;
    const porcentaje = Math.min(Math.round((xpHoy / META_DIARIA) * 100), 100);

    const cantidad = seccion.querySelector(".datos-titulo p");
    const mensaje = seccion.querySelector(".mensaje-meta-home");
    const barra = seccion.querySelector("progress");
    const indicador = seccion.querySelector(".datos-progress span");

    cantidad.textContent = `${xpHoy} / ${META_DIARIA} XP`;
    indicador.textContent = `${porcentaje}%`;

    barra.max = META_DIARIA;
    barra.value = Math.min(xpHoy, META_DIARIA);
    barra.textContent = `${porcentaje}%`;

    if (xpHoy >= META_DIARIA) {
        mensaje.textContent = "¡Felicitaciones! Alcanzaste tu meta diaria.";
    } else {
        mensaje.textContent = `Te faltan ${META_DIARIA - xpHoy} XP para alcanzar tu meta diaria.`;
    }
}


function calcularLogros(usuario) {
    const logros = [];
    const racha = obtenerRachaActual(usuario);
    const lecciones = contarLecciones(usuario);
    const examenes = contarExamenes(usuario);
    const xp = Number(usuario.xp) || 0;

    if (racha >= 1) {
        logros.push({
            titulo: "Racha encendida",
            descripcion: `${racha} ${racha === 1 ? "día" : "días"} seguidos estudiando`,
            icono: "calendar-days-svgrepo-com.svg"
        });
    }

    if (lecciones >= 1) {
        logros.push({
            titulo: "Primeros pasos",
            descripcion: `${lecciones} ${lecciones === 1 ? "lección completada" : "lecciones completadas"}`,
            icono: "audio-svgrepo-com.svg"
        });
    }

    if (examenes >= 1) {
        logros.push({
            titulo: "Examen superado",
            descripcion: `${examenes} ${examenes === 1 ? "examen aprobado" : "exámenes aprobados"}`,
            icono: "medal-reward-svgrepo-com.svg"
        });
    }

    if (xp >= 100) {
        logros.push({
            titulo: "Cien de experiencia",
            descripcion: `Ya sumaste ${xp} XP`,
            icono: "dictionary-2-svgrepo-com.svg"
        });
    }

    return logros;
}

function mostrarLogros(usuario) {
    const contenedor = document.getElementById("lista-logros");

    if (!contenedor) {
        return;
    }

    contenedor.replaceChildren();

    const logros = calcularLogros(usuario);

    if (logros.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "sin-logros";
        aviso.textContent = "Completá tu primera lección para empezar a ganar logros.";
        contenedor.append(aviso);
        return;
    }

    logros.forEach((logro) => {
        const tarjeta = document.createElement("article");
        const icono = document.createElement("img");
        const texto = document.createElement("div");
        const titulo = document.createElement("h4");
        const descripcion = document.createElement("p");

        tarjeta.className = "card-logros";
        icono.className = "img-icon-logros";
        icono.src = `../../images/icons-general/${logro.icono}`;
        icono.alt = "";

        titulo.textContent = logro.titulo;
        descripcion.textContent = logro.descripcion;

        texto.append(titulo, descripcion);
        tarjeta.append(icono, texto);
        contenedor.append(tarjeta);
    });
}

export function mostrarResumenHome(usuario) {
    if (!usuario) {
        return;
    }

    mostrarEstadisticas(usuario);
    mostrarMetaDiaria(usuario);
    mostrarLogros(usuario);
}
