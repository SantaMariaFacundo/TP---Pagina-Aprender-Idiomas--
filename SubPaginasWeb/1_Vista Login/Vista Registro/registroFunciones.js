// Importamos las funciones de usuarios, validaciones y mensajes.
import { obtenerUsuarios, actualizarUsuarioPorId, registrarUsuario, formatearFecha } from "../../../js/usuarios.js";
import { validarRegistro } from "../../../js/validaciones.js";
import {
    mostrarMensaje,
    ocultarMensaje,
    mostrarErroresCampos,
    limpiarErroresCampos
} from "../../../js/mensajes.js";

const formularioRegistro = document.getElementById("formulario-registro");
const mensajeRegistro = document.getElementById("mensaje-registro");

const campoNombre = document.getElementById("name");
const campoApellido = document.getElementById("apellido");
const campoPais = document.getElementById("pais");
const campoFecha = document.getElementById("fecha");
const campoCorreo = document.getElementById("email");
const campoContrasena = document.getElementById("contraseña");
const campoRepetir = document.getElementById("repcontrasena");
const campoTerminos = document.getElementById("politica-privacidad");

// El calendario no deja elegir una fecha posterior a hoy.
campoFecha.max = formatearFecha();

// Arma un nombre de usuario a partir del correo: juan.perez@mail.com → @juan.perez
// Si ya existe, le agrega un número: @juan.perez1, @juan.perez2...
function generarNombreUsuario(correo) {
    const usuarios = obtenerUsuarios();
    const base = "@" + correo.split("@")[0].replace(/[^a-zA-Z0-9_.]/g, "");

    let nombreUsuario = base;
    let numero = 1;

    while (usuarios.some((usuario) => usuario.usuario.toLowerCase() === nombreUsuario.toLowerCase())) {
        nombreUsuario = base + numero;
        numero++;
    }

    return nombreUsuario;
}

// Detectar cuando el usuario presiona Registrarme.
formularioRegistro.addEventListener("submit", (evento) => {

    evento.preventDefault();

    // Recuperar los valores del formulario.
    const datos = {
        nombre: campoNombre.value.trim(),
        apellido: campoApellido.value.trim(),
        pais: campoPais.value,
        fechaNacimiento: campoFecha.value,
        correo: campoCorreo.value.trim().toLowerCase(),
        contrasena: campoContrasena.value,
        repetirContrasena: campoRepetir.value,
        aceptaTerminos: campoTerminos.checked
    };

    const errores = validarRegistro(datos);

    // Si hay errores, los mostramos junto a cada campo.
    if (Object.keys(errores).length > 0) {
        mostrarErroresCampos(formularioRegistro, errores);
        mostrarMensaje(mensajeRegistro, "Revisá los campos señalados antes de continuar.", "error");
        return;
    }

    limpiarErroresCampos(formularioRegistro);

    // Crear la cuenta mediante usuarios.js.
    const resultado = registrarUsuario(
        `${datos.nombre} ${datos.apellido}`,
        generarNombreUsuario(datos.correo),
        datos.correo,
        datos.contrasena
    );

    // Por ejemplo, si el correo ya estaba registrado.
    if (!resultado.exito) {
        mostrarErroresCampos(formularioRegistro, { email: resultado.mensaje });
        mostrarMensaje(mensajeRegistro, resultado.mensaje, "error");
        return;
    }

    // Guardar país y fecha de nacimiento en la cuenta nueva.
    actualizarUsuarioPorId(resultado.usuario.id, {
        pais: datos.pais,
        fechaNacimiento: datos.fechaNacimiento
    });

    // Volvemos al login, que muestra el aviso de cuenta creada.
    window.location.href = "../login.html?registro=ok";
});

// Al cambiar algún dato, ocultamos el mensaje general.
formularioRegistro.addEventListener("input", () => {
    ocultarMensaje(mensajeRegistro);
});
