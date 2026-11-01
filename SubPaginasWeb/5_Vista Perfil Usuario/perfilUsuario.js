
console.log("Perfil de usuario conectado correctamente");

// Obtener los elementos del HTML

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

// Recuperar la cuenta que inició sesión

const usuarioActivo = obtenerUsuarioActivo();

// Verificar que haya una sesión activa

if (!usuarioActivo) {

    window.location.replace("../1_Vista Login/login.html");

} else {

    // Actualizar un texto sin eliminar los enlaces Editar

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

    // Mostrar los datos personales

    tituloNombre.textContent = usuarioActivo.nombre;

    nombreUsuario.textContent = usuarioActivo.usuario;

    actualizarTexto(correoVisible, usuarioActivo.correo);

    actualizarTexto(datosCuenta[0], usuarioActivo.nombre);

    actualizarTexto(datosCuenta[1], usuarioActivo.usuario);

    // Mostrar iniciales del nombre en el avatar

    const iniciales = usuarioActivo.nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(palabra => palabra.charAt(0))
        .join("")
        .toUpperCase();

    avatar.textContent = iniciales;

    // Mostrar la fecha de registro

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

    // Cargar el idioma guardado

    selectorIdioma.value = usuarioActivo.idioma || "espanol";

    // Mostrar los logros de la cuenta

    const liga = usuarioActivo.liga || "bronce";

    tituloLiga.textContent =
        "Liga " + liga.charAt(0).toUpperCase() + liga.slice(1);

    const diasRacha = Number(usuarioActivo.racha) || 0;

    tituloRacha.textContent =
        "Racha de " + diasRacha +
        (diasRacha === 1 ? " día" : " días");

    const experiencia = Number(usuarioActivo.xp) || 0;

    tituloXp.textContent =
        experiencia.toLocaleString("es-AR") + " XP";

    // Detectar el botón Guardar cambios

    formularioPerfil.addEventListener("submit", function(event) {

        event.preventDefault();

        const idioma = selectorIdioma.value;

        const actual = passwordActual.value;
        const nueva = passwordNueva.value;
        const confirmar = passwordConfirmar.value;

        // Comprobar si el idioma fue modificado

        const modificoIdioma =
            idioma !== (usuarioActivo.idioma || "espanol");

        // Comprobar si se intenta cambiar la contraseña

        const intentaCambiarContrasena =
            actual !== "" ||
            nueva !== "" ||
            confirmar !== "";

        // Evitar guardar cuando no hay modificaciones

        if (!modificoIdioma && !intentaCambiarContrasena) {
            alert("No realizaste ningún cambio en tu perfil.");
            return;
        }

        // Preparar los datos que se van a guardar

        const cambios = {
            idioma: idioma
        };

        // Validar el cambio de contraseña

        if (intentaCambiarContrasena) {

            if (actual !== usuarioActivo.contrasena) {
                alert("La contraseña actual es incorrecta.");
                return;
            }

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

            if (nueva !== confirmar) {
                alert("Las contraseñas nuevas no coinciden.");
                return;
            }

            cambios.contrasena = nueva;
        }

        // Guardar los cambios en la cuenta activa

        try {

            const guardado = actualizarUsuario(cambios);

            if (!guardado) {
                alert("No se pudieron guardar los cambios.");
                return;
            }

            // Limpiar los campos de contraseña

            passwordActual.value = "";
            passwordNueva.value = "";
            passwordConfirmar.value = "";

            // Mostrar la pantalla de confirmación

            window.location.href = "cambiosGuardados.html";

        } catch (error) {

            console.error("Error al guardar el perfil:", error);
            alert("No se pudieron guardar los cambios.");

        }

    });

}
