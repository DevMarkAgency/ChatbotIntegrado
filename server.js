const app = require('./api/chat');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Servidor de chatbot ejecutándose en el puerto ${PORT}`);
});
