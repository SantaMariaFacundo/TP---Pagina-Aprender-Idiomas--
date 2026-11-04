const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export function revisarContrasena(contrasena) {
    if (contrasena.length < 10) {
        return "La contraseña debe tener al menos 10 caracteres.";
    }

    if (!/[A-Z]/.test(contrasena)) {
        return "La contraseña debe tener al menos una mayúscula.";
    }

    if (!/[a-z]/.test(contrasena)) {
        return "La contraseña debe tener al menos una minúscula.";
    }

    if (!/[0-9]/.test(contrasena)) {
        return "La contraseña debe tener al menos un número.";
    }

    return "";
}


export function validarLogin(datos) {
    const errores = {};

    if (datos.identificador === "") {
        errores["email"] = "Ingresá tu nombre de usuario o tu correo.";
    }

    if (datos.contrasena === "") {
        errores["contraseña"] = "Ingresá tu contraseña.";
    }

    return errores;
}


export function validarRegistro(datos) {
    const errores = {};

    if (datos.nombre.length < 2) {
        errores["name"] = "Ingresá un nombre de al menos 2 letras.";
    }

    if (datos.apellido.length < 2) {
        errores["apellido"] = "Ingresá un apellido de al menos 2 letras.";
    }

    if (datos.pais === "") {
        errores["pais"] = "Seleccioná tu país de residencia.";
    }

    if (datos.fechaNacimiento === "") {
        errores["fecha"] = "Ingresá tu fecha de nacimiento.";
    } else {
        
        const fecha = new Date(datos.fechaNacimiento + "T12:00:00");

        if (fecha > new Date()) {
            errores["fecha"] = "La fecha de nacimiento no puede ser futura.";
        }
    }

    if (!PATRON_CORREO.test(datos.correo)) {
        errores["email"] = "Ingresá un correo electrónico válido.";
    }

    const errorContrasena = revisarContrasena(datos.contrasena);

    if (errorContrasena !== "") {
        errores["contraseña"] = errorContrasena;
    }

    if (datos.repetirContrasena === "") {
        errores["repcontrasena"] = "Repetí la contraseña.";
    } else if (datos.contrasena !== datos.repetirContrasena) {
        errores["repcontrasena"] = "Las contraseñas no coinciden.";
    }

    if (!datos.aceptaTerminos) {
        errores["politica-privacidad"] = "Tenés que aceptar los términos y condiciones.";
    }

    return errores;
}
