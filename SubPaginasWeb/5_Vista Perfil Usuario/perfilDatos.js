
const CLAVE_PERFILES = "grammatech_perfiles_demo";
const CLAVE_USUARIO_ACTIVO = "grammatech_usuario_activo";

function obtenerPerfiles() {
    try {
        const guardados = JSON.parse(
            localStorage.getItem(CLAVE_PERFILES)
        );

        if (Array.isArray(guardados)) {
            return guardados;
        }
    } catch (error) {
        console.warn("No se pudieron leer los perfiles", error);
    }

    const iniciales = [
        {
            id: "juan-demo",
            nombre: "Juan Pérez",
            usuario: "@juanperez_web",
            correo: "juan.perez@alumnos.unlam.edu.ar",
            idioma: "espanol",
            miembroDesde: "Marzo de 2025",
            xp: 1850,
            racha: 5,
            liga: "Bronce",
            contrasenaDemo: "Demo1234!"
        }
    ];

    localStorage.setItem(
        CLAVE_PERFILES,
        JSON.stringify(iniciales)
    );

    return iniciales;
}

function obtenerUsuarioActivo() {
    const idActivo =
        localStorage.getItem(CLAVE_USUARIO_ACTIVO) || "juan-demo";

    return obtenerPerfiles().find(
        perfil => perfil.id === idActivo
    ) || null;
}

function guardarPerfilActualizado(actualizado) {
    const perfiles = obtenerPerfiles();

    const posicion = perfiles.findIndex(
        perfil => perfil.id === actualizado.id
    );

    if (posicion < 0) {
        return false;
    }

    perfiles[posicion] = actualizado;

    localStorage.setItem(
        CLAVE_PERFILES,
        JSON.stringify(perfiles)
    );

    return true;
}
