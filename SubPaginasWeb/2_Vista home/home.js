
console.log("Home conectado correctamente");

// Obtener los botones para agregar y quitar cursos

const botonesAgregar = document.querySelectorAll("[data-curso]");
const botonesQuitar = document.querySelectorAll("[data-cerrar]");

// Guardar las tarjetas de los tres cursos

const tarjetas = {
    ingles: document.getElementById("card-ingles-progreso"),
    aleman: document.getElementById("card-aleman-progreso"),
    chino: document.getElementById("card-chino-progreso")
};

// Guardar los nombres y archivos de cada idioma

const nombres = {
    ingles: "Inglés",
    aleman: "Alemán",
    chino: "Chino Mandarín"
};

const archivos = {
    ingles: "progreso-ingles.html",
    aleman: "progreso-aleman.html",
    chino: "progreso-chino.html"
};

// Obtener los elementos de Home

const saludo = document.getElementById("titulo-bienvenida");
const aviso = document.getElementById("mensajeSinCursos");
const continuar = document.querySelector(".boton-sc1 a");

// Recuperar el usuario que inició sesión

const usuario = obtenerUsuarioActivo();

// Recuperar los cursos agregados por el usuario

let seleccionados = usuario && Array.isArray(usuario.cursosSeleccionados)
    ? [...usuario.cursosSeleccionados]
    : [];

// Calcular el progreso de un curso

function progresoDe(id) {

    const actual = obtenerUsuarioActivo();

    const curso = (((actual || {}).cursos || {})[id]) || {};

    const completadas = curso.leccionesCompletadas || [];
    const aprobados = curso.examenesAprobados || [];

    let cantidad = 0;

    // Contar las actividades completadas de cada nivel

    for (const nivel of ["a", "b", "c"]) {

        for (const tipo of ["listening", "vocabulario", "gramatica"]) {

            const clave = nivel === "a" && tipo === "listening"
                ? id + "-1"
                : id + "-" + nivel + "-" + tipo;

            if (completadas.includes(clave)) {
                cantidad++;
            }

        }

        // Contar los exámenes aprobados

        if (aprobados.includes(nivel)) {
            cantidad++;
        }

    }

    // Determinar qué nivel puede realizar el usuario

    const nivelActual = aprobados.includes("b")
        ? "c"
        : aprobados.includes("a")
            ? "b"
            : "a";

    const titulo = nivelActual === "a"
        ? "A1 - A2"
        : nivelActual === "b"
            ? "B1 - B2"
            : "C1 - C2";

    const suffix = nivelActual === "a"
        ? "A1A2"
        : nivelActual === "b"
            ? "B1B2"
            : "C1C2";

    // Construir el enlace al nivel correspondiente

    const url = "../3_Vista Mapa de Unidades/" +
        archivos[id] +
        "#" +
        id +
        suffix;

    // El curso tiene 9 actividades y 3 exámenes

    return {
        porcentaje: Math.round(cantidad / 12 * 100),
        titulo: titulo,
        url: url
    };

}

// Actualizar el título, porcentaje y botón de cada curso

function refrescarTarjeta(id) {

    const tarjeta = tarjetas[id];

    if (!tarjeta) {
        return;
    }

    const datos = progresoDe(id);

    const titulo = tarjeta.querySelector(".curso");
    const porcentaje = tarjeta.querySelector(".unidad span");
    const barra = tarjeta.querySelector("progress");
    const enlace = tarjeta.querySelector(".boton-cards a");

    if (titulo) {
        titulo.textContent = "Curso: " + nombres[id] + " " + datos.titulo;
    }

    if (porcentaje) {
        porcentaje.textContent = datos.porcentaje + "%";
    }

    if (barra) {
        barra.value = datos.porcentaje;
        barra.textContent = datos.porcentaje + "%";
    }

    if (enlace) {

        enlace.href = datos.url;

        enlace.textContent = datos.porcentaje
            ? "Reanudar"
            : "Empezar";

        enlace.setAttribute(
            "aria-label",
            "Continuar curso de " + nombres[id] + " " + datos.titulo
        );

    }

}

// Mostrar solamente los cursos seleccionados

function mostrarCursos() {

    Object.keys(tarjetas).forEach(function(id) {

        if (!tarjetas[id]) {
            return;
        }

        tarjetas[id].style.display = seleccionados.includes(id)
            ? "grid"
            : "none";

        if (seleccionados.includes(id)) {
            refrescarTarjeta(id);
        }

    });

    // Mostrar un aviso si no hay cursos seleccionados

    if (aviso) {
        aviso.style.display = seleccionados.length ? "none" : "flex";
    }

    // Actualizar el botón principal de bienvenida

    if (continuar) {

        const primero = seleccionados.find(function(id) {
            return archivos[id];
        });

        if (primero) {

            const datos = progresoDe(primero);

            continuar.href = datos.url;

            continuar.textContent =
                "Continuar lección: " +
                nombres[primero] +
                " " +
                datos.titulo;

        } else {

            continuar.href = "#seccion-2";
            continuar.textContent = "Explorar cursos";

        }

    }

}

// Guardar los cursos seleccionados en la cuenta

function guardarCursos() {

    return !!usuario && actualizarUsuario({
        cursosSeleccionados: [...seleccionados]
    });

}

// Agregar un curso

function agregarCurso(id) {

    if (!tarjetas[id] || seleccionados.includes(id)) {
        return;
    }

    seleccionados.push(id);

    if (!guardarCursos()) {

        seleccionados = seleccionados.filter(function(curso) {
            return curso !== id;
        });

        alert("No se pudo guardar el curso.");

    }

    mostrarCursos();

}

// Quitar un curso

function quitarCurso(id) {

    if (!seleccionados.includes(id)) {
        return;
    }

    const anterior = [...seleccionados];

    seleccionados = seleccionados.filter(function(curso) {
        return curso !== id;
    });

    if (!guardarCursos()) {

        seleccionados = anterior;

        alert("No se pudo quitar el curso.");

    }

    mostrarCursos();

}

// Conectar los botones Agregar Curso

botonesAgregar.forEach(function(boton) {

    boton.addEventListener("click", function() {

        agregarCurso(boton.dataset.curso);

    });

});

// Conectar los botones para quitar cursos

botonesQuitar.forEach(function(boton) {

    boton.addEventListener("click", function() {

        quitarCurso(boton.dataset.cerrar);

    });

});

// Mostrar la bienvenida personalizada

if (usuario && saludo) {

    saludo.textContent =
        "Hola bienvenido " + usuario.usuario + ".";

}

// Inicializar Home

mostrarCursos();
