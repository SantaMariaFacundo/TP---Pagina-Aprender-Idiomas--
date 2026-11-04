import { USUARIOS_DEMO } from "./datos/usuariosDemo.js";

const CLAVE_USUARIOS = "grammatech_usuarios";
const CLAVE_SESION = "grammatech_usuario_activo";

const CONTRASENA_DEMO = "Demo123456";

export function formatearFecha(fecha = new Date()) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

export function obtenerRachaActual(usuario) {
    const hoy = formatearFecha();

    const fechaAyer = new Date();
    fechaAyer.setDate(fechaAyer.getDate() - 1);
    const ayer = formatearFecha(fechaAyer);

    if (usuario.ultimaFechaActividad === hoy || usuario.ultimaFechaActividad === ayer) {
        return Number(usuario.racha) || 0;
    }

    return 0;
}


function crearFichaUsuario(datos) {
    return {
        id: datos.id,
        nombre: datos.nombre,
        usuario: datos.usuario,
        correo: datos.correo,
        contrasena: datos.contrasena,
        idioma: "espanol",
        fechaRegistro: new Date().toISOString(),

        xp: datos.xp || 0,
        xpSemanal: datos.xpSemanal || 0,
        semanaXp: obtenerSemanaActual(),

        xpDiario: 0,
        fechaXpDiario: "",
        racha: datos.racha || 0,
        ultimaFechaActividad: datos.ultimaFechaActividad || "",
        diasActividad: datos.diasActividad || [],
        liga: datos.liga || "bronce",
        monedas: datos.monedas || 0,
        dobleXpPendiente: false,

        cursos: {
            ingles: { progreso: 0, leccionesCompletadas: [], examenesAprobados: [] },
            aleman: { progreso: 0, leccionesCompletadas: [], examenesAprobados: [] },
            chino: { progreso: 0, leccionesCompletadas: [], examenesAprobados: [] }
        },

        logros: []
    };
}


function crearUsuariosDemo() {
    const hoy = formatearFecha();

    return USUARIOS_DEMO.map((demo) => crearFichaUsuario({
        ...demo,
        contrasena: CONTRASENA_DEMO,
        ultimaFechaActividad: demo.racha > 0 ? hoy : "",
        diasActividad: demo.racha > 0 ? [hoy] : []
    }));
}


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



export function obtenerUsuarios() {

    try {

        const datos = localStorage.getItem(CLAVE_USUARIOS);

        
        if (datos === null) {
            const usuariosIniciales = crearUsuariosDemo();
            guardarUsuarios(usuariosIniciales);
            return usuariosIniciales;
        }

        const usuarios = JSON.parse(datos);

        if (!Array.isArray(usuarios)) {
            return [];
        }

        const semanaActual = obtenerSemanaActual();
        let huboCambios = false;

        
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

        
        semanasAnteriores.forEach(function(semana) {

            
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

                
                participantes.slice(0, limite).forEach(function(usuario) {

                    usuario.liga = liga === "bronce"
                        ? "plata"
                        : "oro";

                    huboCambios = true;

                });

            });

        });

        
        usuarios.forEach(function(usuario) {

            
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

        
        if (huboCambios) {
            guardarUsuarios(usuarios);
        }

        return usuarios;

    } catch (error) {

        console.error("Error al obtener usuarios:", error);
        return [];

    }

}


export function guardarUsuarios(usuarios) {
    localStorage.setItem(
        CLAVE_USUARIOS,
        JSON.stringify(usuarios)
    );
}


export function obtenerUsuarioActivo() {
    const idActivo = localStorage.getItem(CLAVE_SESION);

    if (!idActivo) {
        return null;
    }

    return obtenerUsuarios().find(
        usuario => usuario.id === idActivo
    ) || null;
}


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

    
    const nuevoUsuario = crearFichaUsuario({
        id: String(Date.now()),
        nombre: nombre,
        usuario: usuario,
        correo: correo,
        contrasena: contrasena
    });

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    return {
        exito: true,
        mensaje: "Usuario registrado correctamente.",
        usuario: nuevoUsuario
    };
}


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


export function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
}


export function actualizarUsuarioPorId(id, datosActualizados) {
    const usuarios = obtenerUsuarios();

    const indice = usuarios.findIndex(
        usuario => usuario.id === id
    );

    if (indice === -1) {
        return false;
    }

    
    usuarios[indice] = {
        ...usuarios[indice],
        ...datosActualizados,
        id: id
    };

    guardarUsuarios(usuarios);

    return true;
}


export function actualizarUsuario(datosActualizados) {
    const usuarioActivo = obtenerUsuarioActivo();

    if (!usuarioActivo) {
        return false;
    }

    return actualizarUsuarioPorId(usuarioActivo.id, datosActualizados);
}


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
