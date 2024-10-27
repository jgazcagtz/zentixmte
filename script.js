document.addEventListener('DOMContentLoaded', () => {
    const openChatBtn = document.getElementById('openChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatContainer = document.getElementById('chatContainer');
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const chatBody = document.getElementById('chatBody');

    openChatBtn.addEventListener('click', () => {
        chatContainer.classList.remove('hidden');
    });

    closeChatBtn.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
    });

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Display user message
        const userMsgDiv = document.createElement('div');
        userMsgDiv.classList.add('message', 'user-message');
        userMsgDiv.textContent = message;
        chatBody.appendChild(userMsgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        userInput.value = '';

        // Send message to backend
        fetch('https://zentixmte.vercel.app/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            if (data.reply) {
                const botMsgDiv = document.createElement('div');
                botMsgDiv.classList.add('message', 'bot-message');
                botMsgDiv.textContent = data.reply;
                chatBody.appendChild(botMsgDiv);
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
