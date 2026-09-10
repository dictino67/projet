class SudokuGame {
    constructor() {
        this.board = [];
        this.solution = [];
        this.selectedCell = null;
        this.init();
    }

    init() {
        this.createBoardElements();
        this.setupEventListeners();
        this.newGame();
    }

    // Génère une grille de Sudoku valide
    generateSudoku() {
        const grid = Array(9).fill(null).map(() => Array(9).fill(0));
        
        const isValid = (row, col, num) => {
            for (let x = 0; x < 9; x++) {
                if (grid[row][x] === num) return false;
            }
            for (let x = 0; x < 9; x++) {
                if (grid[x][col] === num) return false;
            }
            const boxRow = Math.floor(row / 3) * 3;
            const boxCol = Math.floor(col / 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (grid[boxRow + i][boxCol + j] === num) return false;
                }
            }
            return true;
        };

        const fillGrid = () => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (grid[row][col] === 0) {
                        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                        for (let num of numbers) {
                            if (isValid(row, col, num)) {
                                grid[row][col] = num;
                                if (fillGrid()) return true;
                                grid[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        };

        fillGrid();
        return grid;
    }

    createGameBoard(solution) {
        const difficulty = Math.floor(Math.random() * 4) + 30;
        const game = JSON.parse(JSON.stringify(solution));
        
        let emptyCount = 0;
        while (emptyCount < difficulty) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (game[row][col] !== 0) {
                game[row][col] = 0;
                emptyCount++;
            }
        }
        
        return game;
    }

    createBoardElements() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                boardElement.appendChild(cell);
            }
        }
    }

    displayBoard() {
        const cells = document.querySelectorAll('.cell');
        let cellIndex = 0;
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = this.board[row][col];
                const originalValue = this.solution[row][col];
                
                cells[cellIndex].textContent = value === 0 ? '' : value;
                
                // Une case est fixe seulement si elle a une valeur ET correspond à l'originale
                if (value !== 0 && value === originalValue) {
                    cells[cellIndex].classList.add('fixed');
                    cells[cellIndex].classList.remove('error', 'correct');
                } else if (value === 0) {
                    // Case vide - pas fixe, donc modifiable
                    cells[cellIndex].classList.remove('fixed', 'error', 'correct');
                } else {
                    // Cas théorique où value existe mais n'est pas l'originale
                    cells[cellIndex].classList.remove('fixed');
                }
                
                cellIndex++;
            }
        }
    }

    setupEventListeners() {
        document.getElementById('board').addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (cell && !cell.classList.contains('fixed')) {
                this.selectCell(cell);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!this.selectedCell) return;
            
            const key = e.key;
            if (key >= '1' && key <= '9') {
                this.enterNumber(parseInt(key));
            } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
                this.clearCell();
            }
        });

        document.querySelectorAll('.numpad button').forEach(button => {
            button.addEventListener('click', () => {
                const num = parseInt(button.dataset.num);
                if (!this.selectedCell) return;
                
                if (num === 0) {
                    this.clearCell();
                } else {
                    this.enterNumber(num);
                }
            });
        });

        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.newGame();
        });

        document.getElementById('check-btn').addEventListener('click', () => {
            this.checkBoard();
        });
    }

    selectCell(cell) {
        const previouslySelected = document.querySelector('.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        
        this.selectedCell = cell;
        cell.classList.add('selected');
    }

    enterNumber(num) {
        if (!this.selectedCell) return;
        
        const row = parseInt(this.selectedCell.dataset.row);
        const col = parseInt(this.selectedCell.dataset.col);
        
        this.board[row][col] = num;
        this.updateCellDisplay(row, col);
        
        if (this.isBoardComplete()) {
            this.checkBoard(true);
        }
    }

    clearCell() {
        if (!this.selectedCell) return;
        
        const row = parseInt(this.selectedCell.dataset.row);
        const col = parseInt(this.selectedCell.dataset.col);
        
        this.board[row][col] = 0;
        this.updateCellDisplay(row, col);
        
        this.selectedCell.classList.remove('error', 'correct');
    }

    updateCellDisplay(row, col) {
        const cells = document.querySelectorAll('.cell');
        const index = row * 9 + col;
        
        cells[index].textContent = this.board[row][col] === 0 ? '' : this.board[row][col];
    }

    isBoardComplete() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] === 0) return false;
            }
        }
        return true;
    }

    checkBoard(autoCheck = false) {
        const cells = document.querySelectorAll('.cell');
        let hasErrors = false;
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const index = row * 9 + col;
                const cell = cells[index];
                const value = this.board[row][col];
                const correctValue = this.solution[row][col];
                
                if (value !== 0 && value !== correctValue) {
                    cell.classList.add('error');
                    cell.classList.remove('correct');
                    hasErrors = true;
                } else if (value !== 0) {
                    cell.classList.add('correct');
                    cell.classList.remove('error');
                }
            }
        }
        
        const messageEl = document.getElementById('message');
        if (!hasErrors && this.isBoardComplete()) {
            messageEl.textContent = '🎉 Félicitations ! Vous avez gagné !';
            messageEl.className = 'message success';
        } else if (autoCheck) {
            messageEl.textContent = hasErrors ? '❌ Il y a des erreurs, continuez à jouer !' : '';
            messageEl.className = hasErrors ? 'message error' : 'message';
        } else {
            messageEl.textContent = '';
        }
    }

    newGame() {
        this.solution = this.generateSudoku();
        this.board = this.createGameBoard(this.solution);
        
        const messageEl = document.getElementById('message');
        messageEl.textContent = '';
        messageEl.className = 'message';
        
        const previouslySelected = document.querySelector('.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        this.selectedCell = null;
        
        this.displayBoard();
        
        messageEl.textContent = '🎮 Nouvelle partie commencée ! Bonne chance !';
        messageEl.className = 'message success';
    }
}

// Initialiser le jeu quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
