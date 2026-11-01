
 // Buscador compartido por todas las páginas de GrammaTech.

// Obtener la ubicación del archivo JavaScript.
const rutaBuscador = document.currentScript.src;

// Calcular la carpeta principal del proyecto.
const rutaPrincipal = new URL("../", rutaBuscador);

// Cursos disponibles.
const cursosBuscador = {
    ingles: "progreso-ingles.html",
    aleman: "progreso-aleman.html",
    chino: "progreso-chino.html"
};

// Buscar los formularios del buscador.
document.querySelectorAll(".conteiner-search").forEach(function(formulario) {

    // Permitir buscar haciendo clic en la lupa.
    const lupa = formulario.querySelector(".img-search");

    if (lupa) {

        lupa.style.cursor = "pointer";

        lupa.addEventListener("click", function() {
            formulario.requestSubmit();
        });

    }

    // Buscar al presionar Enter o hacer clic en la lupa.
    formulario.addEventListener("submit", function(evento) {

        // Evitar que la página se recargue.
        evento.preventDefault();

        const input = formulario.querySelector("input");

        if (!input) {
            return;
        }

        // Obtener el texto escrito.
        const busqueda = input.value
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        // Verificar si el curso existe.
        if (!cursosBuscador[busqueda]) {

            alert("Curso no encontrado. Buscá Inglés, Alemán o Chino.");
            return;

        }

        // Comprobar si el usuario inició sesión.
        const usuario = obtenerUsuarioActivo();

        if (!usuario) {

            alert("Primero tenés que iniciar sesión.");

            const login = new URL(
                "SubPaginasWeb/1_Vista Login/login.html",
                rutaPrincipal
            );

            window.location.href = login.href;
            return;

        }

        // Obtener la dirección del curso.
        const destino = new URL(
            "SubPaginasWeb/3_Vista Mapa de Unidades/" +
            cursosBuscador[busqueda],
            rutaPrincipal
        );

        // Ir al mapa del idioma.
        window.location.href = destino.href;

    });

});
