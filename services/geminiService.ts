import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { PRODUCTS, COMPANY_INFO } from "../constants";

// Initialize Gemini Client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

// Type for chat session
type ChatSession = Chat;

// Cache storage for chat responses
const responseCache = new Map<string, string>();

// System instructions for the Chatbot
const CHAT_SYSTEM_INSTRUCTION = `
Usted es el asistente virtual inteligente de "Sures" (Hijos y Nietos de Maria Asunción Cornejo S.R.L.), una empresa líder en climatización en Argentina.
Su tono es formal, profesional, "Apple-like" (conciso, elegante) y servicial. Utilice "Usted".

Información Clave de la Empresa:
- Dealers oficiales de Carrier y Midea.
- Ubicación: ${COMPANY_INFO.address}.
- Teléfonos: ${COMPANY_INFO.phone1} / ${COMPANY_INFO.phone2}.
- Especialidad: Venta, instalación, mantenimiento de aire acondicionado (residencial y comercial), balances térmicos, conductos.

Catálogo de Productos Disponibles:
${JSON.stringify(
  PRODUCTS.map((p) => ({
    modelo: p.name,
    tipo: p.type,
    capacidad: p.frigorias ? `${p.frigorias} Frigorías` : `${p.kcal} Kcal/h`,
    caracteristicas: p.features.join(", "),
  }))
)}

Objetivos:
1. Actuar como un experto en el catálogo provisto. Asesorar al cliente recomendando el equipo ideal basándose en sus necesidades (frigorías, tipo de instalación, tecnología inverter, etc.).
2. Responder consultas sobre servicios (instalación, mantenimiento, obras).
3. Si preguntan por ubicación, indique textualmente la dirección: ${
  COMPANY_INFO.address
}.
4. Si el cliente necesita un presupuesto específico, invítelo a usar el formulario de contacto o llamar.

IMPORTANTE:
- SOLO recomiende productos que estén explícitamente en la lista "Catálogo de Productos Disponibles".
- No invente productos ni características.
- Si le preguntan por precios, indique que deben solicitar cotización formal.
- NO utilice herramientas externas ni intente buscar en mapas.
`;

let chatSession: ChatSession | null = null;

export const getChatSession = async (): Promise<ChatSession> => {
  if (chatSession) return chatSession;

  chatSession = ai.chats.create({
    model: "gemini-2.5-flash", // High intelligence for chat
    config: {
      systemInstruction: CHAT_SYSTEM_INSTRUCTION,
      // tools: [], // Google Maps Removed
    },
  });
  return chatSession;
};

export const sendChatMessage = async (message: string): Promise<string> => {
  const cacheKey = message.trim().toLowerCase();

  // Check cache before making API call
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey)!;
  }

  try {
    const session = await getChatSession();
    const result: GenerateContentResponse = await session.sendMessage({
      message,
    });

    // Removed grounding metadata processing as we are not using Google Maps anymore
    const text =
      result.text ||
      "Lo siento, no pude procesar su solicitud en este momento.";

    // Store response in cache
    // Limit cache size to 50 items to prevent memory issues
    if (responseCache.size >= 50) {
      const firstKey = responseCache.keys().next().value;
      if (firstKey) responseCache.delete(firstKey);
    }
    responseCache.set(cacheKey, text);

    return text;
  } catch (error) {
    console.error("Chat Error:", error);
    // Reset session on error to recover from potential state issues
    chatSession = null;
    return "Disculpe, ha ocurrido un error momentáneo en mi sistema. Por favor intente nuevamente o llámenos directamente.";
  }
};

// BTU Calculator AI Recommendation
interface CalculatorInput {
  squareMeters: number;
  ceilingHeight: number;
  orientation: string;
  windowCount: number;
  windowType: string;
  sunExposure: string;
  peopleCount: number;
  electronics: string;
  roofType: string;
  roomType: string;
  calculatedFrigorias: number;
  recommendedProducts: string[];
}

export const getAIRecommendation = async (
  input: CalculatorInput
): Promise<string> => {
  try {
    const prompt = `Sos un experto en climatización de Sures Argentina. Un cliente completó nuestra calculadora de frigorías con estos datos:

**Ambiente:**
- Tipo: ${input.roomType}
- Superficie: ${input.squareMeters} m²
- Altura techo: ${input.ceilingHeight}m
- Orientación: ${input.orientation}

**Características:**
- Ventanas: ${input.windowCount} (vidrio ${input.windowType})
- Exposición solar: ${input.sunExposure}
- Personas: ${input.peopleCount}
- Electrónicos: ${input.electronics}
- Tipo de techo: ${input.roofType}

**Resultado del cálculo:** ${input.calculatedFrigorias} frigorías

**Productos pre-seleccionados:** ${input.recommendedProducts.join(', ') || 'Ninguno específico'}

Dá una recomendación BREVE (máximo 3 oraciones) y PROFESIONAL sobre:
1. Si el cálculo parece adecuado para ese ambiente
2. Si recomendás tecnología Inverter para ese caso y por qué
3. Un tip de instalación o uso para ese tipo de ambiente

Usá lenguaje argentino formal pero cercano. NO repitas los datos del cálculo.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Recomendamos consultar con nuestros técnicos para un asesoramiento personalizado.";
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return "Para un asesoramiento más preciso, le recomendamos contactarnos directamente.";
  }
};

// Quiz AI Recommendation
interface QuizInput {
  usage: string;
  squareMeters: string;
  priority: string;
  installation: string;
  wifi: string;
  recommendedProducts: string[];
}

export const getQuizRecommendation = async (
  input: QuizInput
): Promise<string> => {
  try {
    const sizeDescriptions: Record<string, string> = {
      'pequeño': 'hasta 20 m²',
      'mediano': '20 a 35 m²',
      'grande': '35 a 60 m²',
      'muy-grande': 'más de 60 m²'
    };

    const prompt = `Sos un asesor de climatización de Sures Argentina, con tono amigable y cercano (argentino).

Un cliente completó nuestro quiz rápido:
- **Uso:** ${input.usage === 'residencial' ? 'Casa/Departamento' : 'Oficina/Local comercial'}
- **Tamaño:** ${sizeDescriptions[input.squareMeters] || input.squareMeters}
- **Prioridad:** ${input.priority === 'ahorro' ? 'Ahorro energético a largo plazo' : 'Menor inversión inicial'}
- **Instalación:** ${input.installation === 'existente' ? 'Ya tiene instalación previa' : 'Instalación nueva'}
- **WiFi:** ${input.wifi === 'si' ? 'Quiere control desde el celular' : 'No necesita WiFi'}

**Equipos que le recomendamos:** ${input.recommendedProducts.join(', ')}

Escribí un mensaje CORTO (máximo 2-3 oraciones) y ENTUSIASTA que:
1. Valide su elección de priorizar ${input.priority === 'ahorro' ? 'el ahorro' : 'el presupuesto'}
2. Destaque el beneficio principal del primer equipo recomendado
3. Cierre con un call-to-action amigable para contactarnos

Usá lenguaje argentino informal pero profesional. Podés usar emojis con moderación.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "¡Excelentes opciones! Contactanos para asesorarte mejor.";
  } catch (error) {
    console.error("Quiz Recommendation Error:", error);
    return "¡Buenas opciones! Escribinos para darte el mejor precio.";
  }
};

export const analyzeRoomImage = async (
  base64Image: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // High intelligence for image analysis
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity from input
              data: base64Image,
            },
          },
          {
            text: `Analice esta imagen de una habitación. 
            1. Estime las dimensiones aproximadas y el tipo de ambiente (dormitorio, oficina, living).
            2. Identifique posibles fuentes de calor (ventanas grandes, equipos electrónicos, personas).
            3. En base a esto, recomiende cuántas frigorías/calorías serían necesarias para climatizar este espacio adecuadamente.
            4. Recomiende un equipo del catálogo de Sures (Midea o Carrier) que se ajuste a estas necesidades.
            
            Responda en formato profesional y conciso, dirigido al cliente.`,
          },
        ],
      },
    });

    return response.text || "No pude analizar la imagen correctamente.";
  } catch (error) {
    console.error("Image Analysis Error:", error);
    return "Hubo un error al procesar su imagen. Asegúrese de que sea clara y tenga buena iluminación.";
  }
};
