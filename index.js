const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta principal para procesar preguntas
app.post('/api/chat', async (req, res) => {
    const prompt = req.body.prompt;

    try {
        // Hacer la solicitud a Hugging Face API
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B',
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer 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`, // Reemplaza con tu token de Hugging Face
                },
            }
        );

        // Enviar la respuesta del modelo GPT
        res.json({ response: response.data });
    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
        res.status(500).json({ error: 'Error al conectar con Hugging Face API' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor de chatbot ejecutándose en http://localhost:${port}`);
});
