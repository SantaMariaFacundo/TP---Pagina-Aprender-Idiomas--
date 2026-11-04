/**
 * Cuentas de demostración de GrammaTech.
 *
 * Se cargan la primera vez que se abre la aplicación,
 * cuando todavía no hay usuarios guardados en localStorage.
 * Sirven para que la tabla de clasificación tenga participantes.
 *
 * Todas usan la contraseña "Demo123456".
 */
export const USUARIOS_DEMO = [
    { id: "demo-1", nombre: "Sofía Martínez", usuario: "@sofi.martinez", correo: "sofia@demo.com", liga: "bronce", xpSemanal: 180, xp: 640, racha: 6, monedas: 240 },
    { id: "demo-2", nombre: "Lucas Gómez", usuario: "@lucasg", correo: "lucas@demo.com", liga: "bronce", xpSemanal: 150, xp: 420, racha: 4, monedas: 150 },
    { id: "demo-3", nombre: "Valentina Ruiz", usuario: "@vale.ruiz", correo: "valentina@demo.com", liga: "bronce", xpSemanal: 120, xp: 380, racha: 3, monedas: 90 },
    { id: "demo-4", nombre: "Mateo Fernández", usuario: "@mateof", correo: "mateo@demo.com", liga: "bronce", xpSemanal: 90, xp: 210, racha: 2, monedas: 60 },
    { id: "demo-5", nombre: "Camila López", usuario: "@cami.lopez", correo: "camila@demo.com", liga: "bronce", xpSemanal: 60, xp: 150, racha: 1, monedas: 30 },
    { id: "demo-6", nombre: "Tomás Díaz", usuario: "@tomidiaz", correo: "tomas@demo.com", liga: "bronce", xpSemanal: 20, xp: 40, racha: 0, monedas: 0 },
    { id: "demo-7", nombre: "Martina Sosa", usuario: "@martu.sosa", correo: "martina@demo.com", liga: "plata", xpSemanal: 260, xp: 1250, racha: 12, monedas: 400 },
    { id: "demo-8", nombre: "Joaquín Pérez", usuario: "@joaco.perez", correo: "joaquin@demo.com", liga: "plata", xpSemanal: 200, xp: 980, racha: 8, monedas: 320 },
    { id: "demo-9", nombre: "Julieta Romero", usuario: "@juli.romero", correo: "julieta@demo.com", liga: "oro", xpSemanal: 340, xp: 2100, racha: 20, monedas: 600 }
];

/**
 * Opiniones de ejemplo para que los cursos no aparezcan vacíos.
 * Cada opinión guarda el id de quien la publicó y el curso.
 */
export const OPINIONES_DEMO = [
    { id: "op-1", curso: "ingles", usuarioId: "demo-7", puntuacion: 5, comentario: "Las actividades de listening me ayudaron un montón.", fecha: "2026-10-28" },
    { id: "op-2", curso: "ingles", usuarioId: "demo-2", puntuacion: 4, comentario: "Muy bueno, me gustaría que tuviera más ejercicios por nivel.", fecha: "2026-10-30" },
    { id: "op-3", curso: "aleman", usuarioId: "demo-1", puntuacion: 4, comentario: "Ordenar las palabras es difícil al principio pero se aprende rápido.", fecha: "2026-10-29" },
    { id: "op-4", curso: "chino", usuarioId: "demo-9", puntuacion: 5, comentario: "Nunca había estudiado chino y lo pude seguir sin problemas.", fecha: "2026-10-31" }
];
