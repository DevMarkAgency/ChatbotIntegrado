const express = require('express');
const axios = require('axios');
const fs = require('fs');
const fuzzy = require('fuzzy');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B';
const HUGGING_FACE_TOKEN = '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';

const getHuggingFaceResponse = async (userPrompt) => {
    try {
        const response = await axios.post(HUGGING_FACE_API_URL, {
            inputs: `Actúa como un asistente técnico. Si alguien pregunta algo, responde de manera profesional y da información técnica detallada.\nUsuario: ${userPrompt}\nAsistente:`,
        }, {
            headers: {
                Authorization: `Bearer ${HUGGING_FACE_TOKEN}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al hacer la solicitud a Hugging Face API:', error);
        throw new Error('Error al conectar con Hugging Face API');
    }
};

app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'El prompt es requerido.' });
    }

    const userPrompt = prompt.toLowerCase();

    try {
        const options = {
            extract: (item) => item.prompt.toLowerCase(),
        };
        const result = fuzzy.filter(userPrompt, data, options);
        const bestMatch = result[0] ? result[0].original : null;

        if (bestMatch) {
            return res.json({ response: bestMatch.response });
        } else {
            const huggingFaceResponse = await getHuggingFaceResponse(userPrompt);
            res.json({ response: huggingFaceResponse });
        }
    } catch (error) {
        console.error('Error processing the chat request:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


module.exports = app;
