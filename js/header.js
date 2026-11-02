// Importamos las funciones compartidas para consultar y cerrar la sesión.
import { obtenerUsuarioActivo, cerrarSesion } from "./usuarios.js";

// import.meta.url reemplaza a document.currentScript en los módulos.
const rutaLogin = new URL(
    "../SubPaginasWeb/1_Vista Login/login.html",
    import.meta.url
);

const menuUsuario = document.querySelector(".menu-usuario");
const botonCerrarSesion = document.getElementById("btn-cerrar-sesion");
const usuarioActivo = obtenerUsuarioActivo();

// Impedimos entrar a una vista privada cuando no hay sesión.
if (!usuarioActivo) {
    window.location.replace(rutaLogin.href);
} else {
    // Mostramos las opciones de la cuenta al usuario identificado.
    if (menuUsuario) {
        menuUsuario.style.display = "block";
    }

    // Asociamos el cierre de sesión con el botón del encabezado.
    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener("click", function(event) {
            event.preventDefault();
            cerrarSesion();
            window.location.replace(rutaLogin.href);
        });
    }
}
