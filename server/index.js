const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const openai = require('openai');
require('dotenv').config(); // Load environment variables from .env file
const app = express();
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
        // Access form inputs using req.body
        const formData = req.body;

        // Access uploaded file details using req.file
        const uploadedFile = req.file;

        // Extract API key from environment variables
        const apiKey = process.env.OPENAI_API_KEY;

        // Ensure API key is provided
        if (!apiKey) {
            return res.status(400).json({ error: "API key is required" });
        }

        // Process form data and uploaded file as needed
        // For example, save form data to the database and respond with a success message

        // Call function to generate resume using OpenAI
        const generatedResume = await generateResume(formData, apiKey);

        // Respond with success message and generated resume
        res.json({
            message: "Form data and file uploaded successfully",
            formData: formData,
            uploadedFile: uploadedFile,
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
        // Construct prompt for generating resume
        let prompt = `Generate a resume for ${formData.fullName}, who currently works as a ${formData.currentPosition} with ${formData.currentLength} years of experience.\n\n`;
        prompt += `Skills: ${formData.currentTechnologies.join(', ')}\n\n`;
        prompt += `Work History:\n`;
        formData.workHistory.forEach((company) => {
            prompt += `- ${company.name}: ${company.position}\n`;
        });
        // Create OpenAI client with user's API key
        const openaiClient = new openai.OpenAI(apiKey);

        // Call OpenAI API to generate resume
        const response = await openaiClient.completions.create({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.6,
            max_tokens: 250,
            top_p: 1,
            frequency_penalty: 1,
            presence_penalty: 1,d
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
