// Click&Grow Premium v1.0.0 - Modern Mini-Games System

class MinigameSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.currentGame = null;
        this.gameContainer = null;
        this.score = 0;
        this.isPlaying = false;
        this.gameTimer = null;
        // Nerfed duration for snappier, fair rounds (was 30000)
        this.gameDuration = 20000; // 20 seconds
        
        // MinigameSystem initialized
    }

    init() {
        // MinigameSystem ready
    }
    
    startGame(gameId) {
        this.currentGame = gameId;
        this.score = 0;
        this.isPlaying = true;
        
        // Show game modal
        this.showGameModal();
        
        // Start game based on type
        switch (gameId) {
            case 'water':
                this.startWateringGame();
                break;
            case 'fertilizer':
                this.startFertilizerGame();
                break;
            case 'sunlight':
                this.startSunlightGame();
                break;
            case 'puzzle':
                this.startPuzzleGame();
                break;
            case 'speed':
                this.startSpeedGame();
                break;
            case 'memory':
                this.startMemoryGame();
                break;
            case 'balance':
                this.startBalanceGame();
                break;
            case 'music':
                this.startMusicGame();
                break;
        }
        
        // Start timer
        this.startGameTimer();
        
        // Return a promise that resolves when the game ends
        return new Promise((resolve) => {
            this.gameResolve = resolve;
        });
    }
    
    showGameModal() {
        const modal = document.getElementById('game-modal');
        const container = document.getElementById('game-container');
        const title = document.getElementById('game-title');
        
        // Set game title
        const gameNames = {
            'water': '💧 Precision Watering',
            'fertilizer': '🌿 Fertilizer Mix',
            'sunlight': '☀️ Sunlight Focus',
            'puzzle': '🧩 Plant Puzzle',
            'speed': '⚡ Speed Harvest',
            'memory': '🧠 Memory Garden',
            'balance': '⚖️ Nutrient Balance',
            'music': '🎵 Plant Music'
        };
        
        title.textContent = gameNames[this.currentGame] || 'Mini-Game';
        
        // Clear container
        container.innerHTML = '';
        
        // Create game UI
        this.createGameUI(container);
        
        // Show modal
        modal.classList.add('active');
    }
    
    createGameUI(container) {
        const gameUI = document.createElement('div');
        gameUI.className = 'game-ui';
        
        // Game header
        const header = document.createElement('div');
        header.className = 'game-header';
        header.innerHTML = `
            <div class="game-score">
                <span class="score-label">Score:</span>
                <span class="score-value" id="game-score">0</span>
            </div>
            <div class="game-timer">
                <span class="timer-label">Time:</span>
                <span class="timer-value" id="game-timer">${Math.floor(this.gameDuration / 1000)}</span>
            </div>
        `;
        
        // Game area
        const gameArea = document.createElement('div');
        gameArea.className = 'game-area';
        gameArea.id = 'game-area';
        
        // Instructions
        const instructions = document.createElement('div');
        instructions.className = 'game-instructions';
        instructions.innerHTML = `
            <h3>How to Play</h3>
            <p id="game-instructions">Get ready to play!</p>
        `;
        
        gameUI.appendChild(header);
        gameUI.appendChild(gameArea);
        gameUI.appendChild(instructions);
        
        container.appendChild(gameUI);
    }
    
    startWateringGame() {
        this.gameType = 'water';
        this.score = 0;
        this.timeLeft = 30;
        
        // Show watering game container
        const waterGame = document.querySelector('.watering-game');
        if (waterGame) {
            waterGame.style.display = 'block';
        }
        
        // Update UI
        this.updateGameUI();
        
        // Start spawning water drops
        this.spawnWaterDrops();
        
        // Start timer
        this.startGameTimer();
    }
    
    spawnWaterDrops() {
        if (!this.isPlaying) return;
        
        const dropsContainer = document.querySelector('.water-drops');
        if (!dropsContainer) return; // Safety check
        
        const drop = document.createElement('div');
        drop.className = 'water-drop';
        drop.innerHTML = '💧';
        
        // Random position
        const x = Math.random() * 80 + 10; // 10% to 90%
        drop.style.left = x + '%';
        
        dropsContainer.appendChild(drop);
        
        // Animate drop
        drop.animate([
            { top: '-50px', opacity: 0 },
            { top: '50%', opacity: 1 },
            { top: '100%', opacity: 0 }
        ], {
            duration: 3000,
            easing: 'ease-in'
        }).onfinish = () => {
            drop.remove();
        };
        
        // Click handler for scoring
        drop.addEventListener('click', () => {
            this.score += 10;
            this.updateGameUI();
            drop.remove();
            
            // Particle effect
            if (this.gameEngine.particleSystem) {
                this.gameEngine.particleSystem.createParticles('water', {
                    x: parseFloat(drop.style.left),
                    y: 50
                });
            }
        });
        
        // Spawn next drop
        if (this.isPlaying) {
            setTimeout(() => this.spawnWaterDrops(), 800 + Math.random() * 400);
        }
    }
    
    startFertilizerGame() {
        const gameArea = document.getElementById('game-area');
        const instructions = document.getElementById('game-instructions');
        
        instructions.textContent = 'Match the fertilizer pattern by clicking the correct ingredients!';
        
        gameArea.innerHTML = `
            <div class="fertilizer-game">
                <div class="recipe-display">
                    <h4>Recipe:</h4>
                    <div class="recipe-pattern" id="recipe-pattern"></div>
                </div>
                <div class="ingredients-grid">
                    <div class="ingredient" data-type="nitrogen">N</div>
                    <div class="ingredient" data-type="phosphorus">P</div>
                    <div class="ingredient" data-type="potassium">K</div>
                    <div class="ingredient" data-type="calcium">Ca</div>
                </div>
                <div class="player-sequence" id="player-sequence"></div>
            </div>
        `;

        this.startFertilizerRound();
    }
    
    startFertilizerRound() {
        if (!this.isPlaying) return;
        
        const pattern = this.generateRecipePattern();
        const patternDisplay = document.getElementById('recipe-pattern');
        const playerSequence = document.getElementById('player-sequence');
        
        // Show pattern
        patternDisplay.innerHTML = pattern.map(type => 
            `<div class="pattern-item ${type}">${this.getIngredientSymbol(type)}</div>`
        ).join('');
        
        // Clear player sequence
        playerSequence.innerHTML = '';
        
        // Remove old click handlers and add new ones
        const ingredients = document.querySelectorAll('.ingredient');
        ingredients.forEach(ingredient => {
            // Remove existing listeners
            ingredient.replaceWith(ingredient.cloneNode(true));
        });
        
        // Add new click handlers
        document.querySelectorAll('.ingredient').forEach(ingredient => {
            ingredient.addEventListener('click', () => {
                const type = ingredient.dataset.type;
                this.addToPlayerSequence(type);
            });
        });
    }
    
    generateRecipePattern() {
        const types = ['nitrogen', 'phosphorus', 'potassium', 'calcium'];
        const pattern = [];
        for (let i = 0; i < 4; i++) {
            pattern.push(types[Math.floor(Math.random() * types.length)]);
        }
        return pattern;
    }
    
    getIngredientSymbol(type) {
        const symbols = {
            'nitrogen': 'N',
            'phosphorus': 'P',
            'potassium': 'K',
            'calcium': 'Ca'
        };
        return symbols[type];
    }
    
    addToPlayerSequence(type) {
        const playerSequence = document.getElementById('player-sequence');
        const item = document.createElement('div');
        item.className = `sequence-item ${type}`;
        item.textContent = this.getIngredientSymbol(type);
        
        playerSequence.appendChild(item);
        
        // Check if sequence is complete
        if (playerSequence.children.length === 4) {
            this.checkFertilizerSequence();
        }
    }
    
    checkFertilizerSequence() {
        const pattern = Array.from(document.getElementById('recipe-pattern').children)
            .map(item => item.className.replace('pattern-item ', ''));
        const player = Array.from(document.getElementById('player-sequence').children)
            .map(item => item.className.replace('sequence-item ', ''));
        
        if (pattern.join('') === player.join('')) {
            this.score += 50;
            this.updateScore();
            this.showScorePopup(document.getElementById('player-sequence'), '+50');
        } else {
            this.score += 10;
            this.updateScore();
        }
        
        // Start new round
        setTimeout(() => this.startFertilizerRound(), 1000);
    }
    
    startSunlightGame() {
        const gameArea = document.getElementById('game-area');
        const instructions = document.getElementById('game-instructions');
        
        instructions.textContent = 'Guide the sunlight beam to the plant by clicking obstacles!';
        
        gameArea.innerHTML = `
            <div class="sunlight-game">
                <div class="sun">☀️</div>
                <div class="sunlight-beam"></div>
                <div class="obstacles"></div>
                <div class="plant-target">🌱</div>
            </div>
        `;
        
        this.spawnSunlightObstacles();
    }
    
    spawnSunlightObstacles() {
        if (!this.isPlaying) return;
        
        const obstaclesContainer = document.querySelector('.obstacles');
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        obstacle.innerHTML = '☁️';
        
        // Random position
        const x = Math.random() * 80 + 10;
        obstacle.style.left = x + '%';
        
        obstaclesContainer.appendChild(obstacle);
        
        // Animate obstacle
        obstacle.animate([
            { top: '-50px', opacity: 0 },
            { top: '50%', opacity: 1 },
            { top: '100%', opacity: 0 }
        ], {
            duration: 4000,
            easing: 'ease-in'
        }).onfinish = () => {
            obstacle.remove();
        };
        
        // Click handler
        obstacle.addEventListener('click', () => {
            this.score += 15;
            this.updateScore();
            obstacle.remove();
            this.showScorePopup(obstacle, '+15');
        });
        
        // Spawn next obstacle
        setTimeout(() => this.spawnSunlightObstacles(), Math.random() * 1200 + 800);
    }
    
    startMusicGame() {
        const gameArea = document.getElementById('game-area');
        const instructions = document.getElementById('game-instructions');
        
        instructions.textContent = 'Click the music notes in rhythm!';
        
        gameArea.innerHTML = `
            <div class="music-game">
                <div class="beat-track">
                    <div class="beat-marker"></div>
                    <div class="music-notes"></div>
                </div>
                <div class="music-controls">
                    <button class="music-btn" onclick="app.gameEngine.minigameSystem.spawnMusicNote()">Spawn Note</button>
                </div>
            </div>
        `;
        
        this.spawnMusicNotes();
    }
    
    spawnMusicNotes() {
        if (!this.isPlaying) return;
        
        const notesContainer = document.querySelector('.music-notes');
        const note = document.createElement('div');
        note.className = 'music-note';
        note.innerHTML = '🎵';
        
        // Random position
        const x = Math.random() * 80 + 10;
        note.style.left = x + '%';
        
        notesContainer.appendChild(note);
        
        // Animate note
        note.animate([
            { left: x + '%', opacity: 0 },
            { left: '50%', opacity: 1 },
            { left: '50%', opacity: 0 }
        ], {
            duration: 2000,
            easing: 'ease-in-out'
        }).onfinish = () => {
            note.remove();
        };
        
        // Click handler
        note.addEventListener('click', () => {
            this.score += 20;
            this.updateScore();
            note.remove();
            this.showScorePopup(note, '+20');
        });
        
        // Spawn next note
        setTimeout(() => this.spawnMusicNotes(), Math.random() * 1500 + 1000);
    }
    
    startGameTimer() {
        // Initialize from configured duration to avoid hard-coding
        let timeLeft = Math.max(1, Math.floor(this.gameDuration / 1000));
        const timerElement = document.getElementById('game-timer');
        
        this.gameTimer = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(this.gameTimer);
                return;
            }
            timeLeft -= 1;
            if (timerElement) timerElement.textContent = String(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(this.gameTimer);
                this.endGame();
            }
        }, 1000);
    }
    
    updateScore() {
        const scoreElement = document.getElementById('game-score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }
    
    showScorePopup(element, points) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = points;
        
        const rect = element.getBoundingClientRect();
        popup.style.left = rect.left + 'px';
        popup.style.top = rect.top + 'px';
        
        document.body.appendChild(popup);
        
        popup.animate([
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(-20px)' }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            popup.remove();
        };
    }
    
    endGame() {
        this.isPlaying = false;
        clearInterval(this.gameTimer);
        
        // Give rewards (reduced)
        const coins = Math.floor(this.score / 25);
        this.gameEngine.addCoins(coins);
        
        // Show results
        this.showGameResults();
        
        // Resolve the game promise
        if (this.gameResolve) {
            this.gameResolve({ success: true, score: this.score });
            this.gameResolve = null;
        }
    }
    
    showGameResults() {
        const gameArea = document.getElementById('game-area');
        const coins = Math.floor(this.score / 25);
        
        gameArea.innerHTML = `
            <div class="game-results">
                <div class="results-icon">🎉</div>
                <h3>Game Complete!</h3>
                <div class="final-score">Final Score: ${this.score}</div>
                <div class="coins-earned">Coins Earned: +${coins}</div>
                <button class="play-again-btn" id="play-again-btn">
                    Play Again
                </button>
            </div>
        `;
        
        // Add event listener for play again button
        const playAgainBtn = document.getElementById('play-again-btn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.startGame(this.currentGame);
            });
        }
    }
    
    hideGameModal() {
        const modal = document.getElementById('game-modal');
        modal.classList.remove('active');
        this.isPlaying = false;
        clearInterval(this.gameTimer);
        
        // Resolve the game promise with failure
        if (this.gameResolve) {
            this.gameResolve({ success: false, score: 0 });
            this.gameResolve = null;
        }
    }
    
    // New Games
    startPuzzleGame() {
        const gameArea = document.getElementById('game-area');
        const instructions = document.getElementById('game-instructions');
        
        instructions.textContent = 'Click the puzzle pieces to solve the pattern!';
        
        gameArea.innerHTML = `
            <div class="puzzle-game">
                <div class="puzzle-grid" id="puzzle-grid"></div>
                <div class="puzzle-controls">
                    <button class="puzzle-btn" onclick="app.gameEngine.minigameSystem.rotatePuzzle()">🔄 Rotate</button>
                    <button class="puzzle-btn" onclick="app.gameEngine.minigameSystem.shufflePuzzle()">🔀 Shuffle</button>
                </div>
            </div>
        `;
        
        this.createPuzzleGrid();
    }
    
    createPuzzleGrid() {
        const grid = document.getElementById('puzzle-grid');
        const pieces = ['🌱', '🌿', '🌸', '🌳', '🌲', '🌺', '🌻', '🌼', '🌷'];
        
        grid.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.textContent = pieces[i];
            piece.dataset.index = i;
            piece.addEventListener('click', () => this.selectPuzzlePiece(piece));
            grid.appendChild(piece);
        }
    }
    
    selectPuzzlePiece(piece) {
        if (!this.isPlaying) return;
        
        piece.classList.add('selected');
        this.score += 15;
        this.updateScore();
        this.showScorePopup(piece, '+15');
        
        setTimeout(() => {
            piece.classList.remove('selected');
        }, 500);
    }
    
    rotatePuzzle() {
        const pieces = document.querySelectorAll('.puzzle-piece');
        pieces.forEach(piece => {
            piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        });
    }
    
    shufflePuzzle() {
        const pieces = document.querySelectorAll('.puzzle-piece');
        const positions = Array.from({length: 9}, (_, i) => i);
        
        pieces.forEach(piece => {
            const randomPos = positions.splice(Math.floor(Math.random() * positions.length), 1)[0];
            piece.style.order = randomPos;
        });
    }
    
    startSpeedGame() {
        const gameArea = document.getElementById('game-area');
        const instructions = document.getElementById('game-instructions');
        
        instructions.textContent = 'Quickly click the targets before they disappear!';
        
        gameArea.innerHTML = `
            <div class="speed-game">
                <div class="speed-targets" id="speed-targets"></div>
                <div class="speed-info">
                    <div class="speed-combo">Combo: <span id="speed-combo">0</span></div>
                    <div class="speed-multiplier">Multiplier: <span id="speed-multiplier">1x</span></div>
                </div>
            </div>
        `;

        this.speedCombo = 0;
        this.speedMultiplier = 1;
        this.spawnSpeedTargets();
    }
    
    spawnSpeedTargets() {
        if (!this.isPlaying) return;
        
        const targets = document.getElementById('speed-targets');
        const target = document.createElement('div');
        target.className = 'speed-target';
        target.innerHTML = '🎯';
        
        const x = Math.random() * (targets.offsetWidth - 60);
        const y = Math.random() * (targets.offsetHeight - 60);
        
        target.style.left = x + 'px';
        target.style.top = y + 'px';
        
        targets.appendChild(target);
        
        target.addEventListener('click', () => {
            this.speedCombo++;
            this.speedMultiplier = Math.floor(this.speedCombo / 5) + 1;
            this.score += 10 * this.speedMultiplier;
            
            document.getElementById('speed-combo').textContent = this.speedCombo;
            document.getElementById('speed-multiplier').textContent = this.speedMultiplier + 'x';
            
            this.updateScore();
            this.showScorePopup(target, `+${10 * this.speedMultiplier}`);
            target.remove();
        });
        
        setTimeout(() => {
            if (target.parentNode) {
                target.remove();
                this.speedCombo = 0;
                this.speedMultiplier = 1;
                document.getElementById('speed-combo').textContent = '0';
                document.getElementById('speed-multiplier').textContent = '1x';
            }
        }, 2000);
        
        setTimeout(() => this.spawnSpeedTargets(), Math.random() * 1000 + 500);
    }
    
    startMemoryGame() {
        const gameArea = document.getElementById('game-area');
        const instructions = document.getElementById('game-instructions');
        
        instructions.textContent = 'Find matching pairs of plant cards!';
        
        gameArea.innerHTML = `
            <div class="memory-game">
                <div class="memory-grid" id="memory-grid"></div>
                <div class="memory-info">
                    <div class="memory-pairs">Pairs Found: <span id="memory-pairs">0</span></div>
                    <div class="memory-moves">Moves: <span id="memory-moves">0</span></div>
                </div>
            </div>
        `;
        
        this.memoryPairs = 0;
        this.memoryMoves = 0;
        this.memoryFlipped = [];
        this.createMemoryGrid();
    }
    
    createMemoryGrid() {
        const grid = document.getElementById('memory-grid');
        const symbols = ['🌱', '🌿', '🌸', '🌳', '🌲', '🌺', '🌻', '🌼'];
        const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        
        grid.innerHTML = '';
        cards.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            card.addEventListener('click', () => this.flipMemoryCard(card));
            grid.appendChild(card);
        });
    }
    
    flipMemoryCard(card) {
        if (!this.isPlaying || card.classList.contains('flipped') || card.classList.contains('matched')) return;
        
        card.classList.add('flipped');
        card.textContent = card.dataset.symbol;
        this.memoryFlipped.push(card);
        
        if (this.memoryFlipped.length === 2) {
            this.memoryMoves++;
            document.getElementById('memory-moves').textContent = this.memoryMoves;
            
            if (this.memoryFlipped[0].dataset.symbol === this.memoryFlipped[1].dataset.symbol) {
                this.memoryPairs++;
                document.getElementById('memory-pairs').textContent = this.memoryPairs;
                this.score += 25;
                
                this.memoryFlipped.forEach(c => c.classList.add('matched'));
                this.memoryFlipped = [];
                
                if (this.memoryPairs === 8) {
                    this.score += 100; // Bonus for completing
                }
            } else {
                setTimeout(() => {
                    this.memoryFlipped.forEach(c => {
                        c.classList.remove('flipped');
                        c.textContent = '';
                    });
                    this.memoryFlipped = [];
                }, 1000);
            }

            this.updateScore();
        }
    }
    
    startBalanceGame() {
        const gameArea = document.getElementById('game-area');
        const instructions = document.getElementById('game-instructions');
        
        instructions.textContent = 'Balance nutrients on the scale for perfect growth!';
        
        gameArea.innerHTML = `
            <div class="balance-game">
                <div class="balance-scale" id="balance-scale">
                    <div class="scale-left" id="scale-left"></div>
                    <div class="scale-right" id="scale-right"></div>
                </div>
                <div class="balance-items" id="balance-items"></div>
                <div class="balance-info">
                    <div class="balance-score">Balance Score: <span id="balance-score">0</span></div>
                </div>
            </div>
        `;
        
        this.balanceScore = 0;
        this.createBalanceItems();
    }
    
    createBalanceItems() {
        const items = document.getElementById('balance-items');
        const nutrients = [
            { symbol: 'N', weight: 1, name: 'Nitrogen' },
            { symbol: 'P', weight: 2, name: 'Phosphorus' },
            { symbol: 'K', weight: 3, name: 'Potassium' },
            { symbol: 'Ca', weight: 4, name: 'Calcium' },
            { symbol: 'Mg', weight: 5, name: 'Magnesium' }
        ];
        
        items.innerHTML = '';
        nutrients.forEach(nutrient => {
            const item = document.createElement('div');
            item.className = 'balance-item';
            item.innerHTML = `
                <div class="item-symbol">${nutrient.symbol}</div>
                <div class="item-weight">${nutrient.weight}</div>
            `;
            item.dataset.weight = nutrient.weight;
            item.addEventListener('click', () => this.addToBalance(item));
            items.appendChild(item);
        });
    }
    
    addToBalance(item) {
        if (!this.isPlaying) return;
        
        const side = Math.random() < 0.5 ? 'left' : 'right';
        const scaleSide = document.getElementById(`scale-${side}`);
        
        const balanceItem = document.createElement('div');
        balanceItem.className = 'balance-item-placed';
        balanceItem.innerHTML = item.innerHTML;
        balanceItem.dataset.weight = item.dataset.weight;
        scaleSide.appendChild(balanceItem);
        
        this.calculateBalance();
        
        this.score += parseInt(item.dataset.weight) * 5;
        this.updateScore();
        this.showScorePopup(item, `+${parseInt(item.dataset.weight) * 5}`);
    }
    
    calculateBalance() {
        const leftWeight = Array.from(document.querySelectorAll('#scale-left .balance-item-placed'))
            .reduce((sum, item) => sum + parseInt(item.dataset.weight), 0);
        const rightWeight = Array.from(document.querySelectorAll('#scale-right .balance-item-placed'))
            .reduce((sum, item) => sum + parseInt(item.dataset.weight), 0);
        
        const balance = Math.abs(leftWeight - rightWeight);
        this.balanceScore = Math.max(0, 100 - balance * 10);
        document.getElementById('balance-score').textContent = this.balanceScore;
        
        if (balance === 0) {
            this.score += 50; // Perfect balance bonus
            this.updateScore();
        }
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MinigameSystem;
}
