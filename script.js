const socket = io();
const input = document.getElementById('input');
const messages = document.getElementById('messages');

socket.on('connected', () => {
    messages.innerHTML += "<div><em>Connected to a stranger!</em></div>";
});

socket.on('message', msg => {
    messages.innerHTML += "<div>Stranger: " + msg + "</div>";
});

socket.on('partner-disconnected', () => {
    messages.innerHTML += "<div><em>Stranger disconnected.</em></div>";
});

input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        const msg = input.value;
        messages.innerHTML += "<div>You: " + msg + "</div>";
        socket.emit('message', msg);
        input.value = '';
    }
});
