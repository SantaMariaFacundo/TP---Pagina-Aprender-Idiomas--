// Importamos los módulos compartidos necesarios para esta página.
import "../../js/buscador.js";
import "../../js/traductor.js";

// Importamos las funciones de usuarios utilizadas en esta vista.
import { iniciarSesion } from "../../js/usuarios.js";


const formularioLogin = document.querySelector(
    'form[aria-label="Iniciar sesión"]'
);

const campoCorreo = document.getElementById("email");
const campoContrasena = document.getElementById("contraseña");

formularioLogin.addEventListener("submit", function(event) {

    event.preventDefault();

    const correo = campoCorreo.value.trim().toLowerCase();
    const contrasena = campoContrasena.value;

    if (correo === "" || contrasena === "") {
        alert("Completá el correo y la contraseña.");
        return;
    }

    const resultado = iniciarSesion(correo, contrasena);

    if (!resultado.exito) {
        alert(resultado.mensaje);
        return;
    }

    alert("¡Bienvenido a GrammaTech!");

    window.location.href = "../2_Vista home/home.html";

});
