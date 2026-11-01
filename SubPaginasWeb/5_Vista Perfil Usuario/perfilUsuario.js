// Importamos los módulos compartidos necesarios para esta página.
import "../../js/header.js";
import "../../js/buscador.js";
import "../../js/traductor.js";

// Importamos las funciones de usuarios utilizadas en esta vista.
import { obtenerUsuarioActivo } from "../../js/usuarios.js";


const tituloNombre = document.getElementById("titulo-nombre-usuario");
const nombreUsuario = document.querySelector(".nombre-usuario");
const avatar = document.querySelector(".avatar");

const correoVisible = document.querySelector(
    ".informacion-usuario p:not(.nombre-usuario)"
);

const datosCuenta = document.querySelectorAll(".datos-cuenta p");
const fechaRegistro = document.querySelector(".datos-cuenta time");

const tituloLiga = document.getElementById("titulo-logro-liga");
const tituloRacha = document.getElementById("titulo-logro-racha");
const tituloXp = document.getElementById("titulo-logro-xp");

const usuarioActivo = obtenerUsuarioActivo();

if (!usuarioActivo) {

    window.location.replace("../1_Vista Login/login.html");

} else {

    // Cambiar textos sin eliminar los botones Editar.
    function actualizarTexto(contenedor, texto) {

        if (!contenedor) {
            return;
        }

        const nodo = Array.from(contenedor.childNodes).find(
            n => n.nodeType === Node.TEXT_NODE &&
                n.textContent.trim() !== ""
        );

        if (nodo) {
            nodo.textContent = " " + texto + " ";
        }

    }

    // Mostrar los datos de la cuenta.
    tituloNombre.textContent = usuarioActivo.nombre;
    nombreUsuario.textContent = usuarioActivo.usuario;

    actualizarTexto(correoVisible, usuarioActivo.correo);
    actualizarTexto(datosCuenta[0], usuarioActivo.nombre);
    actualizarTexto(datosCuenta[1], usuarioActivo.usuario);

    // Iniciales para el avatar.
    avatar.textContent = usuarioActivo.nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(palabra => palabra.charAt(0))
        .join("")
        .toUpperCase();

    // Fecha de incorporación.
    if (fechaRegistro && usuarioActivo.fechaRegistro) {

        const fecha = new Date(usuarioActivo.fechaRegistro);

        if (!Number.isNaN(fecha.getTime())) {

            fechaRegistro.dateTime = fecha.toISOString().slice(0, 10);

            fechaRegistro.textContent = fecha.toLocaleDateString(
                "es-AR",
                {
                    month: "long",
                    year: "numeric"
                }
            );

        }

    }

    // Liga actual.
    const liga = usuarioActivo.liga || "bronce";

    tituloLiga.textContent =
        "Liga " +
        liga.charAt(0).toUpperCase() +
        liga.slice(1);

    // Racha.
    const dias = Number(usuarioActivo.racha) || 0;

    tituloRacha.textContent =
        "Racha de " +
        dias +
        (dias === 1 ? " día" : " días");

    // Experiencia.
    const xp = Number(usuarioActivo.xp) || 0;

    tituloXp.textContent =
        xp.toLocaleString("es-AR") + " XP";

}
