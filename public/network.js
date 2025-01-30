const socket = connectToGame();

function connectToGame() {
    // Extract game ID from the URL path (e.g., https://theoguenezan.fr/game/abcdefg)
    const gameId = window.location.pathname.split('/')[2]; // "abcdefg"

    // Resolve WebSocket server address based on the game ID
    fetch(`http://2.9.223.82:5500/resolve/${gameId}`)
        .then(response => response.json())
        .then(data => {
            if (data.ip) {
                const ws = new WebSocket(`ws://${data.ip}:3000`);
                
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