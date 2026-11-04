import "../../js/header.js";
import "../../js/buscador.js";

import { obtenerUsuarioActivo, actualizarUsuario, obtenerRachaActual } from "../../js/usuarios.js";



const rachaActual = document.getElementById("racha-actual");
const xpDiario = document.getElementById("xp-diario");
const xpTotal = document.getElementById("xp-total");

const barraMetaDiaria = document.getElementById("barra-meta-diaria");
const mensajeMetaDiaria = document.getElementById("mensaje-meta-diaria");

const cantidadMonedas = document.getElementById("cantidad-monedas");
const botonDobleXp = document.getElementById("btn-doble-xp");
const mensajeTienda = document.getElementById("mensaje-tienda");

const diasSemana = document.querySelectorAll(".dias-semana .dia");


const META_DIARIA = 40;


const usuarioActivo = obtenerUsuarioActivo();


function obtenerFechaLocal(fecha = new Date()) {

    const anio = fecha.getFullYear();

    const mes = String(fecha.getMonth() + 1).padStart(2, "0");

    const dia = String(fecha.getDate()).padStart(2, "0");

    return anio + "-" + mes + "-" + dia;

}


function mostrarMensajeTienda(texto, correcto = false) {

    if (!mensajeTienda) {
        return;
    }

    mensajeTienda.textContent = texto;

    mensajeTienda.style.color = correcto ? "#2A9C8D" : "#c0392b";

    mensajeTienda.style.textAlign = "center";

    mensajeTienda.style.fontWeight = "bold";

}


function mostrarRacha(usuario) {

    if (!rachaActual) {
        return;
    }

    const racha = obtenerRachaActual(usuario);

    rachaActual.textContent =
        racha + (racha === 1 ? " día" : " días");

}


function mostrarExperiencia(usuario) {

    if (!xpTotal) {
        return;
    }

    const experiencia = Number(usuario.xp) || 0;

    xpTotal.textContent = experiencia + " XP";

}


function mostrarMetaDiaria(usuario) {


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


function mostrarDiasSemana(usuario) {


    const fechasActividad = Array.isArray(usuario.diasActividad)
        ? usuario.diasActividad
        : [];

    const hoy = new Date();


    const lunes = new Date(hoy);

    const diaActual = hoy.getDay();

    const diferencia = diaActual === 0 ? -6 : 1 - diaActual;

    lunes.setDate(hoy.getDate() + diferencia);


    diasSemana.forEach(function (elemento, indice) {

        const fecha = new Date(lunes);

        fecha.setDate(lunes.getDate() + indice);

        const fechaTexto = obtenerFechaLocal(fecha);

        const completado = fechasActividad.includes(fechaTexto);

        const estado = elemento.querySelector("span");


        elemento.classList.toggle("completado", completado);

        elemento.classList.toggle("pendiente", !completado);

        if (estado) {

            estado.textContent = completado
                ? "Completado"
                : "Pendiente";

        }

    });

}


function mostrarMonedas(usuario) {

    if (!cantidadMonedas) {
        return;
    }

    const monedas = Number(usuario.monedas) || 0;

    cantidadMonedas.textContent = monedas;

}


function actualizarBotonDobleXp(usuario) {

    if (!botonDobleXp) {
        return;
    }

    const monedas = Number(usuario.monedas) || 0;

    const precio = Number(botonDobleXp.dataset.precio) || 300;


    if (usuario.dobleXpPendiente === true) {

        botonDobleXp.textContent = "Beneficio adquirido";

        botonDobleXp.disabled = true;

        return;

    }


    if (monedas < precio) {

        botonDobleXp.textContent = "Monedas insuficientes";

        botonDobleXp.disabled = true;

        return;

    }

    botonDobleXp.textContent = "Canjear";

    botonDobleXp.disabled = false;

}


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


function canjearDobleXp() {


    const usuario = obtenerUsuarioActivo();

    if (!usuario) {
        return;
    }

    const precio = Number(botonDobleXp.dataset.precio) || 300;

    const monedas = Number(usuario.monedas) || 0;


    if (usuario.dobleXpPendiente === true) {

        mostrarMensajeTienda(
            "Ya tenés un beneficio de Doble XP pendiente."
        );

        return;

    }


    if (monedas < precio) {

        mostrarMensajeTienda(
            "No tenés monedas suficientes para este canje."
        );

        return;

    }


    actualizarUsuario({
        monedas: monedas - precio,
        dobleXpPendiente: true
    });


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


if (botonDobleXp) {

    botonDobleXp.addEventListener("click", canjearDobleXp);

}


if (!usuarioActivo) {

    window.location.replace("../1_Vista Login/login.html");

} else {

    actualizarTienda();

}
