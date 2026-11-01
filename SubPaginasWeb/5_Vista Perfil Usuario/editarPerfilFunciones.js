

console.log("Editar perfil conectado correctamente");

// Obtener los elementos del formulario

const formularioEditar = document.querySelector(".formulario-perfil");

const campoNombre = document.getElementById("nombre-completo");
const campoUsuario = document.getElementById("nombre-usuario");
const campoCorreo = document.getElementById("email");
const campoIdioma = document.getElementById("idioma-interfaz");

const campoActual = document.getElementById("password-actual");
const campoNueva = document.getElementById("password-nueva");
const campoConfirmar = document.getElementById("password-confirmar");

// Recuperar el usuario que inició sesión

const usuarioEditar = obtenerUsuarioActivo();

// Comprobar que exista una sesión activa

if (!usuarioEditar) {

    window.location.replace("../1_Vista Login/login.html");

} else {

    // Cargar los datos actuales en el formulario

    campoNombre.value = usuarioEditar.nombre;
    campoUsuario.value = usuarioEditar.usuario;
    campoCorreo.value = usuarioEditar.correo;
    campoIdioma.value = usuarioEditar.idioma || "espanol";

    // Mostrar la fecha real de registro

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

    // Detectar cuando se presiona Guardar cambios

    formularioEditar.addEventListener("submit", function(event) {

        event.preventDefault();

        // Obtener los valores ingresados

        const nombre = campoNombre.value.trim();
        const usuario = campoUsuario.value.trim();
        const correo = campoCorreo.value.trim().toLowerCase();
        const idioma = campoIdioma.value;

        const actual = campoActual.value;
        const nueva = campoNueva.value;
        const confirmar = campoConfirmar.value;

        // Validar nombre completo

        if (nombre.length < 3) {
            alert("El nombre debe tener al menos 3 caracteres.");
            return;
        }

        // Validar nombre de usuario

        const usuarioValido = /^@?[a-zA-Z0-9_.]{3,20}$/;

        if (!usuarioValido.test(usuario)) {
            alert("El usuario debe tener entre 3 y 20 caracteres, sin espacios.");
            return;
        }

        // Validar correo electrónico

        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!correoValido.test(correo)) {
            alert("Ingresá un correo electrónico válido.");
            return;
        }

        // Recuperar todas las cuentas registradas

        const usuarios = obtenerUsuarios();

        // Comprobar que el nombre de usuario no esté ocupado

        const usuarioRepetido = usuarios.some(function(registrado) {

            return registrado.id !== usuarioEditar.id &&
                registrado.usuario.toLowerCase() === usuario.toLowerCase();

        });

        if (usuarioRepetido) {
            alert("Ese nombre de usuario ya está registrado.");
            return;
        }

        // Comprobar que el correo no esté registrado en otra cuenta

        const correoRepetido = usuarios.some(function(registrado) {

            return registrado.id !== usuarioEditar.id &&
                registrado.correo.toLowerCase() === correo;

        });

        if (correoRepetido) {
            alert("Ese correo electrónico ya está registrado.");
            return;
        }

        // Comprobar si se modificaron los datos personales

        const modificoDatos =
            nombre !== usuarioEditar.nombre ||
            usuario !== usuarioEditar.usuario ||
            correo !== usuarioEditar.correo ||
            idioma !== (usuarioEditar.idioma || "espanol");

        // Comprobar si se está intentando cambiar la contraseña

        const intentaCambiarContrasena =
            actual !== "" ||
            nueva !== "" ||
            confirmar !== "";

        // Evitar guardar cuando no se modificó ningún dato

        if (!modificoDatos && !intentaCambiarContrasena) {
            alert("No realizaste ningún cambio en tu perfil.");
            return;
        }

        // Preparar los datos que se van a actualizar

        const cambios = {
            nombre: nombre,
            usuario: usuario,
            correo: correo,
            idioma: idioma
        };

        // Cambiar contraseña solamente si se completaron sus campos

        if (intentaCambiarContrasena) {

            // Comprobar la contraseña actual

            if (actual !== usuarioEditar.contrasena) {
                alert("La contraseña actual es incorrecta.");
                return;
            }

            // Validar la nueva contraseña

            const contrasenaValida =
                nueva.length >= 10 &&
                /[A-Z]/.test(nueva) &&
                /[a-z]/.test(nueva) &&
                /[0-9]/.test(nueva);

            if (!contrasenaValida) {
                alert(
                    "La nueva contraseña debe tener al menos 10 caracteres, una mayúscula, una minúscula y un número."
                );
                return;
            }

            // Comprobar que ambas contraseñas coincidan

            if (nueva !== confirmar) {
                alert("Las contraseñas nuevas no coinciden.");
                return;
            }

            cambios.contrasena = nueva;
        }

        // Guardar los cambios en el localStorage general

        try {

            const guardado = actualizarUsuario(cambios);

            if (!guardado) {
                alert("No se pudieron guardar los cambios.");
                return;
            }

            // Limpiar los campos de contraseña

            campoActual.value = "";
            campoNueva.value = "";
            campoConfirmar.value = "";

            // Mostrar la pantalla de confirmación

            window.location.href = "cambiosGuardados.html";

        } catch (error) {

            console.error("Error al actualizar el perfil:", error);
            alert("No se pudieron guardar los cambios.");

        }

    });

}
