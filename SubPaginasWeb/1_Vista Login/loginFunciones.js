// Importamos los módulos compartidos necesarios para esta página.
import "../../js/buscador.js";

// Importamos las funciones de usuarios, validaciones y mensajes.
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

// Si venimos del registro (login.html?registro=ok), avisamos que la cuenta se creó.
const parametros = new URLSearchParams(window.location.search);

if (parametros.get("registro") === "ok") {
    mostrarMensaje(mensajeLogin, "¡Cuenta creada correctamente! Ahora podés iniciar sesión.", "exito");
}

formularioLogin.addEventListener("submit", (evento) => {

    // Evitamos que el navegador recargue la página.
    evento.preventDefault();

    const datos = {
        identificador: campoUsuario.value.trim(),
        contrasena: campoContrasena.value
    };

    const errores = validarLogin(datos);

    // Si falta algún dato, lo marcamos y no seguimos.
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

    // Acceso correcto: vamos al panel principal.
    window.location.href = "../2_Vista home/home.html";
});

// Al escribir de nuevo, ocultamos el mensaje anterior.
formularioLogin.addEventListener("input", () => {
    ocultarMensaje(mensajeLogin);
});
