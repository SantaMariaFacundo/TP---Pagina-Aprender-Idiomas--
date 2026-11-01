// Importamos los módulos compartidos necesarios para esta página.
import "../../js/header.js";
import "../../js/buscador.js";
import "../../js/traductor.js";

// Importamos las funciones de usuarios utilizadas en esta vista.
import { obtenerUsuarios, obtenerUsuarioActivo } from "../../js/usuarios.js";


(function () {

    // Elementos del HTML.
    const selectorLiga = document.getElementById("liga");
    const tituloLiga = document.getElementById("titulo-liga-actual");
    const descripcionLiga = document.getElementById("descripcion-liga");
    const tabla = document.getElementById("tabla-clasificacion");

    const puestoActual = document.getElementById("puesto-actual");
    const xpSemana = document.getElementById("xp-semana");
    const xpPrimerPuesto = document.getElementById("xp-primer-puesto");

    // Verificar que el HTML tenga los elementos necesarios.
    if (
        !selectorLiga ||
        !tituloLiga ||
        !descripcionLiga ||
        !tabla ||
        !puestoActual ||
        !xpSemana ||
        !xpPrimerPuesto
    ) {
        console.error("Faltan elementos de la vista Clasificación.");
        return;
    }

    // Las funciones de usuarios vienen de js/usuarios.js.
    if (
        typeof obtenerUsuarioActivo !== "function" ||
        typeof obtenerUsuarios !== "function"
    ) {
        console.error("Debe cargarse usuarios.js antes de clasificacion.js.");
        return;
    }

    // Información de las ligas.
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

    // Crear una celda de la tabla.
    function crearCelda(fila, texto) {
        const celda = document.createElement("td");
        celda.textContent = texto;
        fila.appendChild(celda);
        return celda;
    }

    // Obtener las iniciales del usuario.
    function obtenerIniciales(nombre) {
        return String(nombre || "")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(palabra => palabra.charAt(0))
            .join("")
            .toUpperCase();
    }

    // Obtener los XP semanales.
    function obtenerXpSemanal(usuario) {
        return Math.max(0, Number(usuario.xpSemanal) || 0);
    }

    // Mostrar un número en el resumen.
    function mostrarNumero(elemento, numero) {
        elemento.textContent = numero.toLocaleString("es-AR");
    }

    // Mostrar la posición del usuario activo.
    function mostrarResumen(usuariosLiga, usuarioActivo, ligaSeleccionada) {

        const misXp = obtenerXpSemanal(usuarioActivo);

        mostrarNumero(xpSemana, misXp);

        const posicion = usuariosLiga.findIndex(
            usuario => usuario.id === usuarioActivo.id
        );

        // Si estamos consultando otra liga, no tenemos puesto allí.
        if (
            ligaSeleccionada !== (usuarioActivo.liga || "bronce") ||
            posicion === -1
        ) {
            puestoActual.textContent = "—";
            xpPrimerPuesto.textContent = "—";
            return;
        }

        // Mostrar nuestra posición.
        mostrarNumero(puestoActual, posicion + 1);

        // XP necesarios para superar al primer puesto.
        const xpLider = obtenerXpSemanal(usuariosLiga[0]);

        const diferencia = posicion === 0
            ? 0
            : xpLider - misXp + 1;

        mostrarNumero(xpPrimerPuesto, diferencia);
    }

    // Mostrar la clasificación de la liga seleccionada.
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

        // Actualizar encabezado.
        tituloLiga.textContent = informacion.nombre;
        descripcionLiga.textContent = informacion.descripcion;

        // Obtener los usuarios de la liga seleccionada.
        const usuariosLiga = obtenerUsuarios()
            .filter(function(usuario) {
                return (usuario.liga || "bronce") === ligaSeleccionada;
            })
            .sort(function(a, b) {

                const diferencia =
                    obtenerXpSemanal(b) - obtenerXpSemanal(a);

                if (diferencia !== 0) {
                    return diferencia;
                }

                // Desempatar alfabéticamente.
                return String(a.usuario || "").localeCompare(
                    String(b.usuario || ""),
                    "es"
                );
            });

        // Limpiar la tabla.
        tabla.replaceChildren();

        if (usuariosLiga.length === 0) {

            const fila = document.createElement("tr");

            const celda = crearCelda(
                fila,
                "Todavía no hay usuarios en esta liga."
            );

            celda.colSpan = 5;

            tabla.appendChild(fila);
        }

        // Crear una fila por cada usuario.
        usuariosLiga.forEach(function(usuario, indice) {

            const fila = document.createElement("tr");
            const posicion = indice + 1;

            // Destacar la cuenta activa.
            if (usuario.id === usuarioActivo.id) {
                fila.classList.add("usuario-actual");
            }

            // Puesto.
            crearCelda(fila, posicion);

            // Avatar.
            const celdaAvatar = document.createElement("td");
            const avatar = document.createElement("div");

            avatar.className = "avatar-ranking";
            avatar.textContent = obtenerIniciales(usuario.nombre);

            celdaAvatar.appendChild(avatar);
            fila.appendChild(celdaAvatar);

            // Nombre de usuario.
            crearCelda(
                fila,
                usuario.usuario || usuario.nombre || "Usuario"
            );

            // XP semanales.
            const xp = obtenerXpSemanal(usuario);

            crearCelda(
                fila,
                xp.toLocaleString("es-AR")
            );

            // Estado en la liga.
            let estado = "Participando";

            if (
                informacion.puestosAscenso > 0 &&
                posicion <= informacion.puestosAscenso
            ) {
                estado = "Zona de ascenso";
            }

            crearCelda(fila, estado);

            tabla.appendChild(fila);
        });

        // Actualizar resumen personal.
        mostrarResumen(
            usuariosLiga,
            usuarioActivo,
            ligaSeleccionada
        );
    }

    // Comprobar si hay una sesión activa.
    const usuarioActivo = obtenerUsuarioActivo();

    if (!usuarioActivo) {

        window.location.replace("../1_Vista Login/login.html");

    } else {

        // Seleccionar inicialmente la liga propia.
        selectorLiga.value = ligas[usuarioActivo.liga]
            ? usuarioActivo.liga
            : "bronce";

        // Evitar recargas innecesarias del formulario.
        const formularioLiga = document.querySelector(".selector-liga");

        if (formularioLiga) {
            formularioLiga.addEventListener("submit", function(evento) {
                evento.preventDefault();
            });
        }

        // Cambiar la liga mostrada.
        selectorLiga.addEventListener(
            "change",
            mostrarClasificacion
        );

        // Cargar la tabla inicial.
        mostrarClasificacion();
    }

})();
