const express = require('express');
const axios = require('axios');
const fs = require('fs');
const fuzzy = require('fuzzy');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Cargar el archivo JSON de datasets
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// Ruta principal para procesar preguntas
app.post('/api/chat', async (req, res) => {
    const userPrompt = req.body.prompt.toLowerCase();

    // Buscar si el prompt coincide con los datos en JSON usando fuzzy matching
    const options = {
        extract: (item) => item.prompt.toLowerCase(),
    };
    const result = fuzzy.filter(userPrompt, data, options);
    const bestMatch = result[0] ? result[0].original : null;

    if (bestMatch) {
        // Si se encuentra una coincidencia en el JSON, devolver esa respuesta
        res.json({ response: bestMatch.response });
    } else {
        // Si no hay coincidencia, hacer la solicitud a la API de Hugging Face
        try {
            const response = await axios.post(
                'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B',
                {
                    inputs: `Actúa como un asistente técnico. Si alguien pregunta algo, responde de manera profesional y da información técnica detallada.\nUsuario: ${userPrompt}\nAsistente:`
                },
                {
                    headers: {
                        Authorization: `Bearer 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`, // Tu token de Hugging Face
                    },
                }
            );

            // Enviar la respuesta del modelo GPT
            res.json({ response: response.data });
        } catch (error) {
            console.error('Error al hacer la solicitud:', error);
            res.status(500).json({ error: 'Error al conectar con Hugging Face API' });
        }
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor de chatbot ejecutándose en http://localhost:${port}`);
});
