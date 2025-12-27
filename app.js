// Main application logic

const GRID_SIZE = 4;
let currentPuzzle = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
let solutionPath = null;
let currentStepIndex = 0;
let playInterval = null;
const solver = new PuzzleSolver(GRID_SIZE);

// Initialize the puzzle grid
function initializeGrid() {
    const grid = document.getElementById('puzzleGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.className = 'puzzle-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.value = currentPuzzle[i][j] === 0 ? '0' : currentPuzzle[i][j].toString();
            cell.maxLength = 2; // Allow 0-15
            
            if (currentPuzzle[i][j] === 0) {
                cell.classList.add('empty');
            }
            
            // Handle input changes
            cell.addEventListener('input', (e) => {
                handleCellInput(i, j, e.target);
            });
            
            // Handle blur - validate final value when leaving cell
            cell.addEventListener('blur', (e) => {
                validateCellValue(i, j, e.target);
            });
            
            // Handle focus - select all text for easy replacement
            cell.addEventListener('focus', (e) => {
                e.target.select();
            });
            
            // Handle arrow keys to navigate
            cell.addEventListener('keydown', (e) => {
                handleCellKeydown(i, j, e);
            });
            
            grid.appendChild(cell);
        }
    }
}

function handleCellInput(row, col, input) {
    const value = input.value.trim();
    
    // Allow empty while typing
    if (value === '') {
        return;
    }
    
    const numValue = parseInt(value);
    
    // Allow typing any sequence that could become valid (0-15)
    // Don't restrict while typing - just validate on blur
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 15) {
        currentPuzzle[row][col] = numValue;
        
        // Update styling
        if (numValue === 0) {
            input.classList.add('empty');
        } else {
            input.classList.remove('empty');
        }
    }
    // Don't revert while typing - allow partial input for double digits
}

function validateCellValue(row, col, input) {
    const value = input.value.trim();
    const numValue = parseInt(value);
    
    // Validate final value
    if (value === '' || isNaN(numValue) || numValue < 0 || numValue > 15) {
        // Revert to previous valid value
        input.value = currentPuzzle[row][col] === 0 ? '0' : currentPuzzle[row][col].toString();
    } else {
        // Ensure the puzzle state matches the input
        currentPuzzle[row][col] = numValue;
        if (numValue === 0) {
            input.classList.add('empty');
        } else {
            input.classList.remove('empty');
        }
    }
}

function handleCellKeydown(row, col, e) {
    const input = e.target;
    
    // Arrow key navigation
    if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        let newRow = row;
        let newCol = col;
        
        switch(e.key) {
            case 'ArrowUp':
                newRow = Math.max(0, row - 1);
                break;
            case 'ArrowDown':
                newRow = Math.min(GRID_SIZE - 1, row + 1);
                break;
            case 'ArrowLeft':
                newCol = Math.max(0, col - 1);
                break;
            case 'ArrowRight':
                newCol = Math.min(GRID_SIZE - 1, col + 1);
                break;
        }
        
        if (newRow !== row || newCol !== col) {
            const nextCell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
            if (nextCell) {
                nextCell.focus();
                nextCell.select();
            }
        }
        return;
    }
    
    // Enter or Tab to move to next cell
    if (e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey)) {
        // Value is already saved via input event
        e.preventDefault();
        moveToNextCell(row, col);
        return;
    }
    
    // Shift+Tab to move to previous cell
    if (e.key === 'Tab' && e.shiftKey) {
        // Value is already saved via input event
        e.preventDefault();
        moveToPreviousCell(row, col);
        return;
    }
    
    // Only allow numbers and backspace/delete
    if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
        e.preventDefault();
    }
}

function moveToNextCell(row, col) {
    let nextRow = row;
    let nextCol = col + 1;
    
    if (nextCol >= GRID_SIZE) {
        nextCol = 0;
        nextRow = (nextRow + 1) % GRID_SIZE;
    }
    
    const nextCell = document.querySelector(`[data-row="${nextRow}"][data-col="${nextCol}"]`);
    if (nextCell) {
        nextCell.focus();
        nextCell.select();
    }
}

function moveToPreviousCell(row, col) {
    let prevRow = row;
    let prevCol = col - 1;
    
    if (prevCol < 0) {
        prevCol = GRID_SIZE - 1;
        prevRow = prevRow - 1;
        if (prevRow < 0) {
            prevRow = GRID_SIZE - 1;
        }
    }
    
    const prevCell = document.querySelector(`[data-row="${prevRow}"][data-col="${prevCol}"]`);
    if (prevCell) {
        prevCell.focus();
        prevCell.select();
    }
}

function updateGridDisplay() {
    const cells = document.querySelectorAll('.puzzle-cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = currentPuzzle[row][col];
        
        cell.value = value === 0 ? '0' : value.toString();
        if (value === 0) {
            cell.classList.add('empty');
        } else {
            cell.classList.remove('empty');
        }
    });
}

function solvePuzzle() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.classList.remove('show');
    errorDiv.textContent = '';
    
    // Validate puzzle has exactly one blank (0)
    const flat = currentPuzzle.flat();
    const blankCount = flat.filter(x => x === 0).length;
    
    if (blankCount !== 1) {
        showError('Puzzle must have exactly one blank space (0).');
        return;
    }
    
    // Check if all numbers 1-15 are present
    const values = flat.filter(x => x !== 0).sort((a, b) => a - b);
    const expectedValues = Array.from({length: 15}, (_, i) => i + 1);
    const hasAllValues = values.length === 15 && values.every((val, idx) => val === expectedValues[idx]);
    
    if (!hasAllValues) {
        // Check for duplicates
        const uniqueValues = new Set(values);
        if (uniqueValues.size !== values.length) {
            showError('Puzzle contains duplicate values. Please ensure each number 1-15 appears exactly once.');
            return;
        }
    }
    
    // Check solvability
    if (!solver.isSolvable(currentPuzzle)) {
        showError('This puzzle configuration is not solvable.');
        return;
    }
    
    // Show loading
    const solveBtn = document.getElementById('solveBtn');
    const originalText = solveBtn.textContent;
    solveBtn.textContent = 'Solving...';
    solveBtn.disabled = true;
    
    // Add timeout to prevent hanging
    const timeoutId = setTimeout(() => {
        showError('Solving took too long. The puzzle may be too complex or there was an error.');
        solveBtn.textContent = originalText;
        solveBtn.disabled = false;
    }, 10000); // 10 second timeout
    
    // Solve asynchronously to prevent UI blocking
    // Use setTimeout to ensure UI can update before heavy computation
    setTimeout(() => {
        try {
            solutionPath = solver.solve(currentPuzzle);
            
            clearTimeout(timeoutId);
            
            if (!solutionPath || solutionPath.length === 0) {
                showError('Unable to find a solution. This may be an unsolvable puzzle or the puzzle is too complex.');
                solveBtn.textContent = originalText;
                solveBtn.disabled = false;
                return;
            }
            
            const moves = solver.getMoves(solutionPath);
            displaySolution(solutionPath, moves);
            
            solveBtn.textContent = originalText;
            solveBtn.disabled = false;
        } catch (error) {
            clearTimeout(timeoutId);
            showError('Error solving puzzle: ' + error.message);
            console.error('Solver error:', error);
            console.error('Stack:', error.stack);
            solveBtn.textContent = originalText;
            solveBtn.disabled = false;
        }
    }, 0);
}

function displaySolution(path, moves) {
    const solutionSection = document.getElementById('solutionSection');
    const totalMoves = document.getElementById('totalMoves');
    const movesList = document.getElementById('movesList');
    
    solutionSection.style.display = 'block';
    totalMoves.textContent = moves.length;
    
    // Display moves as compact tile buttons
    movesList.innerHTML = '<div class="moves-compact-label">Slide these tiles in order:</div><div class="moves-compact-grid"></div>';
    const grid = movesList.querySelector('.moves-compact-grid');
    
    moves.forEach((move, index) => {
        const moveItem = document.createElement('button');
        moveItem.className = 'move-tile-btn';
        moveItem.textContent = move;
        moveItem.dataset.index = index;
        moveItem.title = `Step ${index + 1}: Slide tile ${move}`;
        moveItem.addEventListener('click', () => {
            currentStepIndex = index;
            updateStepDisplay();
        });
        grid.appendChild(moveItem);
    });
    
    // Reset play controls
    currentStepIndex = 0;
    updateStepDisplay();
    stopPlayback();
    
    // Scroll to solution
    solutionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateStepDisplay() {
    const currentStepSpan = document.getElementById('currentStep');
    const maxSteps = solutionPath ? solutionPath.length - 1 : 0;
    currentStepSpan.textContent = `Step: ${currentStepIndex} / ${maxSteps}`;
    
    // Highlight current move
    document.querySelectorAll('.move-tile-btn').forEach((item, index) => {
        if (index === currentStepIndex) {
            item.classList.add('current');
        } else {
            item.classList.remove('current');
        }
    });
    
    // Display current state
    displayState(solutionPath[currentStepIndex]);
}

function displayState(state) {
    const visualization = document.getElementById('solutionVisualization');
    visualization.innerHTML = '';
    
    const stateGrid = document.createElement('div');
    stateGrid.className = 'solution-state';
    
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'solution-cell';
            const value = state[i][j];
            cell.textContent = value === 0 ? '' : value;
            if (value === 0) {
                cell.classList.add('empty');
                cell.textContent = '0';
            }
            stateGrid.appendChild(cell);
        }
    }
    
    visualization.appendChild(stateGrid);
    stateGrid.classList.add('fade-in');
}

function playSolution() {
    if (!solutionPath || solutionPath.length === 0) return;
    
    const playBtn = document.getElementById('playBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    playBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    
    currentStepIndex = 0;
    updateStepDisplay();
    
    playInterval = setInterval(() => {
        currentStepIndex++;
        if (currentStepIndex >= solutionPath.length) {
            stopPlayback();
            return;
        }
        updateStepDisplay();
    }, 1000); // 1 second per step
}

function stopPlayback() {
    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
    }
    
    const playBtn = document.getElementById('playBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    playBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
}

function resetPuzzle() {
    currentPuzzle = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    solutionPath = null;
    currentStepIndex = 0;
    stopPlayback();
    
    const solutionSection = document.getElementById('solutionSection');
    solutionSection.style.display = 'none';
    
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.classList.remove('show');
    
    initializeGrid();
}

function generateRandomPuzzle() {
    // Generate a random solvable puzzle
    const values = Array.from({length: 16}, (_, i) => i);
    
    // Fisher-Yates shuffle
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }
    
    // Reshape to grid
    currentPuzzle = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        currentPuzzle.push(values.slice(i * GRID_SIZE, (i + 1) * GRID_SIZE));
    }
    
    // Check if solvable, if not swap first two non-zero tiles
    if (!solver.isSolvable(currentPuzzle)) {
        // Find two non-zero tiles and swap them
        let found = 0;
        for (let i = 0; i < GRID_SIZE && found < 2; i++) {
            for (let j = 0; j < GRID_SIZE && found < 2; j++) {
                if (currentPuzzle[i][j] !== 0) {
                    if (found === 0) {
                        var first = [i, j];
                        found++;
                    } else if (found === 1) {
                        var second = [i, j];
                        [currentPuzzle[first[0]][first[1]], currentPuzzle[second[0]][second[1]]] = 
                        [currentPuzzle[second[0]][second[1]], currentPuzzle[first[0]][first[1]]];
                        found++;
                    }
                }
            }
        }
    }
    
    updateGridDisplay();
    
    // Hide solution if shown
    const solutionSection = document.getElementById('solutionSection');
    solutionSection.style.display = 'none';
    solutionPath = null;
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();
    
    document.getElementById('solveBtn').addEventListener('click', solvePuzzle);
    document.getElementById('resetBtn').addEventListener('click', resetPuzzle);
    document.getElementById('randomBtn').addEventListener('click', generateRandomPuzzle);
    document.getElementById('playBtn').addEventListener('click', playSolution);
    document.getElementById('stopBtn').addEventListener('click', stopPlayback);
    
});


