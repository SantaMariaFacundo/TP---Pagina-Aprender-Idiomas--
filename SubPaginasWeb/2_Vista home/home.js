/*const btnAgregarCursoIngles = document.getElementById("btnCursoIngles");
const cursoInglesProgreso = document.getElementById("card-ingles-progreso");
const btnCerrarProgresoIngles = document.getElementById("btn-cerrar-card-ingles");

const btnAgregarCursoAleman = document.getElementById("btnCursoAleman");
const cursoAlemanProgreso = document.getElementById("card-aleman-progreso");
const btnCerrarProgresoAleman = document.getElementById("btn-cerrar-card-aleman");

const btnAgregarCursoChino = document.getElementById("btnCursoChino");
const cursoChinoProgreso = document.getElementById("card-chino-progreso");
const btnCerrarProgresoChino = document.getElementById("btn-cerrar-card-chino");


btnAgregarCursoIngles.addEventListener("click", () => {

   cursoInglesProgreso.style.display = "grid";
    
});

btnCerrarProgresoIngles.addEventListener("click", () => {

    cursoInglesProgreso.style.display = "none";
    
});

btnAgregarCursoAleman.addEventListener("click", () => {

   cursoAlemanProgreso.style.display = "grid";
    
});

btnCerrarProgresoAleman.addEventListener("click", () => {

    cursoAlemanProgreso.style.display = "none";
    
});

btnAgregarCursoChino.addEventListener("click", () => {

   cursoChinoProgreso.style.display = "grid";
    
});

btnCerrarProgresoChino.addEventListener("click", () => {

    cursoChinoProgreso.style.display = "none";
    
});*/

const btnAgregar = document.querySelectorAll("[data-curso]");
const btnCerrar = document.querySelectorAll("[data-cerrar]");

const cursoInglesProgreso = document.getElementById("card-ingles-progreso");
const cursoAlemanProgreso = document.getElementById("card-aleman-progreso");
const cursoChinoProgreso = document.getElementById("card-chino-progreso");
const mensajeSinCursos = document.getElementById("mensajeSinCursos");

btnAgregar.forEach((boton) => {
    boton.addEventListener("click", () => {
        const curso = boton.dataset.curso;
        const card = document.getElementById(`card-${curso}-progreso`);

        card.style.display = "grid";
        actualizarMensaje();
    });
});

btnCerrar.forEach((boton) => {
    boton.addEventListener("click", () => {
        const curso = boton.dataset.cerrar;
        const card = document.getElementById(`card-${curso}-progreso`);

        card.style.display = "none";
        actualizarMensaje();
    });
});

function actualizarMensaje() {
    const todosOcultos =
        cursoInglesProgreso.style.display === "none" &&
        cursoAlemanProgreso.style.display === "none" &&
        cursoChinoProgreso.style.display === "none";

    if (todosOcultos) {
        mensajeSinCursos.style.display = "flex";
    } else {
        mensajeSinCursos.style.display = "none";
    }
}