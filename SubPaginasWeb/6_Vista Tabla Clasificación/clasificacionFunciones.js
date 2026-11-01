
console.log("Clasificación conectada correctamente");

// Elementos del HTML
const selectorLiga = document.getElementById("liga");
const tituloLiga = document.getElementById("titulo-liga-actual");
const descripcionLiga = document.getElementById("descripcion-liga");
const tabla = document.getElementById("tabla-clasificacion");

const puestoActual = document.getElementById("puesto-actual");
const xpSemana = document.getElementById("xp-semana");
const xpPrimerPuesto = document.getElementById("xp-primer-puesto");

// Información de cada liga
const ligas = {
    bronce: {
        nombre: "LIGA BRONCE",
        descripcion: "Los 5 primeros están en zona de ascenso a Plata.",
        puestosAscenso: 5
    },
    plata: {
        nombre: "LIGA PLATA",
        descripcion: "Los 3 primeros están en zona de ascenso a Oro.",
        puestosAscenso: 3
    },
    oro: {
        nombre: "LIGA ORO",
        descripcion: "Competí por los primeros puestos.",
        puestosAscenso: 0
    }
};

// Crear una celda de la tabla
function crearCelda(fila, texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    fila.appendChild(celda);
    return celda;
}

// Obtener las iniciales del usuario
function obtenerIniciales(nombre) {
    return String(nombre || "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(palabra => palabra.charAt(0))
        .join("")
        .toUpperCase();
}

// Obtener XP semanales
function obtenerXpSemanal(usuario) {
    return Math.max(0, Number(usuario.xpSemanal) || 0);
}

// Actualizar los números del resumen
function mostrarNumero(elemento, numero) {
    elemento.value = numero;
    elemento.textContent = numero.toLocaleString("es-AR");
}

// Mostrar la posición del usuario
function mostrarResumen(usuariosLiga, usuarioActivo, ligaSeleccionada) {

    const misXp = obtenerXpSemanal(usuarioActivo);

    mostrarNumero(xpSemana, misXp);

    // Buscar nuestra posición en la tabla
    const posicion = usuariosLiga.findIndex(
        usuario => usuario.id === usuarioActivo.id
    );

    // Si estamos viendo otra liga, no tenemos puesto allí
    if (ligaSeleccionada !== (usuarioActivo.liga || "bronce") ||
        posicion === -1) {

        puestoActual.textContent = "—";
        puestoActual.value = 0;

        xpPrimerPuesto.textContent = "—";
        xpPrimerPuesto.value = 0;

        return;
    }

    mostrarNumero(puestoActual, posicion + 1);

    // Calcular los XP necesarios para superar al primero
    const xpLider = obtenerXpSemanal(usuariosLiga[0]);

    const diferencia = posicion === 0
        ? 0
        : xpLider - misXp + 1;

    mostrarNumero(xpPrimerPuesto, diferencia);
}

// Mostrar la clasificación seleccionada
function mostrarClasificacion() {

    const usuarioActivo = obtenerUsuarioActivo();

    if (!usuarioActivo) {
        window.location.replace("../1_Vista Login/login.html");
        return;
    }

    const ligaSeleccionada = selectorLiga.value;
    const informacion = ligas[ligaSeleccionada];

    if (!informacion) {
        return;
    }

    // Mostrar el título y la descripción
    tituloLiga.textContent = informacion.nombre;
    descripcionLiga.textContent = informacion.descripcion;

    // Recuperar usuarios reales desde usuarios.js
    const usuariosLiga = obtenerUsuarios()
        .filter(usuario => (usuario.liga || "bronce") === ligaSeleccionada)
        .sort((a, b) => {
            const diferencia = obtenerXpSemanal(b) - obtenerXpSemanal(a);

            if (diferencia !== 0) {
                return diferencia;
            }

            return String(a.usuario || "").localeCompare(
                String(b.usuario || ""), "es"
            );
        });

    // Limpiar la tabla anterior
    tabla.replaceChildren();

    // Mostrar un mensaje cuando no hay usuarios
    if (usuariosLiga.length === 0) {

        const fila = document.createElement("tr");
        const celda = crearCelda(
            fila,
            "Todavía no hay usuarios en esta liga."
        );

        celda.colSpan = 5;
        tabla.appendChild(fila);

    }

    // Crear una fila por cada usuario registrado
    usuariosLiga.forEach(function(usuario, indice) {

        const fila = document.createElement("tr");
        const posicion = indice + 1;

        // Resaltar la cuenta que inició sesión
        if (usuario.id === usuarioActivo.id) {
            fila.classList.add("usuario-actual");
        }

        // Puesto
        crearCelda(fila, posicion);

        // Avatar con iniciales
        const celdaAvatar = document.createElement("td");
        const avatar = document.createElement("div");

        avatar.className = "avatar-ranking";
        avatar.textContent = obtenerIniciales(usuario.nombre);

        celdaAvatar.appendChild(avatar);
        fila.appendChild(celdaAvatar);

        // Nombre de usuario
        crearCelda(fila, usuario.usuario || usuario.nombre || "Usuario");

        // Experiencia semanal
        const xp = obtenerXpSemanal(usuario);
        crearCelda(fila, xp.toLocaleString("es-AR"));

        // Estado en la clasificación
        let estado = "Participando";

        if (informacion.puestosAscenso > 0 &&
            posicion <= informacion.puestosAscenso) {

            estado = "Zona de ascenso";
        }

        crearCelda(fila, estado);

        tabla.appendChild(fila);
    });

    // Actualizar la posición personal
    mostrarResumen(usuariosLiga, usuarioActivo, ligaSeleccionada);
}

// Seleccionar inicialmente la liga del usuario
const usuarioActivo = obtenerUsuarioActivo();

if (!usuarioActivo) {

    window.location.replace("../1_Vista Login/login.html");

} else {

    selectorLiga.value = ligas[usuarioActivo.liga]
        ? usuarioActivo.liga
        : "bronce";

    // Evitar que el formulario recargue la página
    document.querySelector(".selector-liga").addEventListener(
        "submit",
        function(evento) {
            evento.preventDefault();
        }
    );

    // Cambiar de liga
    selectorLiga.addEventListener("change", mostrarClasificacion);

    // Mostrar la tabla al entrar
    mostrarClasificacion();
}
