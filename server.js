require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// Serve files from the 'public' folder
app.use(express.static(__dirname));
app.use(express.json());

// Fallback logic if API key is missing or breaks
const getFallbackData = () => ({
    technical: [
        "What is your experience with the main technologies listed in the job description?",
        "Can you explain a complex technical problem you solved recently?",
        "How do you approach debugging in a new codebase?"
    ],
    behavioral: [
        "Tell me about a time you worked under a tight deadline.",
        "How do you handle disagreements with a team member?",
        "Describe a situation where you had to learn a new skill quickly."
    ],
    caseStudy: [
        "If our main database went down during peak hours, walk me through the steps you would take to identify and resolve the issue."
    ]
});

app.post('/api/generate', async (req, res) => {
    const { jobDescription } = req.body;

    if (!jobDescription) {
        return res.status(400).json({ error: "Job description is required" });
    }

    // Fallback if no API Key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_api_key_here') {
        console.log("No API Key found. Returning fallback data.");
        return res.json(getFallbackData());
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are an expert tech recruiter. Analyze the following job description and generate interview questions for a junior candidate.
You must return exactly 3 technical questions, 3 behavioral/HR questions, and 1 case study question.
Return the result STRICTLY as a valid JSON object with the following keys: "technical" (array of strings), "behavioral" (array of strings), and "caseStudy" (array of strings). Do not include markdown formatting or any other text.`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Job Description: ${jobDescription}` }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const resultText = response.choices[0].message.content;
        const parsedResult = JSON.parse(resultText);
        res.json(parsedResult);

    } catch (error) {
        console.error("OpenAI API Error:", error.message);
        // Fallback in case of API failure
        res.json(getFallbackData());
    }
});

app.listen(port, () => {
    console.log(`SKILLUP server running at http://localhost:${port}`);
});
