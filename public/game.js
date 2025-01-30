const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

// Store players state
let players = [];

// Update game state and redraw canvas
function updateGameState(newPlayers) {
    players = newPlayers;
    drawGame();
}

// Draw all players on the canvas
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    players.forEach(player => {
        ctx.fillStyle = player.color || "blue"; // Default color
        ctx.fillRect(player.position.x, player.position.y, 20, 20); // Draw player as a square
    });
}
