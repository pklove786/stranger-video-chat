const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let waitingUser = null;

app.use(express.static('public'));

io.on('connection', socket => {
    if (waitingUser) {
        socket.partner = waitingUser;
        waitingUser.partner = socket;

        socket.emit('connected');
        waitingUser.emit('connected');

        waitingUser = null;
    } else {
        waitingUser = socket;
    }

    socket.on('message', msg => {
        if (socket.partner) {
            socket.partner.emit('message', msg);
        }
    });

    socket.on('disconnect', () => {
        if (socket.partner) {
            socket.partner.emit('partner-disconnected');
            socket.partner.partner = null;
        }
        if (waitingUser === socket) {
            waitingUser = null;
        }
    });
});

http.listen(3000, () => console.log("Server running on http://localhost:3000"));
