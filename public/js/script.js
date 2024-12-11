const words = [
    { word: 'HAPPY', clue: 'How you feel on your birthday' },
    { word: 'SMILE', clue: 'What you do when you're cheerful' },
    { word: 'SUNNY', clue: 'A bright, clear day' },
    { word: 'PUPPY', clue: 'A baby dog' },
    { word: 'CANDY', clue: 'Sweet treats' },
    { word: 'DANCE', clue: 'Moving to music' },
    { word: 'BOOKS', clue: 'You read these' },
    { word: 'PAINT', clue: 'Use this to make colorful pictures' },
    { word: 'MUSIC', clue: 'Songs and sounds you like to hear' },
    { word: 'STARS', clue: 'Twinkle in the night sky' }
];

let currentWordObj = words[Math.floor(Math.random() * words.length)];
let currentWord = currentWordObj.word;
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;
const WORD_LENGTH = 5;
const ATTEMPTS = 4;

// Initialize the game board
function initializeBoard() {
    const grid = document.getElementById('grid');
    for (let i = 0; i < ATTEMPTS; i++) {
        const row = document.createElement('div');
        row.className = 'word-row';
        for (let j = 0; j < WORD_LENGTH; j++) {
            const box = document.createElement('div');
            box.className = 'letter-box';
            row.appendChild(box);
        }
        grid.appendChild(row);
    }
    
    // Display the clue
    document.getElementById('clue').textContent = `Clue: ${currentWordObj.clue}`;
    
    // Create keyboard
    createKeyboard();
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    const layout = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ];

    layout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        row.forEach(key => {
            const button = document.createElement('button');
            button.textContent = key;
            button.className = 'key';
            button.addEventListener('click', () => handleKeyPress(key));
            rowDiv.appendChild(button);
        });
        keyboard.appendChild(rowDiv);
    });
}

function handleKeyPress(key) {
    if (isGameOver) return;

    if (key === '⌫') {
        if (currentTile > 0) {
            currentTile--;
            const row = document.getElementsByClassName('word-row')[currentRow];
            const tile = row.children[currentTile];
            tile.textContent = '';
        }
        return;
    }

    if (key === 'Enter') {
        if (currentTile === WORD_LENGTH) {
            submitGuess();
        }
        return;
    }

    if (currentTile < WORD_LENGTH) {
        const row = document.getElementsByClassName('word-row')[currentRow];
        const tile = row.children[currentTile];
        tile.textContent = key;
        currentTile++;
    }
}

function submitGuess() {
    const row = document.getElementsByClassName('word-row')[currentRow];
    let guess = '';
    const rowTiles = row.children;

    for (let i = 0; i < WORD_LENGTH; i++) {
        guess += rowTiles[i].textContent;
    }

    const result = checkGuess(guess);
    colorTiles(rowTiles, result);

    if (guess === currentWord) {
        isGameOver = true;
        showResult(true);
        return;
    }

    if (currentRow === ATTEMPTS - 1) {
        isGameOver = true;
        showResult(false);
        return;
    }

    currentRow++;
    currentTile = 0;
}

function checkGuess(guess) {
    const result = [];
    const wordArray = currentWord.split('');
    const guessArray = guess.split('');

    // First, mark correct letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessArray[i] === wordArray[i]) {
            result[i] = 'correct';
            wordArray[i] = null;
            guessArray[i] = null;
        }
    }

    // Then, mark wrong position letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessArray[i] === null) continue;
        
        const index = wordArray.indexOf(guessArray[i]);
        if (index !== -1) {
            result[i] = 'wrong-position';
            wordArray[index] = null;
        } else {
            result[i] = 'wrong';
        }
    }

    return result;
}

function colorTiles(tiles, result) {
    for (let i = 0; i < WORD_LENGTH; i++) {
        setTimeout(() => {
            tiles[i].classList.add(result[i]);
        }, i * 100);
    }
}

function showResult(won) {
    const message = document.getElementById('result-message');
    if (won) {
        message.textContent = '🎉 Great job! You got it right! 🎉';
        message.className = 'success';
    } else {
        message.textContent = `The word was ${currentWord}. Try again!`;
        message.className = 'failure';
    }
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleKeyPress('Enter');
    } else if (e.key === 'Backspace') {
        handleKeyPress('⌫');
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
    }
});

// Initialize the game
initializeBoard();