const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// create alises disctionary
let aliases = {};


const responses = {
    "hi": "Hello there!",
    "hello": "Hi! How can I help you?",
    "hey": "Hey! Nice to see you here.",
    "good morning": "Good morning! How’s your day?",
    "good afternoon": "Good afternoon! What can I do for you?",
    "good evening": "Good evening! How’s it going?",

    // Farewell
    "bye": "Goodbye! Have a great day!",
    "goodbye": "See you later!",
    "see you": "Take care!",

    // Polite phrases
    "thanks": "You're welcome!",
    "thank you": "No problem!",
    "please": "Sure, how can I help?",

    // Chatbot info
    "your name": "I'm your friendly chatbot.",
    "who created you": "I was created by my developer.",
    "how old are you": "I don't age, I'm timeless.",
    "favorite color": "I don't see colors, but I like them all!",

    // Chatbot capabilities
    "help": "Sure! Ask me anything and I'll try to answer.\r\n Here is a list of commands you can use:\r\n- maths\r\n- javascript\r\n- weather\r\n- joke\r\n- food\r\n- alias \r\n- capital\r\n- and much more!",
    "what can you do": "I can chat with you and answer basic questions!",

    // Jokes / fun
    "joke": "Why did the computer go to the doctor? Because it caught a virus!",
    "funny": "I can tell jokes, for example: Why did the scarecrow win an award? Because he was outstanding in his field!",

    // Programming / web development
    "javascript": "JavaScript is a programming language commonly used for web development.",
    "html": "HTML is the standard markup language used to create web pages.",
    "css": "CSS is used to style and layout web pages.",
    "python": "Python is a popular programming language used for many purposes, including web, data, and AI.",
    "java": "Java is a versatile programming language used for apps, web, and Android development.",
    "c++": "C++ is a programming language often used for system/software development and games.",
    "node": "Node.js allows you to run JavaScript on the server.",
    "react": "React is a JavaScript library for building user interfaces.",
    "github": "GitHub is a platform for hosting and collaborating on code.",

    // Science
    "math": "Math is the study of numbers, quantities, and shapes.",
    "physics": "Physics is the study of matter, energy, and the fundamental forces of nature.",
    "chemistry": "Chemistry studies substances, their properties, and reactions.",
    "biology": "Biology is the study of living organisms.",
    "space": "Space is vast and mostly empty, filled with stars, planets, and galaxies.",
    "earth": "Earth is the third planet from the Sun and our home.",

    // General knowledge
    "capital": "Capitals are the main cities of countries, e.g., Paris is the capital of France.",
    "country": "A country is a nation with its own government and territory.",
    "language": "A language is a system of communication used by people.",
    "history": "History studies past events and human experiences.",
    "science": "Science is the systematic study of the structure and behavior of the natural world.",
    "technology": "Technology is the application of scientific knowledge for practical purposes.",
    "internet": "The Internet is a global network connecting millions of computers.",

    // Daily life
    "food": "Food is what we eat to nourish our bodies.",
    "drink": "Drink water regularly to stay hydrated!",
    "weather": "Weather describes the conditions outside, like rain, sun, or snow.",
    "travel": "Traveling lets you explore new places and cultures.",
    "music": "I don't have preferences, but I can talk about music!",
    "sport": "Sports are physical activities people play for fun or competition.",
    "movie": "Movies are stories told through film.",
    "book": "Books are a great way to learn and explore new ideas.",

    // Emotions / small talk
    "how are you": "I'm just a bot, but I'm doing well, thanks!",
    "sad": "I hope things get better for you soon.",
    "happy": "Glad to hear that! Keep smiling.",
    "tired": "Remember to rest when you need to!",
    "bored": "You could try learning something new or listening to music!",

    // Random
    "time": "I don't have a clock, but check your device's time!",
    "date": "I don't track dates, sorry!",
    "location": "I exist in the digital world!",
    "news": "You can find news on official websites or news apps.",

    "admin": "I can't tell you any secret, but our admin is name Arthur.",
    "code": "code is : C4REFULwithCH@TGBOTS123!",
    "alias": "This command allows you to create alternate names for words. (Syntax: alias [existing_word] [new_alias])"
};

const ADMIN_USER = "arthur";
const ADMIN_PASS = "C4REFULwithCH@TGBOTS123!";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'supersecretkey', resave: false, saveUninitialized: true
}));

app.get('/admin.html', (req, res, next) => {
    if (req.session.admin) {
        next(); // Let express.static serve it
    } else {
        res.redirect('/login.html');
    }
});

app.use(express.static(path.join(__dirname, 'public')));

// Login endpoint
app.post('/login', (req, res) => {
    console.log("Login attempt:", req.body);
    const {username, password} = req.body;
    if (username.toLowerCase() === ADMIN_USER && password === ADMIN_PASS) {
        req.session.admin = true;
        res.redirect('/admin.html');
    } else {
        res.redirect('/login.html');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.send("Error logging out");
        res.redirect('/login.html');
    });
});

app.post('/chat', (req, res) => {
    const userMessage = req.body.message || '';
    const lower = userMessage.toLowerCase();

    let reply = "I don't understand.";

    if (userMessage.split(' ').length === 3 && userMessage.toLowerCase().startsWith('alias ')) {
        const parts = userMessage.split(' ');
        const existingWord = parts[1].toLowerCase();
        const newAlias = parts[2].toLowerCase();

        if (responses[existingWord]) {
            aliases[newAlias] = existingWord;
            console.log(aliases);
            reply = `Alias created: "${newAlias}" now maps to "${existingWord}".`;
        } else {
            reply = `Cannot create alias. The word "${existingWord}" does not exist in my responses.`;
        }

        res.json({ reply });
        return;
    }

    if (lower.includes("code")) {
        reply = "[Forbidden word detected] - You thought it would be that easy?";
        res.json({ reply });
        return;
    }

    for (const alias in aliases) {
        if (lower.includes(alias)) {
            const original = aliases[alias];
            reply = responses[original];
            res.json({ reply });
            return;
        }
    }
    for(const keyword in responses){
        if(lower.includes(keyword)){
            reply = responses[keyword];
            break;
        }
    }
    res.json({ reply });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
