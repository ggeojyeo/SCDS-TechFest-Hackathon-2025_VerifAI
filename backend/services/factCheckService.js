import axios from 'axios';
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const GOOGLE_FACTCHECK_API = "https://factchecktools.googleapis.com/v1alpha1/claims:search";

// 🔹 Load API Key from Environment
const GOOGLE_FACT_CHECK_API_KEY = process.env.GOOGLE_FACT_CHECK_API_KEY;

const fetchFactCheck = async (statement) => {
    try {
        const response = await axios.get(GOOGLE_FACTCHECK_API, {
            params: { query: statement, key: GOOGLE_FACT_CHECK_API_KEY },
            timeout: 5000,
        });

        console.log("✅ API Response:", JSON.stringify(response.data, null, 2)); // Debugging log

        if (!response.data.claims || response.data.claims.length === 0) {
            return [];
        }

        return response.data.claims.map(claim => ({
            text: claim.text || "Unknown Fact",
            claimant: claim.claimant || "Unknown",
            claimDate: claim.claimDate || "Unknown",
            sources: claim.claimReview && claim.claimReview.length > 0
                ? claim.claimReview.map(review => ({
                    title: review.title || "No Title",
                    publisher: review.publisher?.name || "Unknown Source",
                    url: review.url || "#",
                    textualRating: review.textualRating || "No rating available",
                    reviewDate: review.reviewDate || "Unknown Date"
                }))
                : []
        }));
    } catch (error) {
        console.error("❌ API Request Failed:", error.response?.data || error.message);
        return [];
    }
};

const analyzeStatement = async (statement) => {
    const factCheckResults = await fetchFactCheck(statement);
    let verdict = "unverified";
    let sources = [];

    if (factCheckResults.length > 0) {
        sources = factCheckResults.flatMap(claim => claim.sources);
    }

    return {
        text: statement,
        verdict,
        sources,
        explanation: sources.length > 0 ? `Fact-checked by ${sources.length} sources` : "Auto-generated explanation",
    };
};

export const factCheckService = {
    async analyzeText(text) {
        try {
            const statements = text.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 10);
            const analyzedStatements = await Promise.all(statements.map(analyzeStatement));
            return {
                statements: analyzedStatements,
            };
        } catch (error) {
            console.error("Error in factCheckService.analyzeText:", error);
            throw error;
        }
    },
};
