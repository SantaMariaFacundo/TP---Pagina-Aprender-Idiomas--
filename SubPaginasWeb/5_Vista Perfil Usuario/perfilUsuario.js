
const formulario = document.querySelector(".formulario-perfil");
const selectorIdioma = document.getElementById("idioma-interfaz");

const passwordActual = document.getElementById("password-actual");
const passwordNueva = document.getElementById("password-nueva");
const passwordConfirmar = document.getElementById("password-confirmar");

const CLAVE_PERFIL = "grammatech_perfil_demo";
const CLAVE_SESION = "grammatech_usuario_activo";

const datosIniciales = {
    nombre: "Juan Pérez",
    usuario: "@juanperez_web",
    correo: "juan.perez@alumnos.unlam.edu.ar",
    idioma: "espanol",
    password: "Demo1234!"
};

function obtenerPerfil() {
    const datos = localStorage.getItem(CLAVE_PERFIL);

    if (datos) {
        try {
            const guardado = JSON.parse(datos);

            if (guardado && typeof guardado === "object") {
                return { ...datosIniciales, ...guardado };
            }
        } catch (error) {
            console.error("Error al recuperar el perfil:", error);
        }
    }

    return { ...datosIniciales };
}

let perfil = obtenerPerfil();

// Actualizar texto sin eliminar enlaces ni etiquetas HTML
function actualizarTexto(contenedor, texto) {
    if (!contenedor) {
        return;
    }

    const nodo = Array.from(contenedor.childNodes).find(
        elemento => elemento.nodeType === Node.TEXT_NODE &&
                    elemento.textContent.trim() !== ""
    );

    if (nodo) {
        nodo.textContent = " " + texto + " ";
    }
}

// Mostrar nombre
document.getElementById("titulo-nombre-usuario").textContent =
    perfil.nombre;

// Mostrar nombre de usuario
document.querySelector(".nombre-usuario").textContent =
    perfil.usuario;

// Mostrar correo sin borrar el botón Editar
const correoVisible = document.querySelector(
    ".informacion-usuario p:not(.nombre-usuario)"
);

actualizarTexto(correoVisible, perfil.correo);

// Mostrar datos de la cuenta
const datosCuenta = document.querySelectorAll(".datos-cuenta p");

actualizarTexto(datosCuenta[0], perfil.nombre);
actualizarTexto(datosCuenta[1], perfil.usuario);

// Actualizar avatar con iniciales
const iniciales = perfil.nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(palabra => palabra[0])
    .join("")
    .toUpperCase();

document.querySelector(".avatar").textContent = iniciales;

// Recuperar el idioma seleccionado
selectorIdioma.value = perfil.idioma;

// Guardar cambios desde la vista principal
formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const actual = passwordActual.value;
    const nueva = passwordNueva.value;
    const confirmar = passwordConfirmar.value;

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

    perfil.idioma = selectorIdioma.value;

    try {
        localStorage.setItem(
            CLAVE_PERFIL,
            JSON.stringify(perfil)
        );
    } catch (error) {
        alert("No se pudieron guardar los cambios.");
        return;
    }

    window.location.href = "cambiosGuardados.html";
});

// Cerrar sesión
const cerrarSesion = document.querySelector(".cerrar-sesion a");

cerrarSesion.addEventListener("click", function(event) {

    event.preventDefault();

    localStorage.removeItem(CLAVE_SESION);

    window.location.href = "../../index.html";
});

