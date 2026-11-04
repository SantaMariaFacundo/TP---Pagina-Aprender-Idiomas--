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

campoFecha.max = formatearFecha();


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

formularioRegistro.addEventListener("submit", (evento) => {

    evento.preventDefault();

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

    if (Object.keys(errores).length > 0) {
        mostrarErroresCampos(formularioRegistro, errores);
        mostrarMensaje(mensajeRegistro, "Revisá los campos señalados antes de continuar.", "error");
        return;
    }

    limpiarErroresCampos(formularioRegistro);

    const resultado = registrarUsuario(
        `${datos.nombre} ${datos.apellido}`,
        generarNombreUsuario(datos.correo),
        datos.correo,
        datos.contrasena
    );

    if (!resultado.exito) {
        mostrarErroresCampos(formularioRegistro, { email: resultado.mensaje });
        mostrarMensaje(mensajeRegistro, resultado.mensaje, "error");
        return;
    }

    actualizarUsuarioPorId(resultado.usuario.id, {
        pais: datos.pais,
        fechaNacimiento: datos.fechaNacimiento
    });

    window.location.href = "../login.html?registro=ok";
});

formularioRegistro.addEventListener("input", () => {
    ocultarMensaje(mensajeRegistro);
});
