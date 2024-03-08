const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const openai = require('openai');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4000; // Use PORT environment variable or default to 4000
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
});
// Route to handle form submission and file upload
app.post("/resume/create", upload.single("headshotImage"), async (req, res) => {
    try {
        const formData = req.body;
        const uploadedFile = req.file;

        // Check if headshotImage is uploaded (optional)
        if (uploadedFile) {
            formData.headshotImage = uploadedFile;
        }

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return res.status(400).json({ error: "OpenAI API key is required" });
        }

        const generatedResume = await generateResume(formData, apiKey);
        res.json({
            message: "Form data and file uploaded successfully",
            formData: formData,
            generatedResume: generatedResume
        });
    } catch (error) {
        console.error("Error handling form submission:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Function to generate a resume using OpenAI
async function generateResume(formData, apiKey) {
    try {
        // Convert formData.workHistory to an array if it's not already
        const workHistory = Array.isArray(formData.workHistory) ? formData.workHistory : [formData.workHistory];
        const technologies = Array.isArray(formData.currentTechnologies) ? formData.currentTechnologies : [formData.currentTechnologies];
        // Construct prompt for generating resume
        let prompt = `Generate a resume for ${formData.fullName}, who currently works as a ${formData.currentPosition} with ${formData.currentLength} years of experience.\n\n`;
        prompt += `Skills: ${technologies.join(', ')}\n\n`;
        prompt += `Work History:\n`;
        workHistory.forEach((company) => {
            prompt += `- ${company.name}: ${company.position}\n`;
        });
        
        // Create OpenAI client with user's API key
        const openaiClient = new openai.OpenAI(apiKey);
        // Call OpenAI API to generate resume
        const response = await openaiClient.completions.create({
            model: "gpt-3.5-turbo",
            prompt: prompt,
            temperature: 0.6,
            max_tokens: 250,
            top_p: 1,
            frequency_penalty: 1,
            presence_penalty: 1,
        });
        // Return generated resume
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error("Error generating resume:", error);
        throw error;
    }
}
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
