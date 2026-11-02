// Importamos los módulos compartidos necesarios para esta página.
import "../../js/header.js";
import "../../js/buscador.js";

// Importamos las funciones de usuarios utilizadas en esta vista.
import { obtenerUsuarios, obtenerUsuarioActivo, actualizarUsuario } from "../../js/usuarios.js";


const formularioEditar = document.querySelector(".formulario-perfil");

const campoNombre = document.getElementById("nombre-completo");
const campoUsuario = document.getElementById("nombre-usuario");
const campoCorreo = document.getElementById("email");
const mensajeDatos = document.getElementById("mensaje-datos");

const botonMostrarPassword = document.getElementById("btn-mostrar-password");
const formularioPassword = document.getElementById("panel-password");

const campoActual = document.getElementById("password-actual");
const campoNueva = document.getElementById("password-nueva");
const campoConfirmar = document.getElementById("password-confirmar");
const mensajePassword = document.getElementById("mensaje-password");

let usuarioEditar = obtenerUsuarioActivo();

if (!usuarioEditar) {

    window.location.replace("../1_Vista Login/login.html");

} else {

    // Cargar los datos actuales.
    campoNombre.value = usuarioEditar.nombre;
    campoUsuario.value = usuarioEditar.usuario;
    campoCorreo.value = usuarioEditar.correo;

    // Mostrar la fecha de registro.
    const fechaRegistro = document.getElementById("fecha-registro");

    if (fechaRegistro && usuarioEditar.fechaRegistro) {

        const fecha = new Date(usuarioEditar.fechaRegistro);

        if (!Number.isNaN(fecha.getTime())) {

            fechaRegistro.dateTime =
                fecha.toISOString().slice(0, 10);

            fechaRegistro.textContent = fecha.toLocaleDateString(
                "es-AR",
                {
                    month: "long",
                    year: "numeric"
                }
            );

        }

    }

    // Mostrar errores y confirmaciones.
    function mostrarMensaje(elemento, texto, correcto = false) {

        elemento.textContent = texto;

        elemento.style.color = correcto
            ? "#2A9C8D"
            : "#c0392b";

    }

    // Guardar los datos personales.
    formularioEditar.addEventListener("submit", function(evento) {

        evento.preventDefault();

        mostrarMensaje(mensajeDatos, "");

        const nombre = campoNombre.value.trim();
        const usuario = campoUsuario.value.trim();
        const correo = campoCorreo.value.trim().toLowerCase();

        // Validar el nombre.
        if (nombre.length < 3) {

            mostrarMensaje(
                mensajeDatos,
                "El nombre debe tener al menos 3 caracteres."
            );

            return;
        }

        // Validar el nombre de usuario.
        if (!/^@?[a-zA-Z0-9_.]{3,20}$/.test(usuario)) {

            mostrarMensaje(
                mensajeDatos,
                "El usuario debe tener entre 3 y 20 caracteres, sin espacios."
            );

            return;
        }

        // Validar el correo.
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {

            mostrarMensaje(
                mensajeDatos,
                "Ingresá un correo electrónico válido."
            );

            return;
        }

        // Comprobar que no exista otro usuario igual.
        const usuarios = obtenerUsuarios();

        const usuarioRepetido = usuarios.some(function(u) {

            return u.id !== usuarioEditar.id &&
                u.usuario.toLowerCase() === usuario.toLowerCase();

        });

        if (usuarioRepetido) {

            mostrarMensaje(
                mensajeDatos,
                "Ese nombre de usuario ya está registrado."
            );

            return;
        }

        // Comprobar que el correo no esté registrado.
        const correoRepetido = usuarios.some(function(u) {

            return u.id !== usuarioEditar.id &&
                u.correo.toLowerCase() === correo;

        });

        if (correoRepetido) {

            mostrarMensaje(
                mensajeDatos,
                "Ese correo electrónico ya está registrado."
            );

            return;
        }

        // Comprobar si hubo algún cambio.
        if (
            nombre === usuarioEditar.nombre &&
            usuario === usuarioEditar.usuario &&
            correo === usuarioEditar.correo
        ) {

            mostrarMensaje(
                mensajeDatos,
                "No realizaste ningún cambio en tu perfil."
            );

            return;
        }

        // Guardar los datos personales.
        try {

            const guardado = actualizarUsuario({
                nombre: nombre,
                usuario: usuario,
                correo: correo
            });

            if (!guardado) {

                mostrarMensaje(
                    mensajeDatos,
                    "No se pudieron guardar los cambios."
                );

                return;
            }

            usuarioEditar = obtenerUsuarioActivo();

            mostrarMensaje(
                mensajeDatos,
                "¡Cambios guardados correctamente!",
                true
            );

        } catch (error) {

            console.error("Error al guardar los datos:", error);

            mostrarMensaje(
                mensajeDatos,
                "No se pudieron guardar los cambios."
            );

        }

    });

    // Mostrar u ocultar el cambio de contraseña.
    botonMostrarPassword.addEventListener("click", function() {

        formularioPassword.hidden = !formularioPassword.hidden;

        botonMostrarPassword.setAttribute(
            "aria-expanded",
            String(!formularioPassword.hidden)
        );

        formularioPassword.reset();

        mostrarMensaje(mensajePassword, "");

        if (!formularioPassword.hidden) {
            campoActual.focus();
        }

    });

    // Guardar una nueva contraseña.
    formularioPassword.addEventListener("submit", function(evento) {

        evento.preventDefault();

        mostrarMensaje(mensajePassword, "");

        usuarioEditar = obtenerUsuarioActivo();

        const actual = campoActual.value;
        const nueva = campoNueva.value;
        const confirmar = campoConfirmar.value;

        // Comprobar la contraseña actual.
        if (actual !== usuarioEditar.contrasena) {

            mostrarMensaje(
                mensajePassword,
                "La contraseña actual es incorrecta."
            );

            return;
        }

        // Validar la nueva contraseña.
        const contrasenaValida =
            nueva.length >= 10 &&
            /[A-Z]/.test(nueva) &&
            /[a-z]/.test(nueva) &&
            /[0-9]/.test(nueva);

        if (!contrasenaValida) {

            mostrarMensaje(
                mensajePassword,
                "La nueva contraseña debe tener al menos 10 caracteres, una mayúscula, una minúscula y un número."
            );

            return;
        }

        // Comprobar que coincidan.
        if (nueva !== confirmar) {

            mostrarMensaje(
                mensajePassword,
                "Las contraseñas nuevas no coinciden."
            );

            return;
        }

        // Evitar repetir la contraseña anterior.
        if (actual === nueva) {

            mostrarMensaje(
                mensajePassword,
                "La nueva contraseña debe ser diferente de la actual."
            );

            return;
        }

        // Guardar la nueva contraseña.
        try {

            const guardado = actualizarUsuario({
                contrasena: nueva
            });

            if (!guardado) {

                mostrarMensaje(
                    mensajePassword,
                    "No se pudo cambiar la contraseña."
                );

                return;
            }

            usuarioEditar = obtenerUsuarioActivo();

            formularioPassword.reset();
            formularioPassword.hidden = true;

            botonMostrarPassword.setAttribute(
                "aria-expanded",
                "false"
            );

            mostrarMensaje(
                mensajePassword,
                "¡Contraseña actualizada correctamente!",
                true
            );

        } catch (error) {

            console.error("Error al cambiar la contraseña:", error);

            mostrarMensaje(
                mensajePassword,
                "No se pudo cambiar la contraseña."
            );

        }

    });

}
