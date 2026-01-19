const socket = io();

function sendMessage() {
    const message = document.getElementById("message").value;
    socket.emit("chat message", message);
    document.getElementById("message").value = "";
}

socket.on("chat message", (msg) => {
    const chatBox = document.getElementById("chat-box");
    const p = document.createElement("p");
    p.innerText = msg;
    chatBox.appendChild(p);
});
