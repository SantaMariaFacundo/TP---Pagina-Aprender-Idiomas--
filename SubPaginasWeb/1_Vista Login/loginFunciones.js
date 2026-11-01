
console.log("Login conectado correctamente");

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
