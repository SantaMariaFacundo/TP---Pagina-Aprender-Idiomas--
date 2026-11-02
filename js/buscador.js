// Buscador compartido: localiza cursos y secciones que existen en GrammaTech.
import { obtenerUsuarioActivo } from "./usuarios.js";

const raiz = new URL("../", import.meta.url);

const opcionesBusqueda = [
    { palabras: ["ingles", "english", "curso de ingles"], ruta: "SubPaginasWeb/3_Vista Mapa de Unidades/progreso-ingles.html", privada: true },
    { palabras: ["aleman", "german", "curso de aleman"], ruta: "SubPaginasWeb/3_Vista Mapa de Unidades/progreso-aleman.html", privada: true },
    { palabras: ["chino", "mandarin", "curso de chino"], ruta: "SubPaginasWeb/3_Vista Mapa de Unidades/progreso-chino.html", privada: true },
    { palabras: ["perfil", "mi cuenta", "usuario"], ruta: "SubPaginasWeb/5_Vista Perfil Usuario/perfilUsuario.html", privada: true },
    { palabras: ["editar perfil", "editar cuenta", "datos personales"], ruta: "SubPaginasWeb/5_Vista Perfil Usuario/editarPerfil.html", privada: true },
    { palabras: ["clasificacion", "ranking", "liga", "posiciones"], ruta: "SubPaginasWeb/6_Vista Tabla Clasificación/clasificacion.html", privada: true },
    { palabras: ["tienda", "monedas", "racha", "xp", "meta diaria"], ruta: "SubPaginasWeb/7_Vista Racha/tienda.html", privada: true },
    { palabras: ["vocabulario", "repaso", "palabras"], ruta: "SubPaginasWeb/2_Vista home/home.html#titulo-repaso-vocabulario", privada: true },
    { palabras: ["cursos", "curso", "idiomas", "aprender", "home"], ruta: "SubPaginasWeb/2_Vista home/home.html#seccion-2", privada: true },
    { palabras: ["registro", "registrarse", "crear cuenta"], ruta: "SubPaginasWeb/1_Vista Login/Vista Registro/registro.html", privada: false },
    { palabras: ["login", "iniciar sesion", "acceder"], ruta: "SubPaginasWeb/1_Vista Login/login.html", privada: false },
    { palabras: ["inicio", "principal", "grammatech"], ruta: "index.html", privada: false }
];

function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "").trim();
}

// Solo tenemos páginas de cursos y secciones; no hay un buscador de becas ni diccionario.
document.querySelectorAll(".conteiner-search").forEach(function(formulario) {
    const campo = formulario.querySelector('input[type="search"], input');
    const lupa = formulario.querySelector(".img-search");
    if (!campo) return;

    campo.placeholder = "Buscar cursos y secciones...";
    campo.setAttribute("aria-label", "Buscar cursos o secciones de GrammaTech");

    if (lupa) {
        lupa.setAttribute("role", "button");
        lupa.setAttribute("tabindex", "0");
        lupa.setAttribute("aria-label", "Buscar");
        lupa.addEventListener("click", function() { formulario.requestSubmit(); });
        lupa.addEventListener("keydown", function(evento) {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                formulario.requestSubmit();
            }
        });
    }

    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();
        const consulta = normalizar(campo.value);
        if (!consulta) {
            campo.focus();
            return;
        }

        // Priorizamos coincidencias exactas para no confundir "editar perfil" con "perfil".
        let resultado = opcionesBusqueda.find(function(opcion) {
            return opcion.palabras.some(function(palabra) {
                return normalizar(palabra) === consulta;
            });
        });
        if (!resultado) {
            resultado = opcionesBusqueda.find(function(opcion) {
                return opcion.palabras.some(function(palabra) {
                    return normalizar(palabra).includes(consulta) || consulta.includes(normalizar(palabra));
                });
            });
        }

        if (!resultado) {
            alert("No encontramos esa sección. Probá con Inglés, Alemán, Chino, Perfil, Tienda, Clasificación o Vocabulario.");
            return;
        }
        if (resultado.privada && !obtenerUsuarioActivo()) {
            alert("Para acceder a esa sección, primero iniciá sesión.");
            window.location.href = new URL("SubPaginasWeb/1_Vista Login/login.html", raiz).href;
            return;
        }
        window.location.href = new URL(resultado.ruta, raiz).href;
    });
});
