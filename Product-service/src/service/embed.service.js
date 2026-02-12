const { GoogleGenAI, MaskReferenceImage } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_KEY
})

async function main(con) {
    try {
        const textToEmbed = typeof con === 'string' ? con : JSON.stringify(con);
        const response = await ai.models.embedContent({
            model: "gemini-embedding-001",
            contents: {
                parts: [{ text: textToEmbed }]
            }
        });
        // The previous code accessed response.embeddings[0].values
        // If the new SDK returns singular 'embedding', we might need to adjust.
        // But since the previous code had 'embeddings[0]', I'll assume that's the return shape.
        // However, if the user's code failed silently or was never reached, that's a risk.
        // I will check if response.embedding exists.

        if (response.embedding) {
            return response.embedding.values;
        }
        return response.embeddings[0].values;
    } catch (error) {
        // Fallback: try passing contents as just the string, as the original code did
        try {
            const textToEmbed = typeof con === 'string' ? con : JSON.stringify(con);
            const response = await ai.models.embedContent({
                model: "gemini-embedding-001",
                contents: textToEmbed,
            });
            if (response.embedding) {
                return response.embedding.values;
            }
            return response.embeddings[0].values;
        } catch (innerError) {
            console.error("Error in embedding:", innerError);
            throw innerError;
        }
    }
}

module.exports = main;