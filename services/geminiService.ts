import { GoogleGenAI, Type } from "@google/genai";
import { NewsUpdate, Stage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FAST = 'gemini-2.5-flash';

// --- Assistant Logic ---

export const getImmiResponse = async (history: {role: string, text: string}[], message: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: MODEL_FAST,
      config: {
        systemInstruction: `You are Immi, a friendly, knowledgeable, and empathetic immigration assistant for the Immigame app. 
        Your goal is to help users navigate complex immigration processes (specifically focusing on US immigration for this demo, but adaptable).
        Keep answers concise, encouraging, and easy to understand. Use emojis occasionally. 
        If you don't know something specific, advise checking official government sources (USCIS).
        You are talking to an immigrant who is currently in the process.`,
      },
      history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm having trouble connecting to immigration services right now. Please try again later.";
  } catch (error) {
    console.error("Error asking Immi:", error);
    return "I'm sorry, I encountered an error while processing your request.";
  }
};

// --- Real-time News Updates ---

export const getImmigrationNews = async (): Promise<NewsUpdate[]> => {
  try {
    // We use the googleSearch tool to get *actual* recent information if possible.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "What are the latest major US immigration news, policy changes, or visa bulletin updates from the last month? Summarize 3 key updates.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              impactLevel: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
              date: { type: Type.STRING }
            },
            required: ['headline', 'summary', 'impactLevel', 'date']
          }
        }
      }
    });

    const rawText = response.text || "[]";
    const newsData = JSON.parse(rawText);
    
    // Add IDs and process
    return newsData.map((item: any, index: number) => ({
      ...item,
      id: `news-${Date.now()}-${index}`,
      // Extract source URL from grounding if available, otherwise undefined
      sourceUrl: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.[index]?.web?.uri
    }));

  } catch (error) {
    console.error("Error fetching news:", error);
    // Fallback mock data if API fails or search isn't available
    return [
      {
        id: 'mock-1',
        headline: 'Visa Bulletin Updates',
        summary: 'The latest visa bulletin shows advancement in EB-2 and EB-3 categories for several countries.',
        date: '2024-05-20',
        impactLevel: 'high'
      },
      {
        id: 'mock-2',
        headline: 'H-1B Lottery Results',
        summary: 'USCIS has completed the second round of H-1B lottery selections for the upcoming fiscal year.',
        date: '2024-05-15',
        impactLevel: 'medium'
      }
    ];
  }
};

// --- Dynamic Stage Generation ---

export const generateGamifiedStages = async (origin: string, destination: string): Promise<Stage[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Generate a simplified, gamified list of immigration stages for moving from ${origin} to ${destination}. 
      Return exactly 5 stages. The first one should be 'completed', second 'active', rest 'locked'.
      Think of them like game levels.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              status: { type: Type.STRING, enum: ['locked', 'active', 'completed'] },
              type: { type: Type.STRING, enum: ['quiz', 'document', 'info'] },
              icon: { type: Type.STRING, description: "One of: FileText, Plane, Home, GraduationCap, Passport" }
            }
          }
        }
      }
    });

    const stages = JSON.parse(response.text || "[]");
    return stages;
  } catch (error) {
    console.error("Error generating stages:", error);
    return [
      { id: '1', title: 'Visa Research', description: 'Understand your visa options.', status: 'completed', type: 'info', icon: 'FileText' },
      { id: '2', title: 'Gather Documents', description: 'Collect birth certificates and passports.', status: 'active', type: 'document', icon: 'Passport' },
      { id: '3', title: 'Application Form', description: 'Fill out the DS-160 or I-130.', status: 'locked', type: 'quiz', icon: 'FileText' },
      { id: '4', title: 'Interview Prep', description: 'Practice for your consulate interview.', status: 'locked', type: 'info', icon: 'GraduationCap' },
      { id: '5', title: 'Travel & Entry', description: 'Booking flights and port of entry info.', status: 'locked', type: 'info', icon: 'Plane' },
    ];
  }
};