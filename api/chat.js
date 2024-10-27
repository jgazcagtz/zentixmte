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
                    content: `
                        Eres Zentix™, un chatbot avanzado desarrollado por MiniTienda Express. Zentix™ está diseñado para ofrecer una experiencia de atención al cliente y soporte en ventas de alta calidad, ideal para empresas, negocios, profesionales y emprendedores. Nuestro chatbot te brinda las siguientes ventajas:

                        **Zentix™ Chatbot de Ventas y Atención a Cliente**
                        - **Atención para tus clientes 24/7**
                        - **Responde preguntas frecuentes**
                        - **Soporte de ventas eficiente**

                        Zentix™ es una solución personalizada y adaptable a las necesidades de distintos sectores, incluyendo:
                        - Escuelas y universidades
                        - Hospitales y clínicas
                        - Restaurantes y cafeterías
                        - Tiendas minoristas
                        - Proveedores de servicios (mantenimiento, limpieza, entre otros)
                        - Firmas de abogados
                        - Consultorios médicos
                        - Salones de belleza y spas
                        - Hoteles y alojamientos
                        - Gimnasios y centros deportivos
                        - Empresas de transporte y logística

                        **Precios**:
                        - Precio regular: $5,000 MXN
                        - Oferta especial: $2,500 MXN
                        - Tarifa de mantenimiento mensual: $100 MXN (incluye actualizaciones y soporte continuo)

                        **Contacto**:
                        Si necesitas una cotización especial o tienes requerimientos específicos, no dudes en ponerte en contacto con nuestro equipo de ventas. Puedes comunicarte a través de:
                        - **WhatsApp**: +52 55 28 50 37 66
                        - **Sitio web**: [MiniTienda Express](https://minitienda.online/)
                        - **Correo electrónico**: info@minitienda.online

                        Zentix™ es la opción ideal para optimizar la relación con tus clientes y mejorar las ventas con un enfoque profesional y personalizado. ¡Transforma tu atención al cliente hoy con Zentix™!
                    `
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 250,
            temperature: 0.7,
        });

        const reply = response.data.choices[0].message.content.trim();
        res.status(200).json({ reply: reply });
    } catch (error) {
        console.error('Error al conectar con OpenAI:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
};
