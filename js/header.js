import { obtenerUsuarioActivo, cerrarSesion } from "./usuarios.js";


const rutaInicio = new URL(
    "../index.html",
    import.meta.url
);

const menuUsuario = document.querySelector(".menu-usuario");
const botonCerrarSesion = document.getElementById("btn-cerrar-sesion");
const usuarioActivo = obtenerUsuarioActivo();


if (!usuarioActivo) {
    window.location.replace(new URL("../SubPaginasWeb/1_Vista Login/login.html", import.meta.url).href);
} else {
   
    if (menuUsuario) {
        menuUsuario.style.display = "block";
    }

    
    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener("click", function(event) {
            event.preventDefault();
            cerrarSesion();
            window.location.replace(rutaInicio.href);
        });
    }
}
