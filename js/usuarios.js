
const CLAVE_USUARIOS = "grammatech_usuarios";
const CLAVE_SESION = "grammatech_usuario_activo";

function obtenerUsuarios() {
    try {
        const datos = localStorage.getItem(CLAVE_USUARIOS);

        if (datos) {
            const usuarios = JSON.parse(datos);

            if (Array.isArray(usuarios)) {
                return usuarios;
            }
        }
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
    }

    return [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(
        CLAVE_USUARIOS,
        JSON.stringify(usuarios)
    );
}

function obtenerUsuarioActivo() {
    const idActivo = localStorage.getItem(CLAVE_SESION);

    if (!idActivo) {
        return null;
    }

    return obtenerUsuarios().find(
        usuario => usuario.id === idActivo
    ) || null;
}

function registrarUsuario(nombre, usuario, correo, contrasena) {
    const usuarios = obtenerUsuarios();

    const usuarioOcupado = usuarios.some(
        registrado =>
            registrado.usuario.toLowerCase() === usuario.toLowerCase()
    );

    if (usuarioOcupado) {
        return {
            exito: false,
            mensaje: "El nombre de usuario ya está registrado."
        };
    }

    const correoOcupado = usuarios.some(
        registrado =>
            registrado.correo.toLowerCase() === correo.toLowerCase()
    );

    if (correoOcupado) {
        return {
            exito: false,
            mensaje: "El correo electrónico ya está registrado."
        };
    }

    const nuevoUsuario = {
        id: crypto.randomUUID(),
        nombre: nombre,
        usuario: usuario,
        correo: correo,
        contrasena: contrasena,
        idioma: "espanol",
        fechaRegistro: new Date().toISOString(),
        xp: 0,
        xpSemanal: 0,
        racha: 0,
        liga: "bronce",
        monedas: 0,
        cursos: {
            ingles: {
                progreso: 0,
                leccionesCompletadas: []
            },
            aleman: {
                progreso: 0,
                leccionesCompletadas: []
            },
            chino: {
                progreso: 0,
                leccionesCompletadas: []
            }
        },
        logros: []
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    return {
        exito: true,
        mensaje: "Usuario registrado correctamente.",
        usuario: nuevoUsuario
    };
}

function iniciarSesion(identificador, contrasena) {
    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(
        registrado =>
            (registrado.usuario.toLowerCase() === identificador.toLowerCase() ||
             registrado.correo.toLowerCase() === identificador.toLowerCase()) &&
            registrado.contrasena === contrasena
    );

    if (!usuario) {
        return {
            exito: false,
            mensaje: "Usuario o contraseña incorrectos."
        };
    }

    localStorage.setItem(CLAVE_SESION, usuario.id);

    return {
        exito: true,
        mensaje: "Inicio de sesión correcto.",
        usuario: usuario
    };
}

function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
}

function actualizarUsuario(datosActualizados) {
    const usuarios = obtenerUsuarios();
    const usuarioActivo = obtenerUsuarioActivo();

    if (!usuarioActivo) {
        return false;
    }

    const indice = usuarios.findIndex(
        usuario => usuario.id === usuarioActivo.id
    );

    if (indice === -1) {
        return false;
    }

    usuarios[indice] = {
        ...usuarios[indice],
        ...datosActualizados,
        id: usuarioActivo.id
    };

    guardarUsuarios(usuarios);

    return true;
}

function sumarExperiencia(cantidad) {
    const usuario = obtenerUsuarioActivo();

    if (!usuario || cantidad <= 0) {
        return false;
    }

    return actualizarUsuario({
        xp: usuario.xp + cantidad,
        xpSemanal: usuario.xpSemanal + cantidad
    });
}
