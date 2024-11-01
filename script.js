document.addEventListener('DOMContentLoaded', () => {
    const openChatBtn = document.getElementById('openChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatContainer = document.getElementById('chatContainer');
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const chatBody = document.getElementById('chatBody');

    // Show chat container
    openChatBtn.addEventListener('click', () => {
        chatContainer.classList.remove('hidden');
    });

    // Hide chat container
    closeChatBtn.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
    });

    // Send message on button click or Enter key press
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return; // Prevent sending empty messages

        // Display user message
        const userMsgDiv = document.createElement('div');
        userMsgDiv.classList.add('message', 'user-message');
        userMsgDiv.textContent = message;
        chatBody.appendChild(userMsgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Clear the input field
        userInput.value = '';

        // Display loading message
        const loadingMsgDiv = document.createElement('div');
        loadingMsgDiv.classList.add('message', 'bot-message');
        loadingMsgDiv.textContent = 'Zentix está escribiendo...';
        chatBody.appendChild(loadingMsgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            // Send message to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            loadingMsgDiv.remove(); // Remove the loading message

            if (data.reply) {
                const botMsgDiv = document.createElement('div');
                botMsgDiv.classList.add('message', 'bot-message');
                botMsgDiv.textContent = data.reply;
                chatBody.appendChild(botMsgDiv);
                chatBody.scrollTop = chatBody.scrollHeight;
            } else {
                throw new Error('No reply found in response');
            }
        } catch (error) {
            console.error('Error fetching the reply from the backend:', error);

            loadingMsgDiv.remove(); // Remove the loading message

            // Display error message to the user
            const errorMsgDiv = document.createElement('div');
            errorMsgDiv.classList.add('message', 'bot-message', 'error-message');
            errorMsgDiv.textContent = 'Lo siento, hubo un problema al procesar tu solicitud. Por favor intenta nuevamente.';
            chatBody.appendChild(errorMsgDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }
});
