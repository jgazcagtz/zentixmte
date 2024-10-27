const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Método no permitido' });
        return;
    }

    const { message } = req.body;

    if (!message) {
        res.status(400).json({ error: 'No se proporcionó ningún mensaje' });
        return;
    }

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "Eres Zentix, un chatbot profesional desarrollado por MiniTienda Express. Ayuda a los usuarios con atención al cliente, soporte en ventas y consultas generales."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const reply = response.data.choices[0].message.content.trim();
        res.status(200).json({ reply: reply });
    } catch (error) {
        console.error('Error al conectar con OpenAI:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
};
