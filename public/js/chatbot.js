const chatbox = document.getElementById('chatbox');
const input = document.getElementById('msg');
const button = document.getElementById('sendBtn');

function appendMessage(sender, text){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<span class="${sender}">${sender}:</span> ${text}`;
    chatbox.appendChild(div);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Send message to backend
async function sendMessage(){
    const message = input.value.trim();
    if(!message) return;
    appendMessage('user', message);
    input.value = '';
    console.log("Sending message:", message);
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        appendMessage('bot', data.reply);
    } catch (err) {
        appendMessage('bot', "Error contacting server.");
        console.error(err);
    }
}

button.addEventListener('click', sendMessage);
input.addEventListener('keypress', e => { if(e.key === 'Enter') sendMessage(); });
