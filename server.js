const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};       // socketId -> username
let chatHistory = []; // store messages

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (username) => {
        users[socket.id] = username;
        io.emit("user-list", Object.values(users));
    });

    socket.on("chat message", (data) => {
        chatHistory.push(data);
        io.emit("chat message", data);
    });

    socket.on("private message", ({ to, message, from }) => {
        for (let id in users) {
            if (users[id] === to) {
                io.to(id).emit("private message", { from, message });
            }
        }
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("user-list", Object.values(users));
        console.log("User disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
