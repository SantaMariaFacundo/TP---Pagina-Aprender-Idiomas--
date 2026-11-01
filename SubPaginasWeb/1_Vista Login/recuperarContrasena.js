
console.log("Recuperación de contraseña conectada correctamente");

const formularioRecuperacion = document.getElementById("formulario-recuperacion");
const campoRecuperacion = document.getElementById("correo-recuperacion");
const mensajeRecuperacion = document.getElementById("mensaje-recuperacion");

formularioRecuperacion.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const correo = campoRecuperacion.value.trim().toLowerCase();

    mensajeRecuperacion.textContent = "";

    if (correo === "") {

        mensajeRecuperacion.textContent =
            "Ingresá tu correo electrónico.";

        mensajeRecuperacion.style.color = "#c0392b";

        return;
    }

    const usuarios = obtenerUsuarios();

    const cuentaEncontrada = usuarios.some(function(usuario) {

        return usuario.correo.toLowerCase() === correo;

    });

    if (!cuentaEncontrada) {

        mensajeRecuperacion.textContent =
            "No encontramos una cuenta registrada con ese correo.";

        mensajeRecuperacion.style.color = "#c0392b";

        return;
    }

    mensajeRecuperacion.textContent =
        "Encontramos tu cuenta. La recuperación se completó como simulación: no se envió ningún correo y tu contraseña sigue siendo la misma.";

    mensajeRecuperacion.style.color = "#2A9C8D";

    campoRecuperacion.value = "";

});
