document.addEventListener('DOMContentLoaded', async () => {
 
    let data;
    try {
        const response = await fetch('/api');
        data = await response.json();
      } catch (err) {
        console.error('Error fetching data:', err);
      }
      
    const chatArea = document.getElementById('chatArea');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    document.querySelectorAll('#helloButton, #sureButton, #alrightButton').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('messageInput').value = this.textContent;
        });
    });

    sendButton.addEventListener('click', async () => {
        const message = messageInput.value.trim();
        const agentID = document.getElementById('agentID').value; // Retrieve the agent ID from the form
        if (message && agentID) {
            const messageObject = {
                agentID, // Include the agent ID in the object
                messageBody: message,
                timestamp: new Date(),
                sender: 'agent',
            };
            addMessageToChatArea(messageObject.messageBody, 'end', messageObject.timestamp);
            messageInput.value = '';
    
            // Save the customer's message to the server
            try {
                await fetch('/api/save-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(messageObject),
                });
            } catch (err) {
                console.error('Error saving customer message:', err);
            }
    
            simulateResponse();
        } else if (!agentID) {
            console.error('Agent ID is missing');
        }
    });

    let responseIndex = 0;
    function simulateResponse() {
        setTimeout(async () => {
            if (responseIndex < data.length) {
                const randomNumber = Math.floor(Math.random() * data.length);
                const response = {
                    messageBody: data[randomNumber].messageBody, 
                    timestamp: data[randomNumber].timestamp,
                    sender: 'customer',
                };
                addMessageToChatArea(response.messageBody, 'start', response.timestamp);
                responseIndex++;
    
                try {
                    await fetch('/api/save-message', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(response),
                    });
                } catch (err) {
                    console.error('Error saving response message:', err);
                }
            }
        }, 1000); // Simulate a delay of 1 second
    }



    function addMessageToChatArea(message, position, timestamp = new Date()) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('d-flex', 'flex-row', 'my-3', 'pt-1');
        messageContainer.classList.add(position === 'end' ? 'justify-content-end' : 'justify-content-start');

        const messageTextContainer = document.createElement('div');
        messageTextContainer.classList.add(position === 'end' ? 'me-1' : 'ms-2');

        const messageText = document.createElement('p');
        messageText.classList.add('small', 'p-2', 'mb-1', 'text-white', 'rounded-3', 'bg-primary');
        messageText.textContent = message;

        const messageTimestamp = document.createElement('p');
        messageTimestamp.classList.add('d-flex', 'small', 'text-muted');
        messageTimestamp.classList.add(position === 'end' ? 'justify-content-end' : 'justify-content-start');
        messageTimestamp.style.fontSize = '0.7rem';
        messageTimestamp.textContent = timestamp;

        const avatar = document.createElement('img');
        avatar.src = position === 'end'
            ? "https://i.postimg.cc/X7JP4HhH/chat-bot-icon-isolated-contour-symbol-illustration-vector.jpg"
            : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp";
        avatar.alt = "avatar";
        avatar.classList.add('rounded-circle');
        avatar.style.width = '40px';
        avatar.style.height = '40px';

        if (position === 'end') {
            messageTextContainer.appendChild(messageText);
            messageTextContainer.appendChild(messageTimestamp);
            messageContainer.appendChild(messageTextContainer);
            messageContainer.appendChild(avatar);
        } else {
            messageContainer.appendChild(avatar);
            messageTextContainer.appendChild(messageText);
            messageTextContainer.appendChild(messageTimestamp);
            messageContainer.appendChild(messageTextContainer);
        }

        chatArea.appendChild(messageContainer);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    try {
        const response = await fetch('/api/get-chat-history');
        const chatHistory = await response.json();
        chatHistory.forEach(message => {
            const position = message.sender === 'customer' ? 'start' : 'end';
            addMessageToChatArea(message.messageBody, position, message.timestamp);
        });
    } catch (err) {
        console.error('Error fetching chat history:', err);
    }

});
