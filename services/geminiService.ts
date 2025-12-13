import { GoogleGenAI, Type } from "@google/genai";
import { VisaOption, ChecklistStep } from "../types";

// @ts-ignore - Injected by Vite config
const API_KEY = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

// --- Phase 1: The Discovery Matrix ---
// Queries the "Privilege Graph" to find viable options.
export const discoverVisaOptions = async (citizenship: string, intent: string): Promise<VisaOption[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Act as an immigration law database. A citizen of ${citizenship} wants to '${intent}' abroad. 
      Identify 5 viable country and visa combinations based on current diplomatic privileges and treaties.
      Prioritize diverse options (e.g., one easy entry, one high value/hard entry).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              country: { type: Type.STRING },
              visaName: { type: Type.STRING },
              intent: { type: Type.STRING },
              maxDuration: { type: Type.STRING },
              processingTime: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              requirementsSummary: { type: Type.STRING }
            }
          }
        }
      }
    });

    const raw = JSON.parse(response.text || "[]");
    return raw.map((item: any, idx: number) => ({
      ...item,
      id: `visa-${idx}-${Date.now()}`
    }));
  } catch (error) {
    console.error("Matrix Query Failed:", error);
    // Fallback data for demo stability
    return [
      { id: 'v1', country: 'Germany', visaName: 'Job Seeker Visa', intent: 'Work', maxDuration: '6 Months', processingTime: '4 Weeks', difficulty: 'Medium', requirementsSummary: 'Degree, Funds for stay' },
      { id: 'v2', country: 'Canada', visaName: 'Express Entry (FSW)', intent: 'Work', maxDuration: 'Permanent', processingTime: '6 Months', difficulty: 'Medium', requirementsSummary: 'Points based on age, ed, lang' },
      { id: 'v3', country: 'UAE', visaName: 'Remote Work Visa', intent: 'Work', maxDuration: '1 Year', processingTime: '1-2 Weeks', difficulty: 'Low', requirementsSummary: 'Proof of employment, $3.5k salary' }
    ];
  }
};

// --- Phase 2: The Execution Snapshot ---
// Generates the rigid, reliable checklist "Snapshot" for a specific visa.
export const generateApplicationChecklist = async (visaName: string, country: string): Promise<ChecklistStep[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Create a rigid, step-by-step official checklist for the '${visaName}' for ${country}.
      Return exactly 5 to 7 chronological steps. The steps must be actionable.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              requiredDoc: { type: Type.STRING, description: "Name of document if needed, else null" }
            }
          }
        }
      }
    });

    const raw = JSON.parse(response.text || "[]");
    return raw.map((step: any, index: number) => ({
      id: `step-${index}`,
      title: step.title,
      description: step.description,
      requiredDoc: step.requiredDoc,
      isCompleted: false,
      status: index === 0 ? 'active' : 'locked'
    }));
  } catch (error) {
    console.error("Snapshot Generation Failed:", error);
    return [
      { id: 's1', title: 'Check Eligibility', description: 'Verify points score.', isCompleted: false, status: 'active', requiredDoc: 'Passport' },
      { id: 's2', title: 'Language Test', description: 'Take IELTS or equivalent.', isCompleted: false, status: 'locked', requiredDoc: 'IELTS Report' },
      { id: 's3', title: 'Credential Assessment', description: 'Get ECA report.', isCompleted: false, status: 'locked', requiredDoc: 'ECA' },
    ];
  }
};