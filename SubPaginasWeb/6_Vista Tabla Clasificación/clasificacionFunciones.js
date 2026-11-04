import "../../js/header.js";
import "../../js/buscador.js";
import { obtenerUsuarios, obtenerUsuarioActivo } from "../../js/usuarios.js";


(function () {

    const selectorLiga = document.getElementById("liga");
    const tituloLiga = document.getElementById("titulo-liga-actual");
    const descripcionLiga = document.getElementById("descripcion-liga");
    const tabla = document.getElementById("tabla-clasificacion");

    const puestoActual = document.getElementById("puesto-actual");
    const xpSemana = document.getElementById("xp-semana");
    const xpPrimerPuesto = document.getElementById("xp-primer-puesto");

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

    if (
        typeof obtenerUsuarioActivo !== "function" ||
        typeof obtenerUsuarios !== "function"
    ) {
        console.error("Debe cargarse usuarios.js antes de clasificacion.js.");
        return;
    }

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

    function crearCelda(fila, texto) {
        const celda = document.createElement("td");
        celda.textContent = texto;
        fila.appendChild(celda);
        return celda;
    }

    function obtenerIniciales(nombre) {
        return String(nombre || "")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(palabra => palabra.charAt(0))
            .join("")
            .toUpperCase();
    }

    function obtenerXpSemanal(usuario) {
        return Math.max(0, Number(usuario.xpSemanal) || 0);
    }

    function mostrarNumero(elemento, numero) {
        elemento.textContent = numero.toLocaleString("es-AR");
    }

    function mostrarResumen(usuariosLiga, usuarioActivo, ligaSeleccionada) {

        const misXp = obtenerXpSemanal(usuarioActivo);

        mostrarNumero(xpSemana, misXp);

        const posicion = usuariosLiga.findIndex(
            usuario => usuario.id === usuarioActivo.id
        );

        if (
            ligaSeleccionada !== (usuarioActivo.liga || "bronce") ||
            posicion === -1
        ) {
            puestoActual.textContent = "—";
            xpPrimerPuesto.textContent = "—";
            return;
        }

        mostrarNumero(puestoActual, posicion + 1);

        const xpLider = obtenerXpSemanal(usuariosLiga[0]);

        const diferencia = posicion === 0
            ? 0
            : xpLider - misXp + 1;

        mostrarNumero(xpPrimerPuesto, diferencia);
    }

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

        tituloLiga.textContent = informacion.nombre;
        descripcionLiga.textContent = informacion.descripcion;

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

                return String(a.usuario || "").localeCompare(
                    String(b.usuario || ""),
                    "es"
                );
            });

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

        usuariosLiga.forEach(function(usuario, indice) {

            const fila = document.createElement("tr");
            const posicion = indice + 1;

            if (usuario.id === usuarioActivo.id) {
                fila.classList.add("usuario-actual");
            }

            crearCelda(fila, posicion);

            const celdaAvatar = document.createElement("td");
            const avatar = document.createElement("div");

            avatar.className = "avatar-ranking";
            avatar.textContent = obtenerIniciales(usuario.nombre);

            celdaAvatar.appendChild(avatar);
            fila.appendChild(celdaAvatar);

            crearCelda(
                fila,
                usuario.usuario || usuario.nombre || "Usuario"
            );

            const xp = obtenerXpSemanal(usuario);

            crearCelda(
                fila,
                xp.toLocaleString("es-AR")
            );

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

        mostrarResumen(
            usuariosLiga,
            usuarioActivo,
            ligaSeleccionada
        );
    }

    const usuarioActivo = obtenerUsuarioActivo();

    if (!usuarioActivo) {

        window.location.replace("../1_Vista Login/login.html");

    } else {

        selectorLiga.value = ligas[usuarioActivo.liga]
            ? usuarioActivo.liga
            : "bronce";

        const formularioLiga = document.querySelector(".selector-liga");

        if (formularioLiga) {
            formularioLiga.addEventListener("submit", function(evento) {
                evento.preventDefault();
            });
        }

        selectorLiga.addEventListener(
            "change",
            mostrarClasificacion
        );

        mostrarClasificacion();
    }

})();
