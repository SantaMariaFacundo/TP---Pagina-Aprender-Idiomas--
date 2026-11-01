const CLAVE_USUARIOS = "grammatech_usuarios";
const CLAVE_SESION = "grammatech_usuario_activo";

// Obtener el lunes de la semana actual.
export function obtenerSemanaActual() {
    const fecha = new Date();
    const dia = fecha.getDay();

    const diferencia = dia === 0 ? -6 : 1 - dia;
    fecha.setDate(fecha.getDate() + diferencia);

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const numeroDia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${numeroDia}`;
}

// Obtener los usuarios guardados.

export function obtenerUsuarios() {

    try {

        const datos = localStorage.getItem(CLAVE_USUARIOS);

        if (!datos) {
            return [];
        }

        const usuarios = JSON.parse(datos);

        if (!Array.isArray(usuarios)) {
            return [];
        }

        const semanaActual = obtenerSemanaActual();
        let huboCambios = false;

        // Buscar las semanas anteriores pendientes de cierre.
        const semanasAnteriores = [
            ...new Set(
                usuarios
                    .filter(usuario =>
                        usuario.semanaXp &&
                        usuario.semanaXp < semanaActual
                    )
                    .map(usuario => usuario.semanaXp)
            )
        ];

        // Calcular ascensos antes de reiniciar los puntos.
        semanasAnteriores.forEach(function(semana) {

            // Primero Plata, para evitar ascender dos ligas de golpe.
            ["plata", "bronce"].forEach(function(liga) {

                const limite = liga === "bronce" ? 5 : 3;

                const participantes = usuarios
                    .filter(usuario =>
                        usuario.semanaXp === semana &&
                        (usuario.liga || "bronce") === liga &&
                        Number(usuario.xpSemanal) > 0
                    )
                    .sort((a, b) =>
                        Number(b.xpSemanal) - Number(a.xpSemanal)
                    );

                // Ascender solamente a los primeros puestos.
                participantes.slice(0, limite).forEach(function(usuario) {

                    usuario.liga = liga === "bronce"
                        ? "plata"
                        : "oro";

                    huboCambios = true;

                });

            });

        });

        // Reiniciar los XP semanales.
        usuarios.forEach(function(usuario) {

            // Adaptar cuentas creadas antes de esta mejora.
            if (!usuario.semanaXp) {
                usuario.semanaXp = semanaActual;
                huboCambios = true;
            }

            if (usuario.semanaXp !== semanaActual) {

                usuario.xpSemanal = 0;
                usuario.semanaXp = semanaActual;

                huboCambios = true;

            }

        });

        // Guardar solamente cuando hubo modificaciones.
        if (huboCambios) {
            guardarUsuarios(usuarios);
        }

        return usuarios;

    } catch (error) {

        console.error("Error al obtener usuarios:", error);
        return [];

    }

}

// Guardar todos los usuarios.
export function guardarUsuarios(usuarios) {
    localStorage.setItem(
        CLAVE_USUARIOS,
        JSON.stringify(usuarios)
    );
}

// Obtener la cuenta que inició sesión.
export function obtenerUsuarioActivo() {
    const idActivo = localStorage.getItem(CLAVE_SESION);

    if (!idActivo) {
        return null;
    }

    return obtenerUsuarios().find(
        usuario => usuario.id === idActivo
    ) || null;
}

// Registrar una cuenta nueva.
export function registrarUsuario(nombre, usuario, correo, contrasena) {
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
        semanaXp: obtenerSemanaActual(),

        xpDiario: 0,
        fechaXpDiario: "",
        racha: 0,
        ultimaFechaActividad: "",
        diasActividad: [],
        liga: "bronce",
        monedas: 0,
        dobleXpPendiente: false,

        cursos: {
            ingles: {
                progreso: 0,
                leccionesCompletadas: [],
                examenesAprobados: []
            },
            aleman: {
                progreso: 0,
                leccionesCompletadas: [],
                examenesAprobados: []
            },
            chino: {
                progreso: 0,
                leccionesCompletadas: [],
                examenesAprobados: []
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

// Iniciar sesión.
export function iniciarSesion(identificador, contrasena) {
    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(
        registrado =>
            (
                registrado.usuario.toLowerCase() === identificador.toLowerCase() ||
                registrado.correo.toLowerCase() === identificador.toLowerCase()
            ) &&
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

// Cerrar sesión.
export function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
}

// Actualizar los datos del usuario activo.
export function actualizarUsuario(datosActualizados) {
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

// Sumar experiencia al usuario activo.
export function sumarExperiencia(cantidad) {
    const usuario = obtenerUsuarioActivo();

    if (!usuario || cantidad <= 0) {
        return false;
    }

    return actualizarUsuario({
        xp: (Number(usuario.xp) || 0) + cantidad,
        xpSemanal: (Number(usuario.xpSemanal) || 0) + cantidad
    });
}
