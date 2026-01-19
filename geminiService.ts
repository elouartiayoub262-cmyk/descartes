
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const NOTES_CONTEXT = `
Contexto de Descartes: Siglo XVII, Guerra de los Treinta Años, crisis feudal, religiosa y cultural. Transición al capitalismo y absolutismo.
Influencias: Escepticismo de Montaigne (Ensayos, suspensión del juicio), Escolástica (Aristóteles/Tomás de Aquino), Racionalismo de Galileo (Matematización).
El Método: Evidencia (evitar precipitación), Análisis (dividir dificultades), Síntesis (de simple a complejo), Enumeración (revisión).
La Duda Metódica: Niveles: 1. Sentidos engañan. 2. Sueño/Vigilia (mundo exterior). 3. Genio Maligno (razón/matemáticas).
Verdades: Cogito ergo sum (primera verdad indubitable). Ideas: Adventicias (exterior), Facticias (imaginación), Innatas (razón, infinito/perfección).
Sustancias: Res Cogitans (pensante, alma), Res Extensa (cuerpo, extensión, mecanicismo), Dios (Sustancia infinita, garante de verdad).
Dualismo: Alma y cuerpo interactúan por la glándula pineal. El alma garantiza la libertad frente al mecanicismo del cuerpo.
Sustancia: Aquello que no necesita de otra cosa para existir.
Atributos: Res cogitans (pensamiento), Res extensa (extensión).
Mecanicismo: El mundo físico funciona como una máquina regida por leyes matemáticas.
`;

export const getPhilosophicalFeedback = async (score: number, total: number, missedTopics: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Como el mentor filosófico de René Descartes, da un breve comentario motivador (máximo 3 frases) sobre el resultado del usuario en su test de filosofía. 
      Resultado: ${score}/${total}. 
      Temas a reforzar: ${missedTopics.join(', ')}. 
      Habla de forma elegante y racionalista.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return "Tu razón ha sido puesta a prueba. Sigue buscando la claridad y la distinción en tus ideas.";
  }
};

/**
 * Reformulates the original questions to prevent rote memorization.
 */
export const reformulateQuiz = async (baseQuestions: Question[]): Promise<Question[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un experto profesor de Filosofía de 2º de Bachillerato. 
      Tu tarea es reescribir estas 30 preguntas sobre Descartes para evitar que el alumno responda por simple memoria visual o auditiva.
      
      REGLAS:
      1. Mantén la misma respuesta correcta (id) para cada pregunta.
      2. Usa una redacción directa y limpia.
      3. Mantén el nivel de 2º de Bachillerato (EBAU).
      4. Basate estrictamente en este contexto: [${NOTES_CONTEXT}].
      
      Preguntas originales: ${JSON.stringify(baseQuestions)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              text: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING }
                  },
                  required: ["id", "text"]
                }
              },
              correctAnswer: { type: Type.STRING }
            },
            required: ["id", "text", "options", "correctAnswer"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error reformulating quiz:", error);
    return baseQuestions;
  }
};

/**
 * Generates a completely new set of questions based only on the notes.
 */
export const generateNewQuestionsFromNotes = async (count: number = 15): Promise<Question[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un profesor de Filosofía de 2º de Bachillerato. 
      Genera ${count} preguntas tipo test TOTALMENTE NUEVAS basadas EXCLUSIVAMENTE en estos apuntes: [${NOTES_CONTEXT}].
      
      REGLAS:
      1. Las preguntas deben ser variadas: contexto, método, duda, sustancias, Dios, dualismo.
      2. No uses las preguntas típicas de siempre, busca detalles de los apuntes para forzar al alumno a haber leído bien.
      3. Lenguaje normal, directo y claro.
      4. Cada pregunta debe tener 3 opciones (A, B, C).
      5. Formato JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              text: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING }
                  },
                  required: ["id", "text"]
                }
              },
              correctAnswer: { type: Type.STRING }
            },
            required: ["id", "text", "options", "correctAnswer"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating new questions:", error);
    return [];
  }
};

/**
 * Direct explanation for a specific question.
 */
export const getQuickExplanation = async (question: string, correctAnswerText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explica brevemente por qué la respuesta "${correctAnswerText}" es la correcta para la pregunta "${question}". 
      Usa un lenguaje normal, muy directo y ve al grano. Basado en: [${NOTES_CONTEXT}]. Máximo 2 frases.`,
    });
    return response.text;
  } catch (error) {
    return "Esta opción se corresponde con los principios fundamentales del racionalismo de Descartes.";
  }
};

/**
 * Interactive chat with Professor Pedro.
 */
export const professorPedroChat = async (history: { role: string, text: string }[], currentQuestion: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { text: `Eres el "Profesor Pedro". Ayuda al alumno a entender a Descartes basándote en: [${NOTES_CONTEXT}]. 
        Habla de forma normal, sencilla y muy directa. Ve al grano. 
        Responde dudas sobre la pregunta: "${currentQuestion}".` },
        ...history.map(h => ({ text: `${h.role === 'user' ? 'Alumno' : 'Pedro'}: ${h.text}` }))
      ],
    });
    return response.text;
  } catch (error) {
    return "Disculpa, no he entendido bien la pregunta. ¿Podrías repetirla?";
  }
};
