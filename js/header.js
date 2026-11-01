
const rutaHeaderSesion = document.currentScript.src;

document.addEventListener("DOMContentLoaded", function() {

    const menuUsuario = document.querySelector(".menu-usuario");
    const botonCerrarSesion = document.getElementById("btn-cerrar-sesion");

    // Obtener el usuario que inició sesión
    const usuarioActivo = obtenerUsuarioActivo();

    // Construir la ruta al Login
    const rutaLogin = new URL(
        "../SubPaginasWeb/1_Vista Login/login.html",
        rutaHeaderSesion
    );

    // Impedir el acceso a las páginas privadas sin sesión
    if (!usuarioActivo) {
        window.location.replace(rutaLogin.href);
        return;
    }

    // Mostrar el menú del usuario
    if (menuUsuario) {
        menuUsuario.style.display = "block";
    }

    // Cerrar sesión cuando se presiona la opción
    if (botonCerrarSesion) {

        botonCerrarSesion.addEventListener("click", function(event) {

            event.preventDefault();

            cerrarSesion();

            window.location.replace(rutaLogin.href);

        });

    }

});
