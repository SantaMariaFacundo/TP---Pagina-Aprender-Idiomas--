// El traductor utiliza los datos de la sesión desde el módulo de usuarios.
import { obtenerUsuarioActivo, actualizarUsuario } from "./usuarios.js";


(function () {

    // Diccionario compartido de GrammaTech.
    const traducciones = {

        // HEADER
        "Acceder": "Log in",
        "Registrate": "Sign up",
        "Cursos": "Courses",
        "Perfil": "Profile",
        "Clasificación": "Leaderboard",
        "Tienda": "Shop",
        "Cerrar sesión": "Log out",
        "Volver": "Back",
        "¿Aún no tenés cuenta?": "Don't have an account yet?",
        "¿Ya tenés cuenta?": "Already have an account?",
        "Iniciá sesión": "Log in",

        // FOOTER
        "Condiciones Generales": "Terms and Conditions",
        "Aviso Legal": "Legal Notice",
        "Privacidad": "Privacy",
        "Cookies": "Cookies",
        "Accesibilidad": "Accessibility",
        "Soporte y Ayuda": "Support and Help",
        "© Todos los derechos reservados, 2026, GrammaTech.":
            "© All rights reserved, 2026, GrammaTech.",
        "© Todos los derechos reservados, 2026, Gramatech.":
            "© All rights reserved, 2026, GrammaTech.",

        // INDEX
        "APRENDE CON CLASES PARA TI PROGRESA DE VERDAD.":
            "LEARN WITH CLASSES MADE FOR YOU. MAKE REAL PROGRESS.",
        "Inscribirte al curso de idiomas GrammaTech revolucionará tu aprendizaje mediante tecnología adaptativa de vanguardia. Diseñado para optimizar tu fluidez en tiempo récord, combinarás gramática práctica, tutoría interactiva constante y ejercicios inmersivos para comunicarte con total seguridad y abrir nuevas oportunidades.":
            "Joining GrammaTech will transform the way you learn languages through adaptive technology. Improve your fluency with practical grammar, interactive guidance and immersive exercises to communicate confidently and discover new opportunities.",
        "COMENZAR A EXPLORAR": "START EXPLORING",
        "CURSOS DISPONIBLES": "AVAILABLE COURSES",
        "Aprendé Inglés a tu ritmo": "Learn English at your own pace",
        "Aprendé Alemán paso a paso": "Learn German step by step",
        "Descubrí el Chino Mandarín": "Discover Mandarin Chinese",
        "Descubrí todos los cursos disponibles, desde nivel inicial hasta avanzado. Elegí el que mejor se adapte a vos y empezá hoy mismo.":
            "Discover our courses, from beginner to advanced. Choose the one that suits you best and start today.",
        "Accedé a cursos para cada nivel, desde principiante hasta avanzado. Iniciá tu camino en el idioma más hablado del mundo y ampliá tus oportunidades.":
            "Explore courses for every level, from beginner to advanced. Start learning one of the world's most widely spoken languages and expand your opportunities.",
        "Explorá todos los cursos disponibles, desde nivel inicial hasta avanzado. Elegí tu nivel y empezá a dominar el idioma más hablado en Europa.":
            "Explore all available courses, from beginner to advanced. Choose your level and start mastering one of Europe's most widely spoken languages.",
        "Ver curso": "View course",
        "Mucho mas cursos y becas: impacto en la vida de las personas":
            "More courses and scholarships: making a difference in people's lives",
        "Gramatech es la plataforma de aprendizaje de idiomas numero uno del mundo, cuenta con los mejores profesores y cursos.":
            "GrammaTech is a language-learning platform offering courses and learning resources.",
        "4 años": "4 years",
        "Apoyando la educación, La empleabilidad y el emprendimiento.":
            "Supporting education, employability and entrepreneurship.",
        "Personas y empresas ayudadas desde entonces.":
            "People and businesses supported since then.",
        "Al finalizar tu curso, obtené un certificado para sumar a tu CV y LinkedIn y demostrar tus nuevos conocimientos.":
            "After completing your course, earn a certificate to add to your CV and LinkedIn and showcase your new skills.",

        // LOGIN
        "Ingresá tus datos:": "Enter your details:",
        "Email": "Email",
        "Contraseña": "Password",
        "Iniciar Sesión": "Log in",
        "¿No tenés cuenta en GrammaTech? Registrate":
            "Don't have a GrammaTech account? Sign up",
        "¿No tenes cuenta en GrammaTech? Registrate":
            "Don't have a GrammaTech account? Sign up",

        // RECUPERACIÓN
        "¿Olvidaste tu contraseña?": "Forgot your password?",
        "Recuperar contraseña": "Recover password",
        "Ingresá el correo electrónico asociado a tu cuenta.":
            "Enter the email address associated with your account.",
        "Recuperar": "Recover",
        "Volver a iniciar sesión": "Back to login",
        "Ingresá tu correo electrónico.": "Enter your email address.",
        "No encontramos una cuenta registrada con ese correo.":
            "We couldn't find an account with that email address.",
        "Encontramos tu cuenta. La recuperación se completó como simulación: no se envió ningún correo y tu contraseña sigue siendo la misma.":
            "We found your account. This was a simulated recovery: no email was sent and your password remains unchanged.",

        // REGISTRO
        "Registrate con:": "Sign up with:",
        "O rellená tus datos:": "Or enter your details:",
        "Nombre": "First name",
        "Apellido": "Last name",
        "País de residencia": "Country of residence",
        "Seleccioná un país": "Select a country",
        "Argentina": "Argentina",
        "Brasil": "Brazil",
        "Chile": "Chile",
        "Fecha de nacimiento": "Date of birth",
        "Mínimo 10 caracteres": "At least 10 characters",
        "Una mayúscula": "One uppercase letter",
        "Una minúscula": "One lowercase letter",
        "Un número": "One number",
        "Repetir contraseña": "Confirm password",
        "He leído y acepto la": "I have read and accept the",
        "Política de Privacidad, Condiciones generales de uso y Política de Cookies.":
            "Privacy Policy, Terms of Use and Cookie Policy.",
        "Registrarme": "Sign up",
        "¿Ya tenés cuenta en GrammaTech? Iniciá sesión":
            "Already have a GrammaTech account? Log in",

        // HOME
        "listo para aprender hoy.": "ready to learn today.",
        "El esfuerzo que ponés hoy es la llave que abre las puertas de tu futuro. Cada hora de estudio es una inversión en vos mismo.":
            "Today's effort opens the doors to your future. Every hour of study is an investment in yourself.",
        "MINUTOS HOY": "MINUTES TODAY",
        "NUEVAS PALABRAS": "NEW WORDS",
        "PRECISIÓN": "ACCURACY",
        "Ritmo de Aprendizaje": "Learning Pace",
        "horas registradas esta semana": "hours recorded this week",
        "Agregar Curso": "Add Course",
        "Aprendé el Chino Mandarín": "Learn Mandarin Chinese",
        "Cursos en Progreso": "Courses in Progress",
        "¡Todavia no tenés cursos en progreso!":
            "You don't have any courses in progress yet!",
        "Eligí un idioma y empezá a aprender algo nuevo hoy.":
            "Choose a language and start learning something new today.",
        "Explorar Cursos": "Explore Courses",
        "Explorar cursos": "Explore courses",
        "Reanudar": "Resume",
        "Empezar": "Start",
        "Curso:": "Course:",
        "Continuar curso de": "Continue",
        "Continuar lección:": "Continue lesson:",
        "Inglés": "English",
        "Alemán": "German",
        "Chino": "Chinese",
        "Chino Mandarín": "Mandarin Chinese",
        "Dominio del vocabulario, listening y gramatica.":
            "Practice vocabulary, listening and grammar.",
        "Meta Diaria": "Daily Goal",
        "¡A solo una lección corta para completar la racha de hoy!":
            "Just one short lesson away from completing today's streak!",
        "Inicio del dia": "Start of the day",
        "Logros Recientes": "Recent Achievements",
        "Ver Racha": "View Streak",
        "Poliglota Constante": "Consistent Polyglot",
        "14 días estudiando sin interrupción":
            "14 days studying without interruption",
        "Listening Implecable": "Excellent Listening",
        "Acertaste el 90% del dialogo":
            "You answered 90% of the dialogue correctly.",
        "Vocabulario Brillante": "Brilliant Vocabulary",
        "Mas de 100 palabras aprendidas":
            "More than 100 words learned",
        "Repaso Diario de Vocabulario": "Daily Vocabulary Review",
        "Idioma: Ingles": "Language: English",
        "INGLÉS A1 - A2 • VERBO": "ENGLISH A1 - A2 • VERB",
        "INGLÉS A1 - A2 • ADJETIVO": "ENGLISH A1 - A2 • ADJECTIVE",
        "Hacer algo mejor o avanzar en una habilidad.":
            "To make something better or improve a skill.",
        "Sentirse sin energía o con ganas de descansar.":
            "Feeling low on energy or wanting to rest.",
        "No recordar algo que sabías o que tenías que hacer.":
            "Not remembering something you knew or had to do.",
        "Tener muchas cosas que hacer o poco tiempo libre.":
            "Having many things to do or little free time.",

        // MAPAS
        "Inglés A1 - A2": "English A1 - A2",
        "Inglés B1 - B2": "English B1 - B2",
        "Inglés C1 - C2": "English C1 - C2",
        "Alemán A1 - A2": "German A1 - A2",
        "Alemán B1 - B2": "German B1 - B2",
        "Alemán C1 - C2": "German C1 - C2",
        "Chino A1 - A2": "Chinese A1 - A2",
        "Chino B1 - B2": "Chinese B1 - B2",
        "Chino C1 - C2": "Chinese C1 - C2",
        "Listening": "Listening",
        "Vocabulario": "Vocabulary",
        "Gramática": "Grammar",
        "Examen": "Exam",
        "Ir al curso": "Go to lesson",
        "Próximamente": "Coming soon",
        "Examen aprobado": "Exam passed",

        // LECCIONES
        "Vidas: 3": "Lives: 3",
        "Elegí la traducción correcta:": "Choose the correct translation:",
        "Completá la oración:": "Complete the sentence:",
        "Completá la frase:": "Complete the phrase:",
        "Completa la frase:": "Complete the phrase:",
        "Traducí la siguiente oración:": "Translate the following sentence:",
        "Traduce la siguiente oración:": "Translate the following sentence:",
        "Ordená la traducción correcta:": "Put the translation in order:",
        "Banco de palabras disponibles:": "Available word bank:",
        "Comprobar": "Check",
        "Seleccioná una respuesta antes de comprobar.":
            "Choose an answer before checking.",
        "Respuesta incorrecta. ¡Intentá otra vez!":
            "Incorrect answer. Try again!",
        "¡Correcto! Ya completaste esta actividad.":
            "Correct! You've already completed this activity.",
        "Esta lección todavía no está configurada.":
            "This lesson isn't configured yet.",
        "No se pudo guardar el progreso.":
            "Your progress couldn't be saved.",

        // EXÁMENES
        '¿Cómo se dice "Yo soy" en inglés?':
            'How do you say "I am" in English?',
        '¿Cómo se dice "Yo soy" en alemán?':
            'How do you say "I am" in German?',
        "Completá también el ejercicio de Listening.":
            "Complete the Listening exercise too.",
        "Ordená las palabras para traducir la frase.":
            "Arrange the words to translate the sentence.",
        "Volver al mapa de unidades": "Back to the unit map",
        "Volver al mapa": "Back to the map",
        "¡Excelente! Ya habías aprobado este examen.":
            "Excellent! You've already passed this exam.",
        "¡Felicitaciones! Aprobaste el examen y guardamos tu progreso.":
            "Congratulations! You passed and your progress was saved.",
        "No se pudo guardar la aprobación. Intentá nuevamente.":
            "Your exam result couldn't be saved. Try again.",
        "Este examen todavía no está configurado.":
            "This exam isn't configured yet.",

        // PERFIL
        "MI PERFIL": "MY PROFILE",
        "Gestioná tus datos personales y tu progreso en GrammaTech.":
            "Manage your personal information and progress on GrammaTech.",
        "Editar": "Edit",
        "DATOS DE LA CUENTA": "ACCOUNT DETAILS",
        "Nombre completo:": "Full name:",
        "Nombre de usuario:": "Username:",
        "Nombre completo": "Full name",
        "Nombre de usuario": "Username",
        "Correo electrónico": "Email address",
        "Miembro desde:": "Member since:",
        "Idioma principal de la interfaz": "Main interface language",
        "Español": "Spanish",
        "SEGURIDAD": "SECURITY",
        "Contraseña actual": "Current password",
        "Nueva contraseña": "New password",
        "Confirmar nueva contraseña": "Confirm new password",
        "Cambiar contraseña": "Change password",
        "Guardar nueva contraseña": "Save new password",
        "Guardar cambios": "Save changes",
        "MIS LOGROS": "MY ACHIEVEMENTS",
        "Liga Bronce": "Bronze League",
        "Liga Plata": "Silver League",
        "Liga Oro": "Gold League",
        "Posición actual en la clasificación.":
            "Current position on the leaderboard.",
        "Cinco días consecutivos aprendiendo.":
            "Five consecutive days of learning.",
        "Experiencia acumulada.": "Total experience earned.",

        // EDITAR PERFIL
        "EDITAR PERFIL": "EDIT PROFILE",
        "Modificá tus datos personales y la configuración de tu cuenta.":
            "Update your personal information and account settings.",
        "¡Cambios guardados correctamente!":
            "Changes saved successfully!",
        "¡Contraseña actualizada correctamente!":
            "Password updated successfully!",
        "Completá los tres campos de contraseña.":
            "Complete all three password fields.",
        "La nueva contraseña debe ser diferente de la actual.":
            "The new password must be different from the current one.",
        "No se pudo cambiar la contraseña.":
            "The password could not be changed.",

        // CONFIRMACIÓN
        "Cambios guardados": "Changes saved",
        "Tus cambios se guardaron exitosamente.":
            "Your changes were saved successfully.",
        "Volver al perfil": "Back to profile",

        // CLASIFICACIÓN
        "CLASIFICACIÓN": "LEADERBOARD",
        "Competí con otros estudiantes de GrammaTech y seguí tu progreso semanal.":
            "Compete with other GrammaTech students and track your weekly progress.",
        "Liga actual": "Current league",
        "LIGA BRONCE": "BRONZE LEAGUE",
        "LIGA PLATA": "SILVER LEAGUE",
        "LIGA ORO": "GOLD LEAGUE",
        "Los 5 primeros ascienden a la Liga de Plata esta semana.":
            "The top 5 move up to the Silver League this week.",
        "Los 5 primeros están en zona de ascenso a Plata.":
            "The top 5 are in the promotion zone for Silver.",
        "Los 3 primeros están en zona de ascenso a Oro.":
            "The top 3 are in the promotion zone for Gold.",
        "Competí por los primeros puestos.":
            "Compete for the top positions.",
        "Puesto": "Rank",
        "Avatar": "Avatar",
        "Usuario": "User",
        "XP semanal": "Weekly XP",
        "Estado": "Status",
        "TU POSICIÓN ESTA SEMANA": "YOUR RANK THIS WEEK",
        "Puesto actual": "Current rank",
        "XP esta semana": "XP this week",
        "XP para superar el primer puesto": "XP to overtake first place",
        "Todavía no hay usuarios en esta liga.":
            "There are no users in this league yet.",
        "Zona de ascenso": "Promotion zone",
        "Participando": "Competing",

        // TIENDA
        "TIENDA Y RACHAS": "SHOP AND STREAKS",
        "Mantené tu constancia, seguí tu progreso y conseguí recompensas.":
            "Stay consistent, track your progress and earn rewards.",
        "Racha actual": "Current streak",
        "Seguí practicando para mantenerla activa.":
            "Keep practicing to maintain your streak.",
        "Meta de hoy": "Today's goal",
        "Completá actividades para alcanzar tu meta.":
            "Complete activities to reach your goal.",
        "Experiencia total": "Total experience",
        "Todo lo que aprendiste hasta ahora suma.":
            "Everything you've learned so far adds up.",
        "TU RACHA ESTA SEMANA": "YOUR STREAK THIS WEEK",
        "Completá una actividad por día para mantener tu racha activa.":
            "Complete one activity a day to keep your streak going.",
        "Lun": "Mon",
        "Mar": "Tue",
        "Mié": "Wed",
        "Jue": "Thu",
        "Vie": "Fri",
        "Sáb": "Sat",
        "Dom": "Sun",
        "Pendiente": "Pending",
        "Completado": "Completed",
        "TIENDA DE RECOMPENSAS": "REWARDS SHOP",
        "Usá tus monedas para conseguir beneficios de estudio.":
            "Use your coins to get learning benefits.",
        "monedas": "coins",
        "Protector de racha": "Streak Freeze",
        "Protege tu racha durante un día si no podés completar una actividad.":
            "Protects your streak for one day if you cannot complete an activity.",
        "Vida extra": "Extra Life",
        "Sumá una vida para continuar practicando durante tus lecciones.":
            "Get an extra life to keep practicing during your lessons.",
        "Doble XP": "Double XP",
        "Duplicá la experiencia obtenida durante tus próximas actividades.":
            "Double the experience earned in your next activities.",
        "No disponible": "Unavailable",
        "Canjear": "Redeem",
        "Beneficio adquirido": "Reward purchased",
        "Monedas insuficientes": "Not enough coins",
        "Consejo para mantener tu racha": "Tip to keep your streak",
        "No necesitás estudiar horas todos los días. Una práctica corta y constante también te acerca a tu objetivo.":
            "You don't need to study for hours every day. Short, consistent practice also helps you reach your goals.",
        "Ir a mis cursos": "Go to my courses",
        "¡Felicitaciones! Alcanzaste tu meta diaria.":
            "Congratulations! You've reached your daily goal.",
        "Ya tenés un beneficio de Doble XP pendiente.":
            "You already have a Double XP reward waiting.",
        "No tenés monedas suficientes para este canje.":
            "You don't have enough coins for this reward.",
        "¡Canje realizado! Tu Doble XP está listo para usar.":
            "Reward redeemed! Your Double XP is ready to use.",
        "No se pudo guardar el canje. Intentá nuevamente.":
            "The redemption couldn't be saved. Try again.",

        // MENSAJES DE PERFIL
        "No realizaste ningún cambio en tu perfil.":
            "You haven't made any changes to your profile.",
        "La contraseña actual es incorrecta.":
            "Your current password is incorrect.",
        "Las contraseñas nuevas no coinciden.":
            "The new passwords do not match.",
        "No se pudieron guardar los cambios.":
            "Your changes couldn't be saved.",
        "El nombre debe tener al menos 3 caracteres.":
            "Your name must have at least 3 characters.",
        "El usuario debe tener entre 3 y 20 caracteres, sin espacios.":
            "Your username must have between 3 and 20 characters, without spaces.",
        "Ingresá un correo electrónico válido.":
            "Enter a valid email address.",
        "Ese nombre de usuario ya está registrado.":
            "That username is already registered.",
        "Ese correo electrónico ya está registrado.":
            "That email address is already registered.",
        "La nueva contraseña debe tener al menos 10 caracteres, una mayúscula, una minúscula y un número.":
            "The new password must contain at least 10 characters, an uppercase letter, a lowercase letter and a number."
    };

    // Traducciones de los placeholders.
    const placeholders = {
        "Nombre": "First name",
        "Apellido": "Last name",
        "Contraseña": "Password",
        "Repetir contraseña": "Confirm password",
        "Contraseña actual": "Current password",
        "Nueva contraseña": "New password",
        "Confirmar nueva contraseña": "Confirm new password",
        "Becas, Cursos, y Vocabulario...": "Search for a language..."
    };

    // Conservar los textos originales del HTML.
    const originales = new WeakMap();

    // Obtener el usuario activo, si lo hay.
    function usuarioActual() {

        if (typeof obtenerUsuarioActivo !== "function") {
            return null;
        }

        return obtenerUsuarioActivo();

    }

    // Convertir la preferencia del usuario a es o en.
    function normalizarIdioma(valor) {

        return ["en", "ingles", "english"].includes(valor)
            ? "en"
            : "es";

    }

    // Obtener el idioma de la cuenta activa.
    function idiomaActual() {

        const usuario = usuarioActual();

        if (usuario) {

            return normalizarIdioma(usuario.idioma);

        }

        // Si todavía no hay sesión, usar la preferencia del navegador.
        return localStorage.getItem("grammatech_idioma") === "en"
            ? "en"
            : "es";

    }

    // Sincronizar la clave que utilizan los otros JavaScript.
    function sincronizarIdioma() {

        const idioma = idiomaActual();

        localStorage.setItem("grammatech_idioma", idioma);

        return idioma;

    }

    function limpiarTexto(texto) {

        return texto.replace(/\s+/g, " ").trim();

    }

    // Traducir mensajes que incluyen cantidades variables.
    function traducirTextoVariable(texto) {

        let coincidencia;

        coincidencia = texto.match(/^Racha de (\d+) días?$/);

        if (coincidencia) {

            const dias = Number(coincidencia[1]);

            return "Streak of " + dias +
                (dias === 1 ? " day" : " days");

        }

        coincidencia = texto.match(/^(\d+) días?$/);

        if (coincidencia) {

            const dias = Number(coincidencia[1]);

            return dias + (dias === 1 ? " day" : " days");

        }

        coincidencia = texto.match(
            /^Te faltan (\d+) XP para alcanzar tu meta diaria\.$/
        );

        if (coincidencia) {

            return "You need " + coincidencia[1] +
                " more XP to reach your daily goal.";

        }

        coincidencia = texto.match(/^(\d+) monedas$/);

        if (coincidencia) {

            return coincidencia[1] + " coins";

        }

        coincidencia = texto.match(/^Liga (bronce|plata|oro)$/i);

        if (coincidencia) {

            const ligas = {
                bronce: "Bronze",
                plata: "Silver",
                oro: "Gold"
            };

            return ligas[coincidencia[1].toLowerCase()] + " League";

        }

        coincidencia = texto.match(
            /^¡Respuesta correcta! Ganaste (\d+) XP y (\d+) monedas\.(.*)$/
        );

        if (coincidencia) {

            const mensaje =
                "Correct answer! You earned " +
                coincidencia[1] + " XP and " +
                coincidencia[2] + " coins.";

            return coincidencia[3].trim()
                ? mensaje + " You used your Double XP reward!"
                : mensaje;

        }

        return null;

    }

    // Buscar traducciones exactas o variables.
    function buscarTraduccion(texto) {

        if (Object.hasOwn(traducciones, texto)) {
            return traducciones[texto];
        }

        return traducirTextoVariable(texto);

    }

    // No modificar las respuestas evaluadas.
    function esContenidoDeEjercicio(elemento) {

        return Boolean(elemento.closest(
            ".opciones, .banco-palabras, .respuesta, .frase, " +
            "[data-no-traducir], script, style, textarea, " +
            "select#idioma"
        ));

    }

    // Traducir los textos visibles de la página.
    function traducirPagina() {

        const idioma = idiomaActual();

        const recorrido = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
        );

        while (recorrido.nextNode()) {

            const nodo = recorrido.currentNode;
            const elemento = nodo.parentElement;

            if (!elemento || esContenidoDeEjercicio(elemento)) {
                continue;
            }

            const actual = nodo.textContent;
            const anterior = originales.get(nodo);

            // Reconocer textos nuevos agregados por otros JavaScript.
            if (!anterior ||
                (actual !== anterior.es && actual !== anterior.en)) {

                const clave = limpiarTexto(actual);
                const traduccion = buscarTraduccion(clave);

                if (traduccion !== null) {

                    const inicio = actual.match(/^\s*/)[0];
                    const final = actual.match(/\s*$/)[0];

                    originales.set(nodo, {
                        es: actual,
                        en: inicio + traduccion + final
                    });

                } else {

                    originales.delete(nodo);

                }

            }

            const registro = originales.get(nodo);

            if (registro) {

                const resultado = idioma === "en"
                    ? registro.en
                    : registro.es;

                if (nodo.textContent !== resultado) {
                    nodo.textContent = resultado;
                }

            }

        }

        // Traducir los placeholders sin tocar lo escrito en los campos.
        document.querySelectorAll("[placeholder]").forEach(function(campo) {

            if (!campo.dataset.placeholderOriginal) {
                campo.dataset.placeholderOriginal = campo.placeholder;
            }

            const original = campo.dataset.placeholderOriginal;

            campo.placeholder = idioma === "en"
                ? (placeholders[original] || original)
                : original;

        });

        document.documentElement.lang = idioma;

    }

    // Función que utilizan Home y otros JavaScript.
    window.traducirTexto = function(texto) {

        if (idiomaActual() !== "en") {
            return texto;
        }

        return buscarTraduccion(texto) || texto;

    };

    // Guardar el idioma de la cuenta que inició sesión.
    function cambiarIdioma(idioma) {

        const usuario = usuarioActual();

        if (usuario) {

            const valorUsuario = idioma === "en"
                ? "ingles"
                : "espanol";

            // Guardar la preferencia en la cuenta activa.
            if (typeof actualizarUsuario === "function") {

                const guardado = actualizarUsuario({
                    idioma: valorUsuario
                });

                if (!guardado) {
                    console.error("No se pudo guardar el idioma.");
                    return;
                }

            }

        }

        // Mantener la clave compartida para el resto de las vistas.
        localStorage.setItem("grammatech_idioma", idioma);

        traducirPagina();

        window.dispatchEvent(new Event("idiomaActualizado"));

    }

    // Al abrir una página, recuperar la preferencia de la cuenta.
    const idiomaGuardado = sincronizarIdioma();

    // Buscar el selector Es / En del encabezado.
    const selector = document.getElementById("idioma");

    if (selector && selector.tagName === "SELECT") {

        const opciones = Array.from(selector.options);

        const opcionIngles = opciones.find(function(opcion) {

            return ["ingles", "english", "en"].includes(opcion.value);

        });

        const opcionEspanol = opciones.find(function(opcion) {

            return ["espanol", "español", "es"].includes(opcion.value);

        });

        // Mostrar en el header el idioma de la cuenta.
        if (idiomaGuardado === "en" && opcionIngles) {

            selector.value = opcionIngles.value;

        }

        if (idiomaGuardado === "es" && opcionEspanol) {

            selector.value = opcionEspanol.value;

        }

        // Guardar el idioma cuando el usuario cambia el selector.
        selector.addEventListener("change", function() {

            const idioma = ["ingles", "english", "en"].includes(
                selector.value
            ) ? "en" : "es";

            cambiarIdioma(idioma);

        });

    }

    // Traducir la página al cargar.
    traducirPagina();

    // Traducir textos agregados después por otros JavaScript.
    const observador = new MutationObserver(function() {

        traducirPagina();

    });

    observador.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true
    });

})();
