class Sudoku {
    constructor() {
        this.board = Array(81).fill(0);
        this.solution = Array(81).fill(0);
        this.selectedCell = null;
        this.difficulty = 'medium';
        
        this.init();
    }

    init() {
        this.boardElement = document.getElementById('sudoku-board');
        this.newGameBtn = document.getElementById('new-game');
        this.difficultySelect = document.getElementById('difficulty');
        this.messageElement = document.getElementById('message');
        this.numpadBtns = document.querySelectorAll('.numpad-btn');

        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.startNewGame();
        });

        this.numpadBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const num = parseInt(btn.dataset.number);
                this.handleInput(num);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '9') {
                this.handleInput(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
                this.handleInput(0);
            }
        });

        this.startNewGame();
    }

    startNewGame() {
        this.generateSudoku();
        this.renderBoard();
        this.messageElement.textContent = '';
    }

    generateSudoku() {
        // Algoritmo simples de geração
        this.solution = Array(81).fill(0);
        this.fillBoard(this.solution);
        
        this.board = [...this.solution];
        
        let attempts;
        if (this.difficulty === 'easy') attempts = 30;
        else if (this.difficulty === 'medium') attempts = 45;
        else attempts = 55;

        while (attempts > 0) {
            let idx = Math.floor(Math.random() * 81);
            if (this.board[idx] !== 0) {
                this.board[idx] = 0;
                attempts--;
            }
        }
    }

    fillBoard(board) {
        const findEmpty = (b) => b.indexOf(0);
        const isValid = (b, idx, num) => {
            const row = Math.floor(idx / 9);
            const col = idx % 9;
            const boxRow = Math.floor(row / 3) * 3;
            const boxCol = Math.floor(col / 3) * 3;

            for (let i = 0; i < 9; i++) {
                if (b[row * 9 + i] === num) return false;
                if (b[i * 9 + col] === num) return false;
                const r = boxRow + Math.floor(i / 3);
                const c = boxCol + i % 3;
                if (b[r * 9 + c] === num) return false;
            }
            return true;
        };

        const solve = (b) => {
            const emptyIdx = findEmpty(b);
            if (emptyIdx === -1) return true;

            const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
            for (let num of nums) {
                if (isValid(b, emptyIdx, num)) {
                    b[emptyIdx] = num;
                    if (solve(b)) return true;
                    b[emptyIdx] = 0;
                }
            }
            return false;
        };

        solve(board);
    }

    renderBoard() {
        this.boardElement.innerHTML = '';
        this.board.forEach((val, i) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (val !== 0) {
                cell.textContent = val;
                cell.classList.add('fixed');
            } else {
                cell.addEventListener('click', () => this.selectCell(i, cell));
            }
            this.boardElement.appendChild(cell);
        });
        this.selectedCell = null;
    }

    selectCell(index, element) {
        if (element.classList.contains('fixed')) return;

        const allCells = document.querySelectorAll('.cell');
        allCells.forEach(c => c.classList.remove('selected'));
        
        element.classList.add('selected');
        this.selectedCell = { index, element };
    }

    handleInput(num) {
        if (!this.selectedCell) return;

        const { index, element } = this.selectedCell;
        
        if (num === 0) {
            this.board[index] = 0;
            element.textContent = '';
            element.classList.remove('error');
        } else {
            this.board[index] = num;
            element.textContent = num;
            
            if (num !== this.solution[index]) {
                element.classList.add('error');
            } else {
                element.classList.remove('error');
            }
        }

        this.checkWin();
    }

    checkWin() {
        if (!this.board.includes(0) && this.board.every((val, i) => val === this.solution[i])) {
            this.messageElement.textContent = 'Parabéns! Você venceu! 🎉';
            const allCells = document.querySelectorAll('.cell');
            allCells.forEach(c => c.classList.add('fixed'));
        }
    }
}

new Sudoku();
