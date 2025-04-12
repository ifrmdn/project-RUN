// Define the maze layout
// 0 = path, 1 = wall, 2 = player starting position, 3 = goal
// this idea is from a youtube channel called 'Devression'
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
let gameLost = false;
let cellSize = 30;
let canvas, ctx;
let gameStarted = false; // Track if the game has started

// Timer variables
let timeRemaining = 10;
let timerInterval;
let timerDisplay;

function initGame() {
    canvas = document.getElementById('mazeCanvas');
    ctx = canvas.getContext('2d');
    
    canvas.width = mazeLayout[0].length * cellSize;
    canvas.height = mazeLayout.length * cellSize;
    
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
        gameArea.style.display = 'flex';
    } else {
        canvas.style.display = 'none';
    }
    
    // Find the player starting position
    for (let row = 0; row < mazeLayout.length; row++) {
        for (let col = 0; col < mazeLayout[row].length; col++) {
            if (mazeLayout[row][col] === 2) {
                playerPosition = { row, col };
                break;
            }
        }
    }
    
    // Create and position timer display
    createTimerDisplay();
    
    // Update the timer 
    updateTimerDisplay();
}

// Create and position timer display
function createTimerDisplay() {
    timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) {
        // Create timer display  (i learn that from chat gpt)
        timerDisplay = document.createElement('div');
        timerDisplay.id = 'timer-display';
        
        // Add the timer to the game area or body (that as well)
        const gameAreaElement = document.getElementById('game-area');
        if (gameAreaElement) {
            // Make sure game area has position relative for absolute positioning
            gameAreaElement.style.position = 'relative';
            gameAreaElement.appendChild(timerDisplay);
        } else {
            // that will fix the game area position
            timerDisplay.style.position = 'fixed';
            document.body.appendChild(timerDisplay);
        }
    }
}

// Start the game when the start button is clicked
function startGame() {
    gameStarted = true;
    gameWon = false;
    gameLost = false;
    
    // Reset timer to 10 seconds
    timeRemaining = 10;
    updateTimerDisplay();
    
    // Show the game area or the canavas
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
        gameArea.style.display = 'block';
    } else {
        canvas.style.display = 'block';
    }
    
    // Hide the start button
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.style.display = 'none';
    }
    
    // Draw the initial maze
    drawMaze();
    
    // Enable keyboard controls
    setupKeyboardControls();
    
    // Start the timer
    startTimer();
}

// Start the timer countdown
function startTimer() {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Start a new timer
    timerInterval = setInterval(function() {
        timeRemaining--;
        updateTimerDisplay();
        
        // Check if time has run out
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            gameLost = true;
            showLoseMessage();
        }
    }, 1000);
}

// Update the timer display
function updateTimerDisplay() {
    const formattedTime = timeRemaining.toString().padStart(2, '0');
        timerDisplay.textContent = `Time: ${formattedTime}s`;
    
    // that code change the timer color when time is running low
    if (timeRemaining <= 5) {
        timerDisplay.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    } else {
        timerDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    }
}

// Draw the maze on the canvas
function drawMaze() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let row = 0; row < mazeLayout.length; row++) {
        for (let col = 0; col < mazeLayout[row].length; col++) {
            const x = col * cellSize;
            const y = row * cellSize;
            
            // Draw the cells
            switch (mazeLayout[row][col]) {
                case 1: // Walls
                    ctx.fillStyle = '#333';
                    ctx.fillRect(x, y, cellSize, cellSize);
                    break;
                case 3: // Goal or the end
                    ctx.fillStyle = '#f4c2c2';
                    ctx.fillRect(x, y, cellSize, cellSize);
                    break;
                default: // Path
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(x, y, cellSize, cellSize);
                    ctx.strokeStyle = '#ddd';
                    ctx.strokeRect(x, y, cellSize, cellSize);
            }
            
            // Draw the player or the RUN charcter
            if (row === playerPosition.row && col === playerPosition.col) {
                ctx.fillStyle = '#ff225c';
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
        if (gameWon || gameLost || !gameStarted) return;
        
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
        
        // Check if the new position is available (not a wall or a clack cell)
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
                clearInterval(timerInterval); // Stop the timer
                showWinMessage();
            }
        }
    }
    
    // Show a win message
    function showWinMessage() {
        const messageContainer = document.getElementById('Message-Container');
        if (messageContainer) {
            const messageElement = document.getElementById('message');
            if (messageElement) {
                const messageTitle = messageElement.querySelector('h2');
                if (messageTitle) {
                    messageTitle.textContent = 'You Win!';
                    messageTitle.style.color = '#4CAF50';
                }
            }
            messageContainer.style.visibility = 'visible';
        }
    }
    
    // OR a lose message
    function showLoseMessage() {
        const messageContainer = document.getElementById('Message-Container');
        if (messageContainer) {
            const messageElement = document.getElementById('message');
            if (messageElement) {
                const messageTitle = messageElement.querySelector('h2');
                if (messageTitle) {
                    messageTitle.textContent = 'Time\'s Up! You Lose!';
                    messageTitle.style.color = '#FF5722';
                }
            }
            messageContainer.style.visibility = 'visible';
        }
    }
    
    // Reset the game to play again
    function playAgain() {
        console.log('playing again function works');
        
        // Stop the timer
        clearInterval(timerInterval);
        
        // Reset game state
        gameWon = false;
        gameLost = false;
        timeRemaining = 10; // Reset to 10s
        updateTimerDisplay();
        
        // Find player starting position and reset player to it
        for (let row = 0; row < mazeLayout.length; row++) {
            for (let col = 0; col < mazeLayout[row].length; col++) {
                if (mazeLayout[row][col] === 2) {
                    playerPosition = { row, col };
                    break;
                }
            }
        }
        
        //  when play again hide win/lose message if it still there
        const messageContainer = document.getElementById('Message-Container');
        if (messageContainer) {
            messageContainer.style.visibility = 'hidden';
        }
        
        // Redraw the maze
        drawMaze();
        
        // make the timer run again
        startTimer();
    }
    
    // keyboard controls (directions)
    function setupKeyboardControls() {
        // Remove any existing event listeners to prevent duplicates
        document.removeEventListener('keydown', handleKeyDown);
        
        // Add the event listener
        document.addEventListener('keydown', handleKeyDown);
    }
    
    // Handle keyboard events
    function handleKeyDown(event) {
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
            case 'r': // Add 'r' key to restart game or sure u can just press play again
                playAgain();
                break;
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Add start button event listener
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.addEventListener('click', startGame);
        } else {
            // If no start button exists, create one (a new method learnt drom chatGPT)
            const gameContainer = document.querySelector('body');
            const newStartButton = document.createElement('button');
            newStartButton.id = 'start-button';
            newStartButton.textContent = 'Start Game';
            newStartButton.style.padding = '10px 20px';
            newStartButton.style.fontSize = '16px';
            newStartButton.style.margin = '20px auto';
            newStartButton.style.display = 'block';
            gameContainer.prepend(newStartButton);
            newStartButton.addEventListener('click', startGame);
        }
        
        // Add play again button event listener
        const playAgainButton = document.getElementById('play-again');
        if (playAgainButton) {
            playAgainButton.addEventListener('click', function() {
                playAgain();
            });
        }
        
        // Close win/lose message when clicked
        const messageContainer = document.getElementById('Message-Container');
        if (messageContainer) {
            messageContainer.addEventListener('click', function() {
                this.style.visibility = 'hidden';
            });
        }
    }
    
    window.onload = function() {
        initGame();
        setupEventListeners();
    };
