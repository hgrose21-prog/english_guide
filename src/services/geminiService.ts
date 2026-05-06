import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Curriculum {
  overview: string;
  situationalPhrases: {
    situation: string;
    phrases: {
      original: string;
      pronunciation: string;
      meaning: string;
      tip?: string;
    }[];
  }[];
  keyVocabulary: {
    word: string;
    meaning: string;
  }[];
  culturalTips: string[];
}

export async function generateCurriculum(
  language: string,
  duration: string,
  level: string,
  goal: string
): Promise<Curriculum> {
  const prompt = `
    You are a professional travel language coach. Create a personalized learning curriculum for a traveler.
    
    Target Language: ${language}
    Duration: ${duration}
    Current Level: ${level}
    Learning Goal: ${goal}
    
    Provide the content in Korean (except for the target language phrases).
    The curriculum should include:
    1. A brief overview of the learning path.
    2. 3-4 situational categories (e.g., Airport, Restaurant, Shopping) with relevant phrases, their pronunciations (in Korean phonetics), and meanings.
    3. Essential vocabulary.
    4. 3-4 Must-know cultural etiquette tips for the target country.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          situationalPhrases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                situation: { type: Type.STRING },
                phrases: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      original: { type: Type.STRING },
                      pronunciation: { type: Type.STRING },
                      meaning: { type: Type.STRING },
                      tip: { type: Type.STRING },
                    },
                    required: ["original", "pronunciation", "meaning"],
                  },
                },
              },
              required: ["situation", "phrases"],
            },
          },
          keyVocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                meaning: { type: Type.STRING },
              },
              required: ["word", "meaning"],
            },
          },
          culturalTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["overview", "situationalPhrases", "keyVocabulary", "culturalTips"],
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse curriculum JSON:", e);
    throw new Error("학습 콘텐츠를 생성하는 중 오류가 발생했습니다.");
  }
}
