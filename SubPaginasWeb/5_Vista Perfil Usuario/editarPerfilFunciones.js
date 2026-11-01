
console.log("Editar perfil conectado correctamente");

// Obtener los elementos del formulario.
const formularioEditar = document.querySelector(".formulario-perfil");

const campoNombre = document.getElementById("nombre-completo");
const campoUsuario = document.getElementById("nombre-usuario");
const campoCorreo = document.getElementById("email");
const campoIdioma = document.getElementById("idioma-interfaz");

const campoActual = document.getElementById("password-actual");
const campoNueva = document.getElementById("password-nueva");
const campoConfirmar = document.getElementById("password-confirmar");

// Obtener el usuario que inició sesión.
let usuarioEditar = obtenerUsuarioActivo();

if (!usuarioEditar) {

    window.location.replace("../1_Vista Login/login.html");

} else {

    // Cargar los datos actuales.
    campoNombre.value = usuarioEditar.nombre;
    campoUsuario.value = usuarioEditar.usuario;
    campoCorreo.value = usuarioEditar.correo;
    campoIdioma.value = usuarioEditar.idioma || "espanol";

    // Mostrar la fecha de registro.
    const fechaRegistro = document.getElementById("fecha-registro");

    if (fechaRegistro && usuarioEditar.fechaRegistro) {

        const fecha = new Date(usuarioEditar.fechaRegistro);

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

    // Crear el mensaje de confirmación debajo del formulario.
    const mensaje = document.createElement("p");

    mensaje.setAttribute("role", "status");
    mensaje.style.textAlign = "center";
    mensaje.style.marginTop = "1rem";
    mensaje.style.fontWeight = "bold";

    formularioEditar.appendChild(mensaje);

    function mostrarMensaje(texto, correcto = false) {

        mensaje.textContent = texto;
        mensaje.style.color = correcto ? "#2A9C8D" : "#c0392b";

    }

    // Evitar utilizar la antigua pantalla de confirmación.
    formularioEditar.removeAttribute("action");

    // Detectar cuando se presiona Guardar cambios.
    formularioEditar.addEventListener("submit", function(evento) {

        evento.preventDefault();

        // Limpiar el mensaje anterior.
        mostrarMensaje("");

        // Obtener los datos ingresados.
        const nombre = campoNombre.value.trim();
        const usuario = campoUsuario.value.trim();
        const correo = campoCorreo.value.trim().toLowerCase();
        const idioma = campoIdioma.value;

        const actual = campoActual.value;
        const nueva = campoNueva.value;
        const confirmar = campoConfirmar.value;

        // Validar el nombre.
        if (nombre.length < 3) {
            mostrarMensaje("El nombre debe tener al menos 3 caracteres.");
            return;
        }

        // Validar el usuario.
        const usuarioValido = /^@?[a-zA-Z0-9_.]{3,20}$/;

        if (!usuarioValido.test(usuario)) {
            mostrarMensaje(
                "El usuario debe tener entre 3 y 20 caracteres, sin espacios."
            );
            return;
        }

        // Validar el correo.
        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!correoValido.test(correo)) {
            mostrarMensaje("Ingresá un correo electrónico válido.");
            return;
        }

        // Obtener las cuentas registradas.
        const usuarios = obtenerUsuarios();

        // Comprobar que el usuario no esté ocupado.
        const usuarioRepetido = usuarios.some(function(registrado) {

            return registrado.id !== usuarioEditar.id &&
                registrado.usuario.toLowerCase() === usuario.toLowerCase();

        });

        if (usuarioRepetido) {
            mostrarMensaje("Ese nombre de usuario ya está registrado.");
            return;
        }

        // Comprobar que el correo no esté ocupado.
        const correoRepetido = usuarios.some(function(registrado) {

            return registrado.id !== usuarioEditar.id &&
                registrado.correo.toLowerCase() === correo;

        });

        if (correoRepetido) {
            mostrarMensaje("Ese correo electrónico ya está registrado.");
            return;
        }

        // Comprobar si hay modificaciones.
        const modificoDatos =
            nombre !== usuarioEditar.nombre ||
            usuario !== usuarioEditar.usuario ||
            correo !== usuarioEditar.correo ||
            idioma !== (usuarioEditar.idioma || "espanol");

        const intentaCambiarContrasena =
            actual !== "" ||
            nueva !== "" ||
            confirmar !== "";

        if (!modificoDatos && !intentaCambiarContrasena) {
            mostrarMensaje("No realizaste ningún cambio en tu perfil.");
            return;
        }

        // Preparar los cambios.
        const cambios = {
            nombre: nombre,
            usuario: usuario,
            correo: correo,
            idioma: idioma
        };

        // Validar la contraseña solamente si se desea cambiar.
        if (intentaCambiarContrasena) {

            if (actual !== usuarioEditar.contrasena) {
                mostrarMensaje("La contraseña actual es incorrecta.");
                return;
            }

            const contrasenaValida =
                nueva.length >= 10 &&
                /[A-Z]/.test(nueva) &&
                /[a-z]/.test(nueva) &&
                /[0-9]/.test(nueva);

            if (!contrasenaValida) {

                mostrarMensaje(
                    "La nueva contraseña debe tener al menos 10 caracteres, una mayúscula, una minúscula y un número."
                );

                return;

            }

            if (nueva !== confirmar) {
                mostrarMensaje("Las contraseñas nuevas no coinciden.");
                return;
            }

            cambios.contrasena = nueva;

        }

        // Guardar los datos del usuario.
        try {

            const guardado = actualizarUsuario(cambios);

            if (!guardado) {
                mostrarMensaje("No se pudieron guardar los cambios.");
                return;
            }

            // Recuperar los datos recién guardados.
            usuarioEditar = obtenerUsuarioActivo();

            // Limpiar las contraseñas del formulario.
            campoActual.value = "";
            campoNueva.value = "";
            campoConfirmar.value = "";

            // Mostrar confirmación sin cambiar de página.
            mostrarMensaje(
                "¡Cambios guardados correctamente!",
                true
            );

        } catch (error) {

            console.error("Error al actualizar el perfil:", error);
            mostrarMensaje("No se pudieron guardar los cambios.");

        }

    });

}
