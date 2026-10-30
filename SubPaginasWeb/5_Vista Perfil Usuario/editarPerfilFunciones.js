
console.log("Editar Perfil conectado correctamente");

const formulario = document.querySelector(".formulario-perfil");

const campoNombre = document.getElementById("nombre-completo");
const campoUsuario = document.getElementById("nombre-usuario");
const campoCorreo = document.getElementById("email");
const campoIdioma = document.getElementById("idioma-interfaz");

const campoActual = document.getElementById("password-actual");
const campoNueva = document.getElementById("password-nueva");
const campoConfirmar = document.getElementById("password-confirmar");

const CLAVE_PERFIL = "grammatech_perfil_demo";

// Datos iniciales de demostración
const datosIniciales = {
    nombre: "Juan Pérez",
    usuario: "@juanperez_web",
    correo: "juan.perez@alumnos.unlam.edu.ar",
    idioma: "espanol",
    password: "Demo1234!"
};

// Recuperar perfil desde localStorage
function obtenerPerfil() {

    const datos = localStorage.getItem(CLAVE_PERFIL);

    if (datos !== null) {

        try {
            const perfilGuardado = JSON.parse(datos);

            if (perfilGuardado && typeof perfilGuardado === "object") {
                return { ...datosIniciales, ...perfilGuardado };
            }

        } catch (error) {
            console.error("Error al recuperar el perfil:", error);
        }

    }

    return { ...datosIniciales };
}

// Obtener perfil actual
let perfil = obtenerPerfil();

// Mostrar los datos guardados
campoNombre.value = perfil.nombre;
campoUsuario.value = perfil.usuario;
campoCorreo.value = perfil.correo;
campoIdioma.value = perfil.idioma;

// Guardar cambios
formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nombre = campoNombre.value.trim();
    const usuario = campoUsuario.value.trim();
    const correo = campoCorreo.value.trim();
    const idioma = campoIdioma.value;

    const actual = campoActual.value;
    const nueva = campoNueva.value;
    const confirmar = campoConfirmar.value;

    // Validar nombre
    if (nombre.length < 3) {
        alert("El nombre debe tener al menos 3 caracteres.");
        return;
    }

    // Validar usuario
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

    // Cambio de contraseña opcional
    if (actual !== "" || nueva !== "" || confirmar !== "") {

        if (actual !== perfil.password) {
            alert("La contraseña actual es incorrecta.");
            return;
        }

        if (nueva.length < 8) {
            alert("La nueva contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (nueva !== confirmar) {
            alert("Las contraseñas nuevas no coinciden.");
            return;
        }

        perfil.password = nueva;
    }

    // Actualizar los datos
    perfil.nombre = nombre;
    perfil.usuario = usuario;
    perfil.correo = correo;
    perfil.idioma = idioma;

    // Guardar en localStorage
    try {

        localStorage.setItem(
            CLAVE_PERFIL,
            JSON.stringify(perfil)
        );

        console.log("Perfil guardado correctamente");

        // Limpiar campos de contraseña
        campoActual.value = "";
        campoNueva.value = "";
        campoConfirmar.value = "";

        // Ir a la página de confirmación
        window.location.href = "cambiosGuardados.html";

    } catch (error) {

        console.error("Error al guardar:", error);
        alert("No se pudieron guardar los cambios.");

    }

});
