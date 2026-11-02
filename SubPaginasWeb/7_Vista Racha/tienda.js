// Importamos los módulos compartidos necesarios para esta página.
import "../../js/header.js";
import "../../js/buscador.js";

// Importamos las funciones de usuarios utilizadas en esta vista.
import { obtenerUsuarioActivo, actualizarUsuario } from "../../js/usuarios.js";


// Obtener los elementos del HTML

const rachaActual = document.getElementById("racha-actual");
const xpDiario = document.getElementById("xp-diario");
const xpTotal = document.getElementById("xp-total");

const barraMetaDiaria = document.getElementById("barra-meta-diaria");
const mensajeMetaDiaria = document.getElementById("mensaje-meta-diaria");

const cantidadMonedas = document.getElementById("cantidad-monedas");
const botonDobleXp = document.getElementById("btn-doble-xp");
const mensajeTienda = document.getElementById("mensaje-tienda");

const diasSemana = document.querySelectorAll(".dias-semana .dia");

// Establecer la meta de experiencia diaria

const META_DIARIA = 40;

// Obtener el usuario que inició sesión

const usuarioActivo = obtenerUsuarioActivo();

// Obtener la fecha actual en formato YYYY-MM-DD

function obtenerFechaLocal(fecha = new Date()) {

    const anio = fecha.getFullYear();

    const mes = String(fecha.getMonth() + 1).padStart(2, "0");

    const dia = String(fecha.getDate()).padStart(2, "0");

    return anio + "-" + mes + "-" + dia;

}

// Mostrar un mensaje al usuario

function mostrarMensajeTienda(texto, correcto = false) {

    if (!mensajeTienda) {
        return;
    }

    mensajeTienda.textContent = texto;

    mensajeTienda.style.color = correcto ? "#2A9C8D" : "#c0392b";

    mensajeTienda.style.textAlign = "center";

    mensajeTienda.style.fontWeight = "bold";

}

// Mostrar la racha actual

function mostrarRacha(usuario) {

    if (!rachaActual) {
        return;
    }

    const racha = Number(usuario.racha) || 0;

    rachaActual.textContent =
        racha + (racha === 1 ? " día" : " días");

}

// Mostrar la experiencia acumulada

function mostrarExperiencia(usuario) {

    if (!xpTotal) {
        return;
    }

    const experiencia = Number(usuario.xp) || 0;

    xpTotal.textContent = experiencia + " XP";

}

// Mostrar el progreso de la meta diaria

function mostrarMetaDiaria(usuario) {

    // Usar XP diarios solamente si corresponden a hoy

    const hoy = obtenerFechaLocal();

    const experienciaHoy =
        usuario.fechaXpDiario === hoy
            ? Number(usuario.xpDiario) || 0
            : 0;

    if (xpDiario) {

        xpDiario.textContent =
            experienciaHoy + " / " + META_DIARIA + " XP";

    }

    if (barraMetaDiaria) {

        barraMetaDiaria.value = Math.min(
            experienciaHoy,
            META_DIARIA
        );

        barraMetaDiaria.max = META_DIARIA;

    }

    if (mensajeMetaDiaria) {

        if (experienciaHoy >= META_DIARIA) {

            mensajeMetaDiaria.textContent =
                "¡Felicitaciones! Alcanzaste tu meta diaria.";

        } else {

            const faltantes = META_DIARIA - experienciaHoy;

            mensajeMetaDiaria.textContent =
                "Te faltan " + faltantes +
                " XP para alcanzar tu meta diaria.";

        }

    }

}

// Mostrar los días registrados de esta semana

function mostrarDiasSemana(usuario) {

    // Obtener las fechas en las que el usuario estudió

    const fechasActividad = Array.isArray(usuario.diasActividad)
        ? usuario.diasActividad
        : [];

    const hoy = new Date();

    // Calcular el lunes de la semana actual

    const lunes = new Date(hoy);

    const diaActual = hoy.getDay();

    const diferencia = diaActual === 0 ? -6 : 1 - diaActual;

    lunes.setDate(hoy.getDate() + diferencia);

    // Recorrer los siete días de la semana

    diasSemana.forEach(function (elemento, indice) {

        const fecha = new Date(lunes);

        fecha.setDate(lunes.getDate() + indice);

        const fechaTexto = obtenerFechaLocal(fecha);

        const completado = fechasActividad.includes(fechaTexto);

        const estado = elemento.querySelector("span");

        // Marcar solamente días registrados

        elemento.classList.toggle("completado", completado);

        elemento.classList.toggle("pendiente", !completado);

        if (estado) {

            estado.textContent = completado
                ? "Completado"
                : "Pendiente";

        }

    });

}

// Mostrar la cantidad de monedas

function mostrarMonedas(usuario) {

    if (!cantidadMonedas) {
        return;
    }

    const monedas = Number(usuario.monedas) || 0;

    cantidadMonedas.textContent = monedas;

}

// Actualizar el estado del producto Doble XP

function actualizarBotonDobleXp(usuario) {

    if (!botonDobleXp) {
        return;
    }

    const monedas = Number(usuario.monedas) || 0;

    const precio = Number(botonDobleXp.dataset.precio) || 300;

    // Comprobar si el usuario ya tiene el beneficio pendiente

    if (usuario.dobleXpPendiente === true) {

        botonDobleXp.textContent = "Beneficio adquirido";

        botonDobleXp.disabled = true;

        return;

    }

    // Permitir el canje solamente con monedas suficientes

    if (monedas < precio) {

        botonDobleXp.textContent = "Monedas insuficientes";

        botonDobleXp.disabled = true;

        return;

    }

    botonDobleXp.textContent = "Canjear";

    botonDobleXp.disabled = false;

}

// Actualizar todos los datos de la tienda

function actualizarTienda() {

    const usuario = obtenerUsuarioActivo();

    if (!usuario) {
        return;
    }

    mostrarRacha(usuario);

    mostrarExperiencia(usuario);

    mostrarMetaDiaria(usuario);

    mostrarDiasSemana(usuario);

    mostrarMonedas(usuario);

    actualizarBotonDobleXp(usuario);

}

// Comprar el beneficio Doble XP

function canjearDobleXp() {

    // Obtener los datos más recientes del usuario

    const usuario = obtenerUsuarioActivo();

    if (!usuario) {
        return;
    }

    const precio = Number(botonDobleXp.dataset.precio) || 300;

    const monedas = Number(usuario.monedas) || 0;

    // Evitar comprar dos veces el mismo beneficio

    if (usuario.dobleXpPendiente === true) {

        mostrarMensajeTienda(
            "Ya tenés un beneficio de Doble XP pendiente."
        );

        return;

    }

    // Verificar que tenga monedas suficientes

    if (monedas < precio) {

        mostrarMensajeTienda(
            "No tenés monedas suficientes para este canje."
        );

        return;

    }

    // Descontar las monedas y guardar el beneficio

    actualizarUsuario({
        monedas: monedas - precio,
        dobleXpPendiente: true
    });

    // Comprobar que se haya guardado correctamente

    const usuarioActualizado = obtenerUsuarioActivo();

    if (
        usuarioActualizado &&
        usuarioActualizado.dobleXpPendiente === true &&
        Number(usuarioActualizado.monedas) === monedas - precio
    ) {

        mostrarMensajeTienda(
            "¡Canje realizado! Tu Doble XP está listo para usar.",
            true
        );

    } else {

        mostrarMensajeTienda(
            "No se pudo guardar el canje. Intentá nuevamente."
        );

    }

    actualizarTienda();

}

// Conectar el botón Canjear

if (botonDobleXp) {

    botonDobleXp.addEventListener("click", canjearDobleXp);

}

// Inicializar la tienda

if (!usuarioActivo) {

    window.location.replace("../1_Vista Login/login.html");

} else {

    actualizarTienda();

}
