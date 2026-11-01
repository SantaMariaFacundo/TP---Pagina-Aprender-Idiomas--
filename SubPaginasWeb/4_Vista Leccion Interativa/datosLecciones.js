
 // Preguntas y respuestas de Inglés, Alemán y Chino.
 // Los niveles A, B y C reutilizan estos ejercicios.

const ejerciciosLecciones = {

    ingles: {

        listening: {
            tipo: "opciones",
            titulo: "Elegí la traducción correcta:",
            frase: "I would like to order a coffee, please",
            opciones: [
                ["te", "Me gustaría pedir un té, por favor"],
                ["cafe", "Quisiera pedir un café, por favor"],
                ["mesa", "Necesito una mesa para dos, por favor"],
                ["cuenta", "¿Podría traerme la cuenta, por favor?"]
            ],
            correcta: "cafe"
        },

        vocabulario: {
            tipo: "opciones",
            titulo: "Elegí la traducción correcta:",
            frase: "Apple",
            opciones: [
                ["pera", "Pera"],
                ["manzana", "Manzana"],
                ["naranja", "Naranja"],
                ["banana", "Banana"]
            ],
            correcta: "manzana"
        },

        gramatica: {
            tipo: "opciones",
            titulo: "Completá la oración:",
            frase: "She ___ English every day.",
            opciones: [
                ["study", "study"],
                ["studies", "studies"],
                ["studying", "studying"],
                ["studied", "studied"]
            ],
            correcta: "studies"
        }

    },

    aleman: {

        listening: {
            tipo: "palabras",
            titulo: "Traducí la siguiente oración:",
            frase: "Guten Tag, wie geht es dir?",
            palabras: [
                "Hola",
                "días",
                "estás?",
                "Gracias",
                "¿cómo",
                "Buenos",
                "Adiós"
            ],
            correcta: "Buenos días ¿cómo estás?"
        },

        vocabulario: {
            tipo: "palabras",
            titulo: "Ordená la traducción correcta:",
            frase: "Danke schön!",
            palabras: [
                "Adiós",
                "gracias",
                "Muchas",
                "Buenos",
                "días"
            ],
            correcta: "Muchas gracias"
        },

        gramatica: {
            tipo: "palabras",
            titulo: "Ordená la traducción correcta:",
            frase: "Ich trinke Wasser.",
            palabras: [
                "agua",
                "Ella",
                "bebo",
                "Yo",
                "corro"
            ],
            correcta: "Yo bebo agua"
        }

    },

    chino: {

        listening: {
            tipo: "opciones",
            titulo: "Completá la frase:",
            frase: "你 ___ 吗？",
            opciones: [
                ["hao", "好 (bien)"],
                ["xiexie", "谢谢 (gracias)"],
                ["zaijian", "再见 (adiós)"],
                ["mingzi", "名字 (nombre)"]
            ],
            correcta: "hao"
        },

        vocabulario: {
            tipo: "opciones",
            titulo: "Elegí la traducción correcta:",
            frase: "谢谢",
            opciones: [
                ["hola", "Hola"],
                ["gracias", "Gracias"],
                ["adios", "Adiós"],
                ["agua", "Agua"]
            ],
            correcta: "gracias"
        },

        gramatica: {
            tipo: "opciones",
            titulo: "Completá la frase:",
            frase: "我 ___ 学生。",
            opciones: [
                ["hao", "好 (bien)"],
                ["shi", "是 (ser)"],
                ["xiexie", "谢谢 (gracias)"],
                ["ma", "吗 (partícula interrogativa)"]
            ],
            correcta: "shi"
        }

    }

};
