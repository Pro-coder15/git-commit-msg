// git-commit-generator/server/index.js (FINAL VERSION)

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
// NOTE: We change the require name to match the final generator file structure
const generate = require('./generator'); 

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
// Serves static files from the 'public' folder
app.use(express.static(path.join(__dirname, "../public"))); 

// Routes

// 1. POST route to generate commit messages
app.post("/generate", (req, res) => {
    // Expect diff, text, and category from the frontend
    const { diff, text, category } = req.body || {}; 

    if (!diff && !text) {
        return res.status(400).json({ error: "Provide either a diff or a description" });
    }

    // Call the generator function (which returns an array of options)
    const options = generate({ diff, text, category }); 
    
    // Respond with the array of options
    res.json({ options });
});

// 2. GET route to serve the main HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(` ✅  Server running at http://localhost:${PORT}`);
});
