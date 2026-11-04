/**
 * Funciones para mostrar mensajes en la página sin usar alert().
 * Se usan en login, registro y opiniones.
 */

/**
 * Muestra un mensaje general del formulario.
 * tipo puede ser "exito" o "error".
 */
export function mostrarMensaje(elemento, texto, tipo = "error") {
    elemento.textContent = texto;
    elemento.className = `mensaje-formulario mensaje-formulario--${tipo}`;
    elemento.hidden = false;
}

// Oculta el mensaje general del formulario.
export function ocultarMensaje(elemento) {
    elemento.textContent = "";
    elemento.hidden = true;
}

// Borra los errores que estaban marcados en los campos.
export function limpiarErroresCampos(formulario) {
    formulario.querySelectorAll(".error-campo").forEach((error) => {
        error.textContent = "";
    });

    formulario.querySelectorAll(".campo-invalido").forEach((campo) => {
        campo.classList.remove("campo-invalido");
        campo.removeAttribute("aria-invalid");
    });
}

/**
 * Muestra cada error debajo de su campo.
 * La clave del objeto es el id del input y el error se muestra
 * en el elemento con id "error-" + id del input.
 */
export function mostrarErroresCampos(formulario, errores) {
    limpiarErroresCampos(formulario);

    Object.entries(errores).forEach(([idCampo, texto]) => {
        const campo = document.getElementById(idCampo);
        const error = document.getElementById(`error-${idCampo}`);

        if (campo) {
            campo.classList.add("campo-invalido");
            campo.setAttribute("aria-invalid", "true");
        }

        if (error) {
            error.textContent = texto;
        }
    });

    // Llevamos el foco al primer campo con error.
    const primerCampo = document.getElementById(Object.keys(errores)[0]);

    if (primerCampo) {
        primerCampo.focus();
    }
}
