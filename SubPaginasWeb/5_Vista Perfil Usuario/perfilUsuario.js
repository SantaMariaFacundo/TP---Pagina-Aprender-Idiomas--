
console.log("Perfil de usuario conectado correctamente");

// Obtener los elementos del HTML.
const formularioPerfil = document.querySelector(".formulario-perfil");

const selectorIdioma = document.getElementById("idioma-interfaz");

const passwordActual = document.getElementById("password-actual");
const passwordNueva = document.getElementById("password-nueva");
const passwordConfirmar = document.getElementById("password-confirmar");

const tituloNombre = document.getElementById("titulo-nombre-usuario");
const nombreUsuario = document.querySelector(".nombre-usuario");
const avatar = document.querySelector(".avatar");

const correoVisible = document.querySelector(
    ".informacion-usuario p:not(.nombre-usuario)"
);

const datosCuenta = document.querySelectorAll(".datos-cuenta p");
const fechaRegistro = document.querySelector(".datos-cuenta time");

const tituloLiga = document.getElementById("titulo-logro-liga");
const tituloRacha = document.getElementById("titulo-logro-racha");
const tituloXp = document.getElementById("titulo-logro-xp");

// Obtener el usuario activo.
let usuarioActivo = obtenerUsuarioActivo();

if (!usuarioActivo) {

    window.location.replace("../1_Vista Login/login.html");

} else {

    // Actualizar textos sin borrar los enlaces Editar.
    function actualizarTexto(contenedor, texto) {

        if (!contenedor) {
            return;
        }

        const nodoTexto = Array.from(contenedor.childNodes).find(
            nodo =>
                nodo.nodeType === Node.TEXT_NODE &&
                nodo.textContent.trim() !== ""
        );

        if (nodoTexto) {
            nodoTexto.textContent = " " + texto + " ";
        }

    }

    // Mostrar los datos del usuario.
    function mostrarPerfil() {

        usuarioActivo = obtenerUsuarioActivo();

        if (!usuarioActivo) {
            return;
        }

        tituloNombre.textContent = usuarioActivo.nombre;
        nombreUsuario.textContent = usuarioActivo.usuario;

        actualizarTexto(correoVisible, usuarioActivo.correo);
        actualizarTexto(datosCuenta[0], usuarioActivo.nombre);
        actualizarTexto(datosCuenta[1], usuarioActivo.usuario);

        // Obtener las iniciales del nombre.
        const iniciales = usuarioActivo.nombre
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(palabra => palabra.charAt(0))
            .join("")
            .toUpperCase();

        avatar.textContent = iniciales;

        // Mostrar la fecha de registro.
        if (fechaRegistro && usuarioActivo.fechaRegistro) {

            const fecha = new Date(usuarioActivo.fechaRegistro);

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

        selectorIdioma.value = usuarioActivo.idioma || "espanol";

        // Mostrar la liga.
        const liga = usuarioActivo.liga || "bronce";

        tituloLiga.textContent =
            "Liga " + liga.charAt(0).toUpperCase() + liga.slice(1);

        // Mostrar la racha.
        const diasRacha = Number(usuarioActivo.racha) || 0;

        tituloRacha.textContent =
            "Racha de " + diasRacha +
            (diasRacha === 1 ? " día" : " días");

        // Mostrar los XP totales.
        const experiencia = Number(usuarioActivo.xp) || 0;

        tituloXp.textContent =
            experiencia.toLocaleString("es-AR") + " XP";

    }

    // Crear un mensaje debajo del botón Guardar cambios.
    const mensaje = document.createElement("p");

    mensaje.setAttribute("role", "status");
    mensaje.style.textAlign = "center";
    mensaje.style.marginTop = "1rem";
    mensaje.style.fontWeight = "bold";

    formularioPerfil.appendChild(mensaje);

    function mostrarMensaje(texto, correcto = false) {

        mensaje.textContent = texto;
        mensaje.style.color = correcto ? "#2A9C8D" : "#c0392b";

    }

    // Evitar navegar a la maqueta antigua.
    formularioPerfil.removeAttribute("action");

    // Guardar los cambios del formulario.
    formularioPerfil.addEventListener("submit", function(evento) {

        evento.preventDefault();

        mostrarMensaje("");

        // Recuperar el estado actual de la cuenta.
        usuarioActivo = obtenerUsuarioActivo();

        const idioma = selectorIdioma.value;

        const actual = passwordActual.value;
        const nueva = passwordNueva.value;
        const confirmar = passwordConfirmar.value;

        // Comprobar si cambió el idioma.
        const modificoIdioma =
            idioma !== (usuarioActivo.idioma || "espanol");

        // Comprobar si se desea cambiar la contraseña.
        const intentaCambiarContrasena =
            actual !== "" ||
            nueva !== "" ||
            confirmar !== "";

        if (!modificoIdioma && !intentaCambiarContrasena) {

            mostrarMensaje("No realizaste ningún cambio en tu perfil.");
            return;

        }

        // Preparar los datos para guardar.
        const cambios = {
            idioma: idioma
        };

        // Validar la contraseña.
        if (intentaCambiarContrasena) {

            if (actual !== usuarioActivo.contrasena) {
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

        // Guardar el perfil.
        try {

            const guardado = actualizarUsuario(cambios);

            if (!guardado) {
                mostrarMensaje("No se pudieron guardar los cambios.");
                return;
            }

            // Limpiar los campos de contraseña.
            passwordActual.value = "";
            passwordNueva.value = "";
            passwordConfirmar.value = "";

            // Actualizar los datos visibles.
            mostrarPerfil();

            // Confirmar sin abandonar la página.
            mostrarMensaje(
                "¡Cambios guardados correctamente!",
                true
            );

        } catch (error) {

            console.error("Error al guardar el perfil:", error);
            mostrarMensaje("No se pudieron guardar los cambios.");

        }

    });

    // Mostrar los datos al entrar.
    mostrarPerfil();

}
