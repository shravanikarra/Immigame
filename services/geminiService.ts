import { GoogleGenAI, Type } from "@google/genai";
import { VisaOption, ChecklistStep } from "../types";

// @ts-ignore - Injected by Vite config
const API_KEY = process.env.API_KEY || '';
const hasApiKey = API_KEY && API_KEY.length > 0;
const ai = hasApiKey ? new GoogleGenAI({ apiKey: API_KEY }) : null;
const MODEL_NAME = 'gemini-2.5-flash';

// Enhanced fallback data for different intents
const getFallbackVisaOptions = (_citizenship: string, intent: string): VisaOption[] => {
  const baseOptions: Record<string, VisaOption[]> = {
    'Work': [
      { id: 'v1', country: 'Germany', visaName: 'Job Seeker Visa', intent: 'Work', maxDuration: '6 Months', processingTime: '4 Weeks', difficulty: 'Medium', requirementsSummary: 'Degree, Funds for stay, Health insurance' },
      { id: 'v2', country: 'Canada', visaName: 'Express Entry (FSW)', intent: 'Work', maxDuration: 'Permanent', processingTime: '6 Months', difficulty: 'Medium', requirementsSummary: 'Points based on age, education, language' },
      { id: 'v3', country: 'UAE', visaName: 'Remote Work Visa', intent: 'Work', maxDuration: '1 Year', processingTime: '1-2 Weeks', difficulty: 'Low', requirementsSummary: 'Proof of employment, $3.5k monthly salary' },
      { id: 'v4', country: 'Australia', visaName: 'Skilled Independent Visa (189)', intent: 'Work', maxDuration: 'Permanent', processingTime: '8-12 Months', difficulty: 'High', requirementsSummary: 'Skills assessment, points test, English proficiency' },
      { id: 'v5', country: 'Portugal', visaName: 'D7 Passive Income Visa', intent: 'Work', maxDuration: '1 Year (renewable)', processingTime: '3-4 Months', difficulty: 'Low', requirementsSummary: 'Passive income proof, health insurance' }
    ],
    'Study': [
      { id: 'v1', country: 'Germany', visaName: 'Student Visa', intent: 'Study', maxDuration: 'Duration of course', processingTime: '4-8 Weeks', difficulty: 'Low', requirementsSummary: 'University admission, financial proof, health insurance' },
      { id: 'v2', country: 'Canada', visaName: 'Study Permit', intent: 'Study', maxDuration: 'Duration of course + 90 days', processingTime: '8-12 Weeks', difficulty: 'Medium', requirementsSummary: 'Letter of acceptance, financial proof, medical exam' },
      { id: 'v3', country: 'UK', visaName: 'Student Visa (Tier 4)', intent: 'Study', maxDuration: 'Duration of course', processingTime: '3 Weeks', difficulty: 'Medium', requirementsSummary: 'CAS from university, financial proof, English test' },
      { id: 'v4', country: 'Australia', visaName: 'Student Visa (Subclass 500)', intent: 'Study', maxDuration: 'Duration of course', processingTime: '4-8 Weeks', difficulty: 'Medium', requirementsSummary: 'COE, financial capacity, health insurance' },
      { id: 'v5', country: 'Netherlands', visaName: 'Student Residence Permit', intent: 'Study', maxDuration: 'Duration of course', processingTime: '2-3 Months', difficulty: 'Low', requirementsSummary: 'University admission, financial proof, health insurance' }
    ],
    'Tourism': [
      { id: 'v1', country: 'Schengen Area', visaName: 'Schengen Tourist Visa', intent: 'Tourism', maxDuration: '90 days', processingTime: '2-4 Weeks', difficulty: 'Low', requirementsSummary: 'Travel itinerary, hotel bookings, travel insurance' },
      { id: 'v2', country: 'Japan', visaName: 'Tourist Visa', intent: 'Tourism', maxDuration: '15-90 days', processingTime: '5-7 Days', difficulty: 'Low', requirementsSummary: 'Passport, itinerary, financial proof' },
      { id: 'v3', country: 'UK', visaName: 'Standard Visitor Visa', intent: 'Tourism', maxDuration: '6 Months', processingTime: '3 Weeks', difficulty: 'Low', requirementsSummary: 'Travel plans, financial proof, accommodation' },
      { id: 'v4', country: 'Australia', visaName: 'Visitor Visa (Subclass 600)', intent: 'Tourism', maxDuration: '3-12 Months', processingTime: '2-4 Weeks', difficulty: 'Low', requirementsSummary: 'Travel itinerary, financial proof, health insurance' },
      { id: 'v5', country: 'New Zealand', visaName: 'Visitor Visa', intent: 'Tourism', maxDuration: '9 Months', processingTime: '2-3 Weeks', difficulty: 'Low', requirementsSummary: 'Travel plans, financial proof, return ticket' }
    ]
  };
  
  return baseOptions[intent] || baseOptions['Work'];
};

// Enhanced fallback checklist data
const getFallbackChecklist = (visaName: string, country: string): ChecklistStep[] => {
  const checklists: Record<string, ChecklistStep[]> = {
    'Job Seeker Visa': [
      { id: 's1', title: 'Verify Eligibility', description: 'Check if you meet the basic requirements (degree, funds, health insurance).', isCompleted: false, status: 'active', requiredDoc: 'Passport' },
      { id: 's2', title: 'Gather Documents', description: 'Collect degree certificates, CV, proof of funds, and health insurance.', isCompleted: false, status: 'locked', requiredDoc: 'Degree Certificate, Bank Statements' },
      { id: 's3', title: 'Apply Online', description: 'Submit application through the official embassy/consulate portal.', isCompleted: false, status: 'locked', requiredDoc: 'Application Form' },
      { id: 's4', title: 'Schedule Appointment', description: 'Book an appointment for biometrics and document verification.', isCompleted: false, status: 'locked' },
      { id: 's5', title: 'Wait for Decision', description: 'Processing typically takes 4-8 weeks. Track your application status.', isCompleted: false, status: 'locked' }
    ],
    'Express Entry (FSW)': [
      { id: 's1', title: 'Language Test', description: 'Take IELTS or CELPIP (English) or TEF (French) and achieve required scores.', isCompleted: false, status: 'active', requiredDoc: 'IELTS/CELPIP/TEF Results' },
      { id: 's2', title: 'Educational Credential Assessment', description: 'Get your degree assessed by WES, ICAS, or other approved organizations.', isCompleted: false, status: 'locked', requiredDoc: 'ECA Report' },
      { id: 's3', title: 'Create Express Entry Profile', description: 'Submit your profile with all details and documents online.', isCompleted: false, status: 'locked', requiredDoc: 'Passport, ECA, Language Test' },
      { id: 's4', title: 'Receive ITA', description: 'Wait for Invitation to Apply if your CRS score is high enough.', isCompleted: false, status: 'locked' },
      { id: 's5', title: 'Submit Full Application', description: 'Complete and submit your permanent residence application within 60 days.', isCompleted: false, status: 'locked', requiredDoc: 'Medical Exam, Police Certificate' },
      { id: 's6', title: 'Background Check', description: 'IRCC will verify all information and conduct security checks.', isCompleted: false, status: 'locked' }
    ]
  };
  
  // Default checklist if specific one not found
  const defaultChecklist: ChecklistStep[] = [
    { id: 's1', title: 'Check Eligibility', description: `Verify you meet the requirements for ${visaName} in ${country}.`, isCompleted: false, status: 'active', requiredDoc: 'Passport' },
    { id: 's2', title: 'Gather Required Documents', description: 'Collect all necessary documents as per visa requirements.', isCompleted: false, status: 'locked', requiredDoc: 'Required Documents' },
    { id: 's3', title: 'Complete Application Form', description: 'Fill out the official visa application form accurately.', isCompleted: false, status: 'locked', requiredDoc: 'Application Form' },
    { id: 's4', title: 'Schedule Appointment', description: 'Book an appointment at the embassy or visa center.', isCompleted: false, status: 'locked' },
    { id: 's5', title: 'Submit Application', description: 'Submit your application with all documents and pay fees.', isCompleted: false, status: 'locked' },
    { id: 's6', title: 'Track Application', description: 'Monitor your application status and respond to any requests.', isCompleted: false, status: 'locked' }
  ];
  
  const key = `${visaName}`;
  return checklists[key] || defaultChecklist;
};

// --- Phase 1: The Discovery Matrix ---
// Queries the "Privilege Graph" to find viable options.
export const discoverVisaOptions = async (citizenship: string, intent: string): Promise<VisaOption[]> => {
  // If no API key, use fallback data immediately
  if (!hasApiKey) {
    console.log('No API key provided, using fallback data');
    return getFallbackVisaOptions(citizenship, intent);
  }
  
  try {
    const response = await ai!.models.generateContent({
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
    // Fallback to enhanced data
    return getFallbackVisaOptions(citizenship, intent);
  }
};

// --- Phase 2: The Execution Snapshot ---
// Generates the rigid, reliable checklist "Snapshot" for a specific visa.
export const generateApplicationChecklist = async (visaName: string, country: string): Promise<ChecklistStep[]> => {
  // If no API key, use fallback data immediately
  if (!hasApiKey) {
    console.log('No API key provided, using fallback checklist');
    return getFallbackChecklist(visaName, country);
  }
  
  try {
    const response = await ai!.models.generateContent({
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
    // Fallback to enhanced checklist
    return getFallbackChecklist(visaName, country);
  }
};