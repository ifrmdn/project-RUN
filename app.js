// user stories:
// As I user I want to see a background.
// as i user i want to see a maze so i can play.
// As I user I should be able to start the game.
// As I user I want to be able to see a RUN character.
// As I user I want to be able to move RUN in (right,left,up,down) directions.
// As I user I want to be able to finish the game.
// As I user I want to see win or lose sign.

// pseudo code:
// creating background
// creating the character (RUN)
// consting the RUN and letting the directios
// bieng able to move RUN in the maze.
// defining the needed veriables like directions and the maze
// define the constants which is the character and the dierctions
// the player should choose the direction and find the way out
// either win or lose counting if you are able to reach the end of the Game.
// showing a massege if the gamer wins 

// / Define the maze layout
// Define the maze layout
// 0 = path, 1 = wall, 2 = player starting position, 3 = goal
const mazeLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Game state
let playerPosition = { row: 0, col: 0 };
let gameWon = false;
let cellSize = 30;
let canvas, ctx;

// Initialize the game
function initGame() {
    canvas = document.getElementById('mazeCanvas');
    ctx = canvas.getContext('2d');
    
    // Find player starting position
    for (let row = 0; row < mazeLayout.length; row++) {
        for (let col = 0; col < mazeLayout[row].length; col++) {
            if (mazeLayout[row][col] === 2) {
                playerPosition = { row, col };
                break;
            }
        }
    }
    
    // Set canvas size based on maze dimensions
    canvas.width = mazeLayout[0].length * cellSize;
    canvas.height = mazeLayout.length * cellSize;
    
    // Draw the initial maze
    drawMaze();
}

// Draw the maze on the canvas
function drawMaze() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each cell
    for (let row = 0; row < mazeLayout.length; row++) {
        for (let col = 0; col < mazeLayout[row].length; col++) {
            const x = col * cellSize;
            const y = row * cellSize;
            
            // Draw cell based on type
            switch (mazeLayout[row][col]) {
                case 1: // Wall
                    ctx.fillStyle = '#333';
                    ctx.fillRect(x, y, cellSize, cellSize);
                    break;
                case 3: // Goal
                    ctx.fillStyle = '#4CAF50';
                    ctx.fillRect(x, y, cellSize, cellSize);
                    break;
                default: // Path
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(x, y, cellSize, cellSize);
                    ctx.strokeStyle = '#ddd';
                    ctx.strokeRect(x, y, cellSize, cellSize);
            }
            
            // Draw player
            if (row === playerPosition.row && col === playerPosition.col) {
                ctx.fillStyle = '#FF5722';
                ctx.beginPath();
                ctx.arc(
                    x + cellSize / 2,
                    y + cellSize / 2,
                    cellSize / 2 - 2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    }
}

// Move the player
function movePlayer(direction) {
    if (gameWon) return;
    
    let newRow = playerPosition.row;
    let newCol = playerPosition.col;
    
    switch (direction) {
        case 'up':
            newRow--;
            break;
        case 'down':
            newRow++;
            break;
        case 'left':
            newCol--;
            break;
        case 'right':
            newCol++;
            break;
    }
    
    // Check if the new position is valid (not a wall and within bounds)
    if (
        newRow >= 0 && 
        newRow < mazeLayout.length && 
        newCol >= 0 && 
        newCol < mazeLayout[0].length && 
        mazeLayout[newRow][newCol] !== 1
    ) {
        playerPosition.row = newRow;
        playerPosition.col = newCol;
        
        // Redraw the maze with the updated player position
        drawMaze();
        
        // Check if player reached the goal
        if (mazeLayout[playerPosition.row][playerPosition.col] === 3) {
            gameWon = true;
            showWinMessage();
        }
    }
}

// Show win message
function showWinMessage() {
    const messageContainer = document.getElementById('Message-Container');
    messageContainer.style.visibility = 'visible';
}

// Set up event listeners
function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                movePlayer('up');
                break;
            case 'ArrowDown':
                movePlayer('down');
                break;
            case 'ArrowLeft':
                movePlayer('left');
                break;
            case 'ArrowRight':
                movePlayer('right');
                break;
        }
    });
    
    // Button controls
    document.getElementById('up').addEventListener('click', () => movePlayer('up'));
    document.getElementById('down').addEventListener('click', () => movePlayer('down'));
    document.getElementById('left').addEventListener('click', () => movePlayer('left'));
    document.getElementById('right').addEventListener('click', () => movePlayer('right'));
    
    // Close win message when clicked
    document.getElementById('Message-Container').addEventListener('click', function() {
        this.style.visibility = 'hidden';
    });
}

// Initialize the game when the page loads
window.onload = function() {
    initGame();
    setupEventListeners();
};
