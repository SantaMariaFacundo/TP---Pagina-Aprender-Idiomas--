import "../../js/header.js";
import "../../js/buscador.js";

import { obtenerUsuarioActivo, actualizarUsuario } from "../../js/usuarios.js";
import { revisarContrasena } from "../../js/validaciones.js";


const formularioEditar = document.querySelector(".formulario-perfil");

const campoNombre = document.getElementById("nombre-completo");
const campoUsuario = document.getElementById("nombre-usuario");
const campoCorreo = document.getElementById("email");
const mensajeDatos = document.getElementById("mensaje-datos");
const errorNombre = document.getElementById("error-nombre-completo");

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

    campoNombre.value = usuarioEditar.nombre;
    campoUsuario.value = usuarioEditar.usuario;
    campoCorreo.value = usuarioEditar.correo;

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

    function mostrarMensaje(elemento, texto, correcto = false) {

        elemento.textContent = texto;

        elemento.style.color = correcto
            ? "#2A9C8D"
            : "#c0392b";

    }

    formularioEditar.addEventListener("submit", function(evento) {

        evento.preventDefault();

        mostrarMensaje(mensajeDatos, "");
        campoNombre.classList.remove("campo-invalido");
        errorNombre.textContent = "";

        const nombre = campoNombre.value.trim();

        if (nombre.length < 3) {

            campoNombre.classList.add("campo-invalido");
            errorNombre.textContent = "El nombre debe tener al menos 3 caracteres.";
            mostrarMensaje(mensajeDatos, "Revisá el nombre antes de guardar.");
            campoNombre.focus();

            return;
        }

        if (nombre === usuarioEditar.nombre) {

            mostrarMensaje(
                mensajeDatos,
                "No realizaste ningún cambio en tu perfil."
            );

            return;
        }

        const guardado = actualizarUsuario({
            nombre: nombre
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

    });

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

    formularioPassword.addEventListener("submit", function(evento) {

        evento.preventDefault();

        mostrarMensaje(mensajePassword, "");

        usuarioEditar = obtenerUsuarioActivo();

        const actual = campoActual.value;
        const nueva = campoNueva.value;
        const confirmar = campoConfirmar.value;

        if (actual !== usuarioEditar.contrasena) {

            mostrarMensaje(
                mensajePassword,
                "La contraseña actual es incorrecta."
            );

            return;
        }

        const errorContrasena = revisarContrasena(nueva);

        if (errorContrasena !== "") {

            mostrarMensaje(mensajePassword, errorContrasena);

            return;
        }

        if (nueva !== confirmar) {

            mostrarMensaje(
                mensajePassword,
                "Las contraseñas nuevas no coinciden."
            );

            return;
        }

        if (actual === nueva) {

            mostrarMensaje(
                mensajePassword,
                "La nueva contraseña debe ser diferente de la actual."
            );

            return;
        }

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
