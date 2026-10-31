
console.log("Clasificación conectada correctamente");

const selectorLiga = document.getElementById("liga");
const tituloLiga = document.getElementById("titulo-liga-actual");
const descripcionLiga = document.getElementById("descripcion-liga");
const tabla = document.getElementById("tabla-clasificacion");

const puestoActual = document.getElementById("puesto-actual");
const xpSemana = document.getElementById("xp-semana");
const xpPrimerPuesto = document.getElementById("xp-primer-puesto");

const CLAVE_PERFIL = "grammatech_perfil_demo";
const CLAVE_RANKING = "grammatech_ranking_demo";

// Información de las ligas
const ligas = {
    bronce: {
        nombre: "LIGA BRONCE",
        descripcion: "Los 5 primeros ascienden a la Liga de Plata esta semana.",
        puestosAscenso: 5
    },
    plata: {
        nombre: "LIGA PLATA",
        descripcion: "Los 3 primeros ascienden a la Liga de Oro esta semana.",
        puestosAscenso: 3
    },
    oro: {
        nombre: "LIGA ORO",
        descripcion: "Competí por los primeros puestos de la clasificación.",
        puestosAscenso: 0
    }
};

// Participantes de demostración
const participantesIniciales = [
    { id: "mel", usuario: "@MelG_29", xp: 850, liga: "bronce" },
    { id: "juan-demo", usuario: "@juanperez_web", xp: 720, liga: "bronce" },
    { id: "carlos", usuario: "@Carlos_Dev", xp: 610, liga: "bronce" },
    { id: "mai", usuario: "@MaiCoder", xp: 570, liga: "bronce" },
    { id: "facu", usuario: "@FacuWeb", xp: 520, liga: "bronce" },
    { id: "agus", usuario: "@AgusDev", xp: 480, liga: "bronce" },

    { id: "lucia", usuario: "@LuciaCode", xp: 1250, liga: "plata" },
    { id: "tomas", usuario: "@TomiWeb", xp: 1100, liga: "plata" },
    { id: "sofia", usuario: "@SofiDev", xp: 980, liga: "plata" },
    { id: "nico", usuario: "@NicoJS", xp: 860, liga: "plata" },

    { id: "ana", usuario: "@AnaTech", xp: 2100, liga: "oro" },
    { id: "fede", usuario: "@FedeCode", xp: 1900, liga: "oro" },
    { id: "valen", usuario: "@ValenDev", xp: 1700, liga: "oro" }
];

// Recuperar participantes
function obtenerParticipantes() {
    try {
        const datos = localStorage.getItem(CLAVE_RANKING);

        if (datos !== null) {
            const guardados = JSON.parse(datos);

            if (Array.isArray(guardados)) {
                return guardados;
            }
        }
    } catch (error) {
        console.error("Error al recuperar ranking:", error);
    }

    return participantesIniciales.map(participante => ({
        ...participante
    }));
}

// Recuperar el usuario de demostración
function obtenerUsuarioActual() {
    let usuario = "@juanperez_web";

    try {
        const datos = localStorage.getItem(CLAVE_PERFIL);

        if (datos !== null) {
            const perfil = JSON.parse(datos);

            if (perfil && perfil.usuario) {
                usuario = perfil.usuario;
            }
        }
    } catch (error) {
        console.error("Error al recuperar usuario:", error);
    }

    return {
        id: "juan-demo",
        usuario: usuario
    };
}

// Obtener iniciales
function obtenerIniciales(usuario) {
    const nombre = usuario.replace("@", "");

    return nombre.substring(0, 2).toUpperCase();
}

// Crear una celda
function crearCelda(texto) {
    const celda = document.createElement("td");

    celda.textContent = texto;

    return celda;
}

// Crear una fila del ranking
function crearFila(participante, posicion, usuarioActual, liga) {
    const fila = document.createElement("tr");

    // Resaltar usuario actual
    if (participante.id === usuarioActual.id) {
        fila.classList.add("usuario-actual");
        fila.setAttribute("aria-current", "true");
    }

    // Puesto
    fila.appendChild(crearCelda(posicion));

    // Avatar
    const celdaAvatar = document.createElement("td");
    const avatar = document.createElement("span");

    avatar.classList.add("avatar-ranking");
    avatar.textContent = obtenerIniciales(participante.usuario);

    celdaAvatar.appendChild(avatar);
    fila.appendChild(celdaAvatar);

    // Nombre de usuario
    fila.appendChild(crearCelda(participante.usuario));

    // Experiencia semanal
    const celdaXp = document.createElement("td");
    const datoXp = document.createElement("data");

    datoXp.value = participante.xp;
    datoXp.textContent = `${participante.xp.toLocaleString("es-AR")} XP`;

    celdaXp.appendChild(datoXp);
    fila.appendChild(celdaXp);

    // Estado según posición y liga
    let estado = "Permanece";

    if (liga !== "oro" && posicion <= ligas[liga].puestosAscenso) {
        estado = "Asciende";
    }

    if (liga === "oro" && posicion === 1) {
        estado = "Primer puesto";
    }

    fila.appendChild(crearCelda(estado));

    return fila;
}

// Actualizar tarjetas del resumen
function actualizarResumen(participantes, usuarioActual) {
    const indice = participantes.findIndex(
        participante => participante.id === usuarioActual.id
    );

    if (indice === -1) {
        puestoActual.textContent = "—";
        xpSemana.textContent = "—";
        xpPrimerPuesto.textContent = "—";

        puestoActual.value = 0;
        xpSemana.value = 0;
        xpPrimerPuesto.value = 0;

        return;
    }

    const posicion = indice + 1;
    const experiencia = participantes[indice].xp;
    const primero = participantes[0].xp;

    const diferencia = posicion === 1
        ? 0
        : primero - experiencia + 1;

    puestoActual.textContent = `#${posicion}`;
    xpSemana.textContent = experiencia.toLocaleString("es-AR");
    xpPrimerPuesto.textContent = diferencia.toLocaleString("es-AR");

    puestoActual.value = posicion;
    xpSemana.value = experiencia;
    xpPrimerPuesto.value = diferencia;
}

// Mostrar la clasificación seleccionada
function mostrarClasificacion() {
    const ligaSeleccionada = selectorLiga.value;
    const informacion = ligas[ligaSeleccionada];

    if (!informacion) {
        return;
    }

    // Actualizar título y descripción
    tituloLiga.textContent = informacion.nombre;
    descripcionLiga.textContent = informacion.descripcion;

    const usuarioActual = obtenerUsuarioActual();
    const participantes = obtenerParticipantes();

    // Reflejar nombre actualizado desde Perfil
    const participanteActual = participantes.find(
        participante => participante.id === usuarioActual.id
    );

    if (participanteActual) {
        participanteActual.usuario = usuarioActual.usuario;
    }

    // Filtrar y ordenar según XP semanal
    const participantesLiga = participantes
        .filter(participante => participante.liga === ligaSeleccionada)
        .sort((a, b) => b.xp - a.xp);

    // Eliminar las filas anteriores
    tabla.replaceChildren();

    // Si no hay participantes
    if (participantesLiga.length === 0) {
        const fila = document.createElement("tr");
        const celda = crearCelda(
            "Todavía no hay participantes en esta liga."
        );

        celda.colSpan = 5;

        fila.appendChild(celda);
        tabla.appendChild(fila);

        actualizarResumen(participantesLiga, usuarioActual);
        return;
    }

    // Crear las nuevas filas
    participantesLiga.forEach(function(participante, indice) {
        const fila = crearFila(
            participante,
            indice + 1,
            usuarioActual,
            ligaSeleccionada
        );

        tabla.appendChild(fila);
    });

    // Actualizar las tarjetas inferiores
    actualizarResumen(participantesLiga, usuarioActual);
}

// Evitar que el formulario del selector navegue
document.querySelector(".selector-liga").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();
    }
);

// Detectar cambio de liga
selectorLiga.addEventListener("change", mostrarClasificacion);

// Mostrar clasificación inicial
mostrarClasificacion();
