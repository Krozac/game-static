const socket = connectToGame();

function connectToGame() {
    // Extract game ID from the URL (e.g., https://mygame.com/game/abcdefg)
    const urlParams = new URL(window.location.href);
    const gameId = urlParams.pathname.split('/').pop(); // "abcdefg"

    // Resolve WebSocket server address based on the game ID
    fetch(`https://mygame.com/api/getServer?gameId=${gameId}`)
        .then(response => response.json())
        .then(data => {
            if (data.serverAddress) {
                const ws = new WebSocket(`ws://${data.serverAddress}:3000`);
                
                ws.onopen = () => {
                    console.log(`Connected to game: ${gameId}`);
                    ws.send(JSON.stringify({ type: 'JOIN', gameId }));
                };

                ws.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                    console.log("Server:", message);
                };

                ws.onclose = () => console.log("Disconnected from server");
                ws.onerror = (error) => console.error("WebSocket Error", error);
            } else {
                console.error("No server found for this game ID");
            }
        })
        .catch(err => console.error("Error retrieving server:", err));
}

socket.onopen = () => {
    console.log("Connected to game server");
    document.getElementById("server-status").textContent = "Connected to server";
    
    // Send a message to join the game
    socket.send(JSON.stringify({ type: "join", playerName: "Player" + Math.floor(Math.random() * 1000) }));
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Received message from server: ", data);
    if (data.type === "GAME_STATE") {
        updatePlayersList(data.players);
        updateGameState(data.players);
    }
};

socket.onerror = (error) => {
    console.error("WebSocket Error: ", error);
};

socket.onclose = () => {
    console.log("Disconnected from server");
    document.getElementById("server-status").textContent = "Disconnected from server";
};

// Send movement data to the server
document.addEventListener("keydown", (event) => {
    let move = { type: "move", direction: null };
    
    if (event.key === "ArrowUp") move.direction = "up";
    if (event.key === "ArrowDown") move.direction = "down";
    if (event.key === "ArrowLeft") move.direction = "left";
    if (event.key === "ArrowRight") move.direction = "right";

    if (move.direction) {
        socket.send(JSON.stringify(move));
    }
});

// Update player list UI
function updatePlayersList(players) {
    const playerList = document.getElementById("playerList");
    playerList.innerHTML = "";
    
    players.forEach(player => {
        console.log(player)
        const li = document.createElement("li");
        li.textContent = `${player.playerId} (${player.position.x}, ${player.position.y})`;
        playerList.appendChild(li);
    });
}
