console.log("Registro conectado correctamente");

const formularioRegistro = document.getElementById("formulario-registro");

const campoNombre = document.getElementById("name");
const campoApellido = document.getElementById("apellido");
const campoPais = document.getElementById("pais");
const campoFecha = document.getElementById("fecha");
const campoCorreo = document.getElementById("email");
const campoContrasena = document.getElementById("contraseña");
const campoRepetir = document.getElementById("repcontrasena");
const campoTerminos = document.getElementById("politica-privacidad");

// Establecer la fecha máxima permitida

const hoy = new Date();

const anio = hoy.getFullYear();
const mes = String(hoy.getMonth() + 1).padStart(2, "0");
const dia = String(hoy.getDate()).padStart(2, "0");

campoFecha.max = `${anio}-${mes}-${dia}`;

// Detectar cuando el usuario presiona Registrarme

formularioRegistro.addEventListener("submit", function(event) {

    event.preventDefault();

    // Recuperar los valores del formulario

    const nombre = campoNombre.value.trim();
    const apellido = campoApellido.value.trim();
    const pais = campoPais.value;
    const fechaNacimiento = campoFecha.value;
    const correo = campoCorreo.value.trim().toLowerCase();
    const contrasena = campoContrasena.value;
    const repetirContrasena = campoRepetir.value;

    // Validar nombre y apellido

    if (nombre.length < 2 || apellido.length < 2) {
        alert("Ingresá un nombre y apellido válidos.");
        return;
    }

    // Validar país y fecha de nacimiento

    if (!pais || !fechaNacimiento) {
        alert("Completá tu país y fecha de nacimiento.");
        return;
    }

    const fechaIngresada = new Date(fechaNacimiento + "T12:00:00");

    if (
        Number.isNaN(fechaIngresada.getTime()) ||
        fechaIngresada > new Date()
    ) {
        alert("Ingresá una fecha de nacimiento válida.");
        return;
    }

    // Validar correo electrónico

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(correo)) {
        alert("Ingresá un correo electrónico válido.");
        return;
    }

    // Validar los requisitos de contraseña

    const contrasenaValida =
        contrasena.length >= 10 &&
        /[A-Z]/.test(contrasena) &&
        /[a-z]/.test(contrasena) &&
        /[0-9]/.test(contrasena);

    if (!contrasenaValida) {
        alert(
            "La contraseña debe tener al menos 10 caracteres, una mayúscula, una minúscula y un número."
        );
        return;
    }

    // Verificar que las contraseñas coincidan

    if (contrasena !== repetirContrasena) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Verificar la aceptación de los términos

    if (!campoTerminos.checked) {
        alert("Tenés que aceptar los términos y condiciones.");
        return;
    }

    // Obtener las cuentas existentes

    const usuariosRegistrados = obtenerUsuarios();

    // Generar un nombre de usuario a partir del correo

    let nombreUsuario = "@" + correo.split("@")[0]
        .replace(/[^a-zA-Z0-9_.]/g, "");

    if (nombreUsuario.length < 4) {
        nombreUsuario = "@usuario";
    }

    nombreUsuario = nombreUsuario.substring(0, 21);

    const usuarioBase = nombreUsuario;
    let numero = 1;

    // Evitar nombres de usuario repetidos

    while (
        usuariosRegistrados.some(
            usuario =>
                usuario.usuario.toLowerCase() === nombreUsuario.toLowerCase()
        )
    ) {
        nombreUsuario = usuarioBase.substring(
            0,
            21 - String(numero).length
        ) + numero;

        numero++;
    }

    // Crear la cuenta mediante usuarios.js

    try {

        const resultado = registrarUsuario(
            `${nombre} ${apellido}`,
            nombreUsuario,
            correo,
            contrasena
        );

        if (!resultado.exito) {
            alert(resultado.mensaje);
            return;
        }

        // Guardar país y fecha de nacimiento

        const usuarios = obtenerUsuarios();

        const usuarioRegistrado = usuarios.find(
            usuario => usuario.id === resultado.usuario.id
        );

        if (usuarioRegistrado) {
            usuarioRegistrado.pais = pais;
            usuarioRegistrado.fechaNacimiento = fechaNacimiento;

            guardarUsuarios(usuarios);
        }

        // Informar que el registro fue exitoso

        alert("¡Cuenta creada correctamente! Ahora podés iniciar sesión.");

        formularioRegistro.reset();

        // Redirigir a Login

        window.location.href = "../login.html";

    } catch (error) {
        console.error("Error durante el registro:", error);
        alert("No se pudo completar el registro.");
    }

});
