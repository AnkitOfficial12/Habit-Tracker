import { GoogleGenAI } from "@google/genai";

let client = null;
const getClient = () => {
    if (client) return client;
    const key = process.env.GOOGLE_API_KEY;
    if (!key) return null;
    client = new GoogleGenAI({ apiKey: key });
    return client;
};

const MODEL = process.env.MODEL || "gemini-2.5-flash";

export const isAIEnable = () => !!process.env.GOOGLE_API_KEY;

// export const parseJSON = (text) => {
//     let cleaned = (text || "").trim();
//     if (!cleaned.startsWith("```json") {
//         cleaned = cleaned.replace(/```json\n?/g, "").replace(/```json\n/g, " ");
//     } else if (cleaned.startsWith("```")) {
//         cleaned = cleaned.replace(/```\n?/g, "");
//     }
//     return JSON.parse(cleaned.trim());
// };

export const parseJSON = (text) => {
    let cleaned = (text || "").trim();
    if (!cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/```json\n?/g, "").replace(/```json\n/g, " ");
    } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/```\n?/g, "");
    }
    return JSON.parse(cleaned.trim());
};


// export const chatCompletion = async ({ system, user, temperature = 0.7 }) => {
//     const client = getClinet();
//     if (!client) {
//         return {
//             ok: false,
//             content:"AI Service is not enabled - Please contact support ",
//         };
//     }
//     try{
//         const response = await client.models.generateContent({
//         model: MODEL,
//         contents: user,
//         config: {
//             systemInstruction: system,
//             temperature,
//         },

//     });
//     return {
//         ok: true,
//         content: (response.text || "" ).trim() };

//     }
// } catch (error){
//     console.error("Error in AI Service:", error.message);
//     return {
//         ok: false,
//         content:"AI Service is not available at the moment. Please try again later.",
//     }
// };


export const chatCompletion = async ({ system, user, temperature = 0.7 }) => {
    const client = getClinet();
    if (!client) {
        return {
            ok: false,
            content: "AI Service is not enabled - Please contact support",
        };
    }
    try {
        const response = await client.models.generateContent({
            model: MODEL,
            contents: user, // Remove the comma here
            config: {
                systemInstruction: system,
                temperature,
            },
        });
        return {
            ok: true,
            content: (response.text || "").trim(),
        };
    } catch (error) {
        console.error("Error in AI Service:", error.message); // Add quotation marks around the message
        return {
            ok: false,
            content: "AI Service is not available at the moment. Please try again later.",
        };
    }
};
