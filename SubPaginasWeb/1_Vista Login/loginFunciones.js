import "../../js/buscador.js";

import { iniciarSesion } from "../../js/usuarios.js";
import { validarLogin } from "../../js/validaciones.js";
import {
    mostrarMensaje,
    ocultarMensaje,
    mostrarErroresCampos,
    limpiarErroresCampos
} from "../../js/mensajes.js";


const formularioLogin = document.getElementById("formulario-login");
const campoUsuario = document.getElementById("email");
const campoContrasena = document.getElementById("contraseña");
const mensajeLogin = document.getElementById("mensaje-login");

const parametros = new URLSearchParams(window.location.search);

if (parametros.get("registro") === "ok") {
    mostrarMensaje(mensajeLogin, "¡Cuenta creada correctamente! Ahora podés iniciar sesión.", "exito");
}

formularioLogin.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const datos = {
        identificador: campoUsuario.value.trim(),
        contrasena: campoContrasena.value
    };

    const errores = validarLogin(datos);

    if (Object.keys(errores).length > 0) {
        mostrarErroresCampos(formularioLogin, errores);
        mostrarMensaje(mensajeLogin, "Completá los campos señalados.", "error");
        return;
    }

    limpiarErroresCampos(formularioLogin);

    const resultado = iniciarSesion(datos.identificador, datos.contrasena);

    if (!resultado.exito) {
        mostrarMensaje(mensajeLogin, resultado.mensaje, "error");
        return;
    }

    window.location.href = "../2_Vista home/home.html";
});

formularioLogin.addEventListener("input", () => {
    ocultarMensaje(mensajeLogin);
});
