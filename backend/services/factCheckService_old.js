const factKeywords = ["percent", "billion", "study", "research", "scientists", "data", "evidence"];

const extractKeyStatements = (text) => {
    return text.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 10).slice(0, 5);
};

const analyzeStatement = (statement) => {
    const lowerStatement = statement.toLowerCase();
    const factKeywordCount = factKeywords.filter(keyword => lowerStatement.includes(keyword)).length;
    const hasNumbers = /\d+/.test(statement);
    const hasNegation = /\bnot\b|\bno\b|\bnever\b/.test(lowerStatement);

    let verdict = "unverified";
    let confidenceScore = 50;

    if (factKeywordCount >= 3 || (hasNumbers && factKeywordCount >= 1)) {
        verdict = "verified";
        confidenceScore = 75 + Math.min(factKeywordCount * 3, 20);
    } else if (factKeywordCount >= 1 || hasNumbers) {
        verdict = "partiallyAccurate";
        confidenceScore = 40 + Math.min(factKeywordCount * 5, 30);
    } else if (hasNegation || lowerStatement.includes("false")) {
        verdict = "false"; 
        confidenceScore = Math.max(25 - factKeywordCount * 5, 5);
    }

    return {
        text: statement,
        verdict,
        confidenceScore,
        sources: [], // ✅ Always return an array
        explanation: "Auto-generated explanation"
    };
};

export const factCheckService = {
    async analyzeText(text) {
        try {
            const statements = extractKeyStatements(text).map(analyzeStatement);
            return { confidenceScore: 50, statements };
        } catch (error) {
            console.error("Error in factCheckService.analyzeText:", error);
            throw error;
        }
    },
};
