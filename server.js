const app = require('./api/chat');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor de chatbot ejecutándose en http://localhost:${port}`);
});
