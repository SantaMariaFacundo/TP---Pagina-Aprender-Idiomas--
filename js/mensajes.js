
export function mostrarMensaje(elemento, texto, tipo = "error") {
    elemento.textContent = texto;
    elemento.className = `mensaje-formulario mensaje-formulario--${tipo}`;
    elemento.hidden = false;
}


export function ocultarMensaje(elemento) {
    elemento.textContent = "";
    elemento.hidden = true;
}


export function limpiarErroresCampos(formulario) {
    formulario.querySelectorAll(".error-campo").forEach((error) => {
        error.textContent = "";
    });

    formulario.querySelectorAll(".campo-invalido").forEach((campo) => {
        campo.classList.remove("campo-invalido");
        campo.removeAttribute("aria-invalid");
    });
}


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

    
    const primerCampo = document.getElementById(Object.keys(errores)[0]);

    if (primerCampo) {
        primerCampo.focus();
    }
}
