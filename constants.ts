
import { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "¿En qué época histórica vivió René Descartes?",
    options: [
      { id: "A", text: "En el siglo XVIII, durante la Revolución Francesa." },
      { id: "B", text: "En la primera mitad del siglo XVII, marcada por la Guerra de los Treinta Años." },
      { id: "C", text: "En el siglo XVI, durante el Renacimiento temprano." }
    ],
    correctAnswer: "B"
  },
  {
    id: 2,
    text: "¿Cuál era el objetivo principal de la filosofía de Descartes?",
    options: [
      { id: "A", text: "Establecer un conocimiento seguro y fundado en la razón." },
      { id: "B", text: "Demostrar que los sentidos son la única fuente de verdad." },
      { id: "C", text: "Defender la fe cristiana por encima de cualquier razonamiento." }
    ],
    correctAnswer: "A"
  },
  {
    id: 3,
    text: "¿Qué influencia científica destaca el texto como fundamental para Descartes?",
    options: [
      { id: "A", text: "La biología de Aristóteles." },
      { id: "B", text: "La física de Newton." },
      { id: "C", text: "El método deductivo y la matematización de Galileo." }
    ],
    correctAnswer: "C"
  },
  {
    id: 4,
    text: "¿Qué obra de Montaigne popularizó el escepticismo en tiempos de Descartes?",
    options: [
      { id: "A", text: "Los 'Ensayos'." },
      { id: "B", text: "El 'Discurso del método'." },
      { id: "C", text: "'La ciudad de Dios'." }
    ],
    correctAnswer: "A"
  },
  {
    id: 5,
    text: "¿Qué significa 'precipitación' dentro de la regla de la evidencia?",
    options: [
      { id: "A", text: "Analizar demasiado un problema antes de resolverlo." },
      { id: "B", text: "Admitir como verdadero algo que es falso por falta de examen." },
      { id: "C", text: "Tardar mucho tiempo en tomar una decisión lógica." }
    ],
    correctAnswer: "B"
  },
  {
    id: 6,
    text: "¿En qué consiste la regla del Análisis?",
    options: [
      { id: "A", text: "Dividir las dificultades en tantas partes como sea posible para resolverlas mejor." },
      { id: "B", text: "Revisar todo el proceso para asegurar que no hay errores." },
      { id: "C", text: "Ir de los objetos más simples a los más complejos." }
    ],
    correctAnswer: "A"
  },
  {
    id: 7,
    text: "¿Qué función tiene la regla de la Síntesis?",
    options: [
      { id: "A", text: "Hacer recuentos y revisiones generales." },
      { id: "B", text: "Conducir los pensamientos de lo más simple a lo más complejo." },
      { id: "C", text: "Rechazar todo lo que sea dudoso o confuso." }
    ],
    correctAnswer: "B"
  },
  {
    id: 8,
    text: "¿Cuál es el primer motivo de duda que expone Descartes?",
    options: [
      { id: "A", text: "La hipótesis del Genio Maligno." },
      { id: "B", text: "La imposibilidad de distinguir el sueño de la vigilia." },
      { id: "C", text: "El engaño de los sentidos (percepción sensible)." }
    ],
    correctAnswer: "C"
  },
  {
    id: 9,
    text: "¿Por qué duda Descartes de la existencia del mundo material?",
    options: [
      { id: "A", text: "Porque no podemos distinguir con certeza si estamos despiertos o soñando." },
      { id: "B", text: "Porque los científicos de su época decían que la materia es una ilusión." },
      { id: "C", text: "Porque los sentidos nunca han funcionado correctamente." }
    ],
    correctAnswer: "A"
  },
  {
    id: 10,
    text: "¿Qué verdad sobrevive incluso a la hipótesis del Genio Maligno?",
    options: [
      { id: "A", text: "Que Dios es infinitamente bueno." },
      { id: "B", text: "El 'Cogito ergo sum' (Pienso, luego existo)." },
      { id: "C", text: "Que las verdades matemáticas son incuestionables." }
    ],
    correctAnswer: "B"
  },
  {
    id: 11,
    text: "¿Cómo define Descartes la 'intuición'?",
    options: [
      { id: "A", text: "Un sentimiento emocional sobre la realidad." },
      { id: "B", text: "La captación inmediata de ideas simples y evidentes por la razón." },
      { id: "C", text: "Un razonamiento largo que llega a una conclusión." }
    ],
    correctAnswer: "B"
  },
  {
    id: 12,
    text: "¿Qué es la 'Res Cogitans'?",
    options: [
      { id: "A", text: "La sustancia extensa o cuerpo." },
      { id: "B", text: "La sustancia pensante o alma." },
      { id: "C", text: "La sustancia infinita o Dios." }
    ],
    correctAnswer: "B"
  },
  {
    id: 13,
    text: "¿Qué caracteriza a las 'ideas adventicias'?",
    options: [
      { id: "A", text: "Parecen provenir del exterior, a través de los sentidos." },
      { id: "B", text: "Son construidas por nuestra propia imaginación." },
      { id: "C", text: "Son aquellas que la razón posee por sí misma desde el nacimiento." }
    ],
    correctAnswer: "A"
  },
  {
    id: 14,
    text: "¿Qué tipo de idea es la de 'Sirena' o 'Centauro'?",
    options: [
      { id: "A", text: "Idea innata." },
      { id: "B", text: "Idea adventicia." },
      { id: "C", text: "Idea facticia." }
    ],
    correctAnswer: "C"
  },
  {
    id: 15,
    text: "¿Por qué la idea de 'perfección' o 'infinito' debe ser innata?",
    options: [
      { id: "A", text: "Porque la vemos en la naturaleza todos los días." },
      { id: "B", text: "Porque un ser finito no puede producir la idea de un ser infinito." },
      { id: "C", text: "Porque nos la enseñan desde pequeños en la escuela." }
    ],
    correctAnswer: "B"
  },
  {
    id: 16,
    text: "¿Qué prueba de Dios se basa en que la existencia es una perfección?",
    options: [
      { id: "A", text: "El argumento de la causalidad." },
      { id: "B", text: "El argumento ontológico." },
      { id: "C", text: "La prueba de la finitud del yo." }
    ],
    correctAnswer: "B"
  },
  {
    id: 17,
    text: "¿Cuál es el papel de Dios como 'garante' en el sistema cartesiano?",
    options: [
      { id: "A", text: "Impedir que los científicos descubran la verdad." },
      { id: "B", text: "Asegurar que lo que percibimos clara y distintamente es real y no un engaño." },
      { id: "C", text: "Perdonar los pecados de los filósofos escépticos." }
    ],
    correctAnswer: "B"
  },
  {
    id: 18,
    text: "¿Qué es la 'Res Extensa'?",
    options: [
      { id: "A", text: "El pensamiento puro." },
      { id: "B", text: "La sustancia cuyo atributo es la extensión (espacio, movimiento)." },
      { id: "C", text: "El vacío absoluto." }
    ],
    correctAnswer: "B"
  },
  {
    id: 19,
    text: "¿Qué visión del mundo físico propone Descartes?",
    options: [
      { id: "A", text: "Una visión organicista y mágica." },
      { id: "B", text: "Una visión mecanicista (el mundo funciona como una máquina)." },
      { id: "C", text: "Una visión donde la materia no existe realmente." }
    ],
    correctAnswer: "B"
  },
  {
    id: 20,
    text: "¿Cómo interactúan el alma y el cuerpo según estos apuntes?",
    options: [
      { id: "A", text: "No interactúan de ninguna manera." },
      { id: "B", text: "A través de la glándula pineal." },
      { id: "C", text: "Mediante los latidos del corazón." }
    ],
    correctAnswer: "B"
  },
  {
    id: 21,
    text: "¿Qué garantiza la libertad del ser humano en el sistema de Descartes?",
    options: [
      { id: "A", text: "Que el cuerpo sigue leyes mecánicas." },
      { id: "B", text: "La existencia del alma, que no está sometida a las leyes naturales." },
      { id: "C", text: "La voluntad del Rey absoluto." }
    ],
    correctAnswer: "B"
  },
  {
    id: 22,
    text: "¿A qué se refiere el término 'Sustancia' en Descartes?",
    options: [
      { id: "A", text: "A aquello que no necesita de otra cosa para existir." },
      { id: "B", text: "A los elementos químicos de la materia." },
      { id: "C", text: "A las ideas confusas que tenemos al soñar." }
    ],
    correctAnswer: "A"
  },
  {
    id: 23,
    text: "¿Cuál es la cuarta regla del método?",
    options: [
      { id: "A", text: "Análisis." },
      { id: "B", text: "Evidencia." },
      { id: "C", text: "Enumeración y revisión." }
    ],
    correctAnswer: "C"
  },
  {
    id: 24,
    text: "¿Qué significa que una idea sea 'distinta'?",
    options: [
      { id: "A", text: "Que es diferente a las ideas de otros filósofos." },
      { id: "B", text: "Que está separada de las demás y no contiene nada que no le pertenezca." },
      { id: "C", text: "Que es una idea que solo se tiene por la noche." }
    ],
    correctAnswer: "B"
  },
  {
    id: 25,
    text: "¿Quiénes son mencionados como continuadores del Racionalismo?",
    options: [
      { id: "A", text: "Spinoza y Leibniz." },
      { id: "B", text: "Locke y Hume." },
      { id: "C", text: "Platón y Aristóteles." }
    ],
    correctAnswer: "A"
  },
  {
    id: 26,
    text: "¿Qué nivel de duda cuestiona incluso que 2+2 sean 4?",
    options: [
      { id: "A", text: "La duda de los sentidos." },
      { id: "B", text: "El sueño." },
      { id: "C", text: "El Genio Maligno." }
    ],
    correctAnswer: "C"
  },
  {
    id: 27,
    text: "¿Qué es el 'dualismo antropológico' en Descartes?",
    options: [
      { id: "A", text: "La idea de que el hombre tiene dos ojos y dos manos." },
      { id: "B", text: "La separación radical entre alma (pensamiento) y cuerpo (materia)." },
      { id: "C", text: "La creencia en dos dioses diferentes." }
    ],
    correctAnswer: "B"
  },
  {
    id: 28,
    text: "¿En qué lengua escribió Descartes sus obras para llegar a más gente?",
    options: [
      { id: "A", text: "Latín académico." },
      { id: "B", text: "Lengua vernácula (francés)." },
      { id: "C", text: "Griego antiguo." }
    ],
    correctAnswer: "B"
  },
  {
    id: 29,
    text: "¿Qué elemento de la matemática fascinaba a Descartes para su método?",
    options: [
      { id: "A", text: "La precisión y la certeza de sus deducciones." },
      { id: "B", text: "Que no requiere pensar demasiado." },
      { id: "C", text: "Que fue inventada por los jesuitas." }
    ],
    correctAnswer: "A"
  },
  {
    id: 30,
    text: "¿Qué sucede con la sustancia infinita (Dios) respecto a las otras dos?",
    options: [
      { id: "A", text: "Es la única que es sustancia en sentido absoluto, pues no depende de nada." },
      { id: "B", text: "Depende del alma humana para existir." },
      { id: "C", text: "Es una extensión del cuerpo humano." }
    ],
    correctAnswer: "A"
  }
];
