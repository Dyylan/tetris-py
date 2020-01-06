class Tetris {
    constructor(gridPointSize=4, timeStep=16.6392673398, height=20, width=10, rotationCountLimit=20) {
        this.colourMap = ['azure', 'cyan', 'yellow', 'fuchsia', 'blue', 'orange', 'lime', 'red'];
        this.levelMap = [48,43,38,33,28,23,18,13,8,6,5,5,5,4,4,4,3,3,3,2,2,2,2,2,2,2,2,2,2,1];
        this.frame = 0;
        this.level = 0;
        this.lines = 0;
        this.score = 0;
        this.tetrisDiv = document.getElementById('tetris');
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('height', '600');
        this.svg.setAttribute('width', '450');
        this.svg.setAttribute('viewBox', '0 0 45 90');
        this.svg.id = 'tetris-svg';
        this.tetrisDiv.appendChild(this.svg);
        this.generateSVG(gridPointSize, height, width);
        this.height = height;
        this.width = width;
        this.timeStep = timeStep;
        this.grid = this.generateGrid(height, width);
        this.bag = [...tetrominoBag];
        this.tetromino = this._nextTetromino(tetrominoesEnum);
        this.nextTetromino = this._nextTetromino(tetrominoesEnum);
        this.previousBlocks = this.tetromino.start;
        this.activeBlocks = this.tetromino.start;
        this.isGameOver = false;
        this.rotation = 0;
        this.rotationCountLimit = rotationCountLimit;
        this.rotationCount = 0;
    }

    start() {
        this.isGameOver = false;
        this.frame = 0;
        this.level = 0;
        this.lines = 0;
        this.score = 0;
        this.grid = this.generateGrid(this.height, this.width);
        this.updateGridSVG();
        this.updateNextTetrominoSVG();
        this._moveBlocks(this.previousBlocks, this.activeBlocks);
        this.updateSVG();
    }

    gameOver() {
        this.isGameOver = true;
    }

    newTetromino() {
        this.tetromino = this.nextTetromino;
        this.nextTetromino = this._nextTetromino(tetrominoesEnum);
        this.updateNextTetrominoSVG();
        this.previousBlocks = this.tetromino.start;
        this.activeBlocks = this.tetromino.start;
        for (let to=0; to < this.activeBlocks.length; to++) {
            let i = this.activeBlocks[to][0];
            let j = this.activeBlocks[to][1];
            if (this.grid[i][j] != 0) {
                this.gameOver();
                break
            }
            this.grid[i].splice(j, 1, this.tetromino.block);
        }
        this.rotation = 0;
        this.rotationCount = 0;
    }

    frameStep() {
        this.frame += 1;
        if (this.frame == this.levelMap[this.level]) {
            this.update();
            this.frame = 0; 
        }
    }

    update() {
        let isUpdate = true
        this.moveDown(isUpdate);
    }
  
    updateSVG() {
        for (let t=0; t < this.previousBlocks.length; t++) {
            let i = this.previousBlocks[t][0];
            let j = this.previousBlocks[t][1];
            let rectid = 'r'+i+'-'+j;
            let rect = document.getElementById(rectid);
            rect.setAttribute('fill', this.colourMap[0]);
        } 
        for (let t=0; t < this.activeBlocks.length; t++) {
            let i = this.activeBlocks[t][0];
            let j = this.activeBlocks[t][1];
            let rectid = 'r'+i+'-'+j;
            let rect = document.getElementById(rectid);
            rect.setAttribute('fill', this.colourMap[this.tetromino.block]);
        } 
    }

    updateGridSVG() {
        for (let i=0; i < this.height; i++) {
            for (let j=0; j < this.width; j++) {
                let rectid = 'r'+i+'-'+j;
                let rect = document.getElementById(rectid);
                rect.setAttribute('fill', this.colourMap[this.grid[i][j]]);                
            }
        }
        let score = document.getElementById('score');
        score.textContent = this.score;
        let lines = document.getElementById('lines');
        lines.textContent = this.lines;
        let level = document.getElementById('level');
        level.textContent = this.level;
    }

    updateNextTetrominoSVG() {
        for (let i=0; i < 4; i++) {
            for (let j=0; j < 4; j++) {
                let rectid = 'next'+i+'-'+j;
                let rect = document.getElementById(rectid);
                rect.setAttribute('fill', this.colourMap[this.nextTetromino.nextBlock[i][j]]);                
            }
        }
    }

    moveDown(isUpdate=false) {
        let moveBool = this._move(1, 0);
        if (moveBool == 0 && isUpdate) {
            this._checkRows();
            this.newTetromino();
            if (!this.isGameOver) {
                this.updateGridSVG();
            }
        } else {
            this.updateSVG();
        }
        this.previousBlocks = this.activeBlocks;
        return moveBool
    }

    moveLeft() {
        this._move(0, -1);
        this.updateSVG();
        this.previousBlocks = this.activeBlocks;
    }

    moveRight() {
        this._move(0, 1);
        this.updateSVG();
        this.previousBlocks = this.activeBlocks;
    }

    rotateRight() {
        this._rotate(true);
        this.updateSVG();
        this.rotationCount += 1;
        this.previousBlocks = this.activeBlocks;
    }

    rotateLeft() {
        this._rotate(false);
        this.updateSVG();
        this.rotationCount += 1;
        this.previousBlocks = this.activeBlocks;
    }

    drop() {
        let moveBool=1;
        while (moveBool == 1) {
            moveBool = this.moveDown();
        }
    }

    generateGrid(height, width) {
        let grid = [];
        for (let i = 0; i < height; i++) {
                grid[i] = []; 
            for(let j = 0; j < width; j++) {
                grid[i][j] = 0;
            }
        }
        return grid
    }

    generateSVG(gridPointSize, height, width) {
        for (let i=0; i < height; i++) { 
            for (let j=0; j < width; j++) {
                let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.id = 'r'+i+'-'+j;
                rect.setAttribute('x', j*gridPointSize);
                rect.setAttribute('y', i*gridPointSize);
                rect.setAttribute('rx', 0.5);
                rect.setAttribute('height', gridPointSize);
                rect.setAttribute('width', gridPointSize);
                rect.setAttribute('fill', this.colourMap[0]);
                rect.setAttribute('fill-opacity', 1);
                rect.setAttribute('stroke', 'black');
                rect.setAttribute('stroke-opacity', 0.10);
                rect.setAttribute('stroke-width', 0.1);
                this.svg.appendChild(rect);
            }
        }

        var scoreGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        var scoreBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        scoreBox.setAttribute('x', 4.5*gridPointSize);
        scoreBox.setAttribute('y', 20*gridPointSize+1.1);
        scoreBox.setAttribute('height', 1.6*gridPointSize);
        scoreBox.setAttribute('width', 5.5*gridPointSize);
        scoreBox.setAttribute('fill', this.colourMap[0]);
        scoreBox.setAttribute('fill-opacity', 0.5);
        scoreBox.setAttribute('stroke', 'black');
        scoreBox.setAttribute('stroke-opacity', 1);
        scoreBox.setAttribute('stroke-width', 0.3);
        var score = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        score.id = 'score'
        score.setAttribute('text-anchor', 'end');
        score.setAttribute('x', 9.7*gridPointSize);
        score.setAttribute('y', 21.2*gridPointSize+1);
        score.setAttribute('height', 4*gridPointSize);
        score.setAttribute('width', 5*gridPointSize);
        score.setAttribute('fill', '#000');
        score.setAttribute('font-size', '4');
        score.setAttribute('font-family', 'monospace');
        score.textContent = '0';

        scoreGroup.appendChild(scoreBox);
        scoreGroup.appendChild(score);

        var linesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        var linesBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        linesBox.setAttribute('x', 0.1*gridPointSize);
        linesBox.setAttribute('y', 20*gridPointSize+1.1);
        linesBox.setAttribute('height', 1.6*gridPointSize);
        linesBox.setAttribute('width', 4.1*gridPointSize);
        linesBox.setAttribute('fill', this.colourMap[0]);
        linesBox.setAttribute('fill-opacity', 0.5);
        linesBox.setAttribute('stroke', 'black');
        linesBox.setAttribute('stroke-opacity', 1);
        linesBox.setAttribute('stroke-width', 0.3);
        var lines = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        lines.id = 'lines'
        lines.setAttribute('text-anchor', 'end');
        lines.setAttribute('x', 3.9*gridPointSize);
        lines.setAttribute('y', 21.2*gridPointSize+1);
        lines.setAttribute('height', 4*gridPointSize);
        lines.setAttribute('width', 5*gridPointSize);
        lines.setAttribute('fill', '#000');
        lines.setAttribute('font-size', '4');
        lines.setAttribute('font-family', 'monospace');
        lines.textContent = '0';

        linesGroup.appendChild(linesBox);
        linesGroup.appendChild(lines);

        var levelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        var levelBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        levelBox.setAttribute('x', 10*gridPointSize+1.1);
        levelBox.setAttribute('y', 0*gridPointSize+1.1);
        levelBox.setAttribute('height', 1.6*gridPointSize);
        levelBox.setAttribute('width', 1.8*gridPointSize);
        levelBox.setAttribute('fill', this.colourMap[0]);
        levelBox.setAttribute('fill-opacity', 0.5);
        levelBox.setAttribute('stroke', 'black');
        levelBox.setAttribute('stroke-opacity', 1);
        levelBox.setAttribute('stroke-width', 0.3);
        var level = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        level.id = 'level'
        level.setAttribute('text-anchor', 'end');
        level.setAttribute('x', 10*gridPointSize+7.1);
        level.setAttribute('y', 1*gridPointSize+1.8);
        level.setAttribute('height', 4*gridPointSize);
        level.setAttribute('width', 5*gridPointSize);
        level.setAttribute('fill', '#000');
        level.setAttribute('font-size', '4');
        level.setAttribute('font-family', 'monospace');
        level.textContent = '0';

        levelGroup.appendChild(levelBox);
        levelGroup.appendChild(level);

        this.svg.appendChild(scoreGroup);
        this.svg.appendChild(linesGroup);
        this.svg.appendChild(levelGroup);

        let nextBlockRatio = 0.75;
        for (let i=0; i < 4; i++) { 
            for (let j=0; j < 4; j++) {
                let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.id = 'next'+i+'-'+j;
                rect.setAttribute('x', (10*gridPointSize+1.1) + (j*gridPointSize*nextBlockRatio));
                rect.setAttribute('y', (2.0*gridPointSize+0.6) + (i*gridPointSize*nextBlockRatio));
                rect.setAttribute('rx', 0.25);
                rect.setAttribute('height', gridPointSize*nextBlockRatio);
                rect.setAttribute('width', gridPointSize*nextBlockRatio);
                rect.setAttribute('fill', this.colourMap[0]);
                rect.setAttribute('fill-opacity', 1);
                rect.setAttribute('stroke', 'black');
                rect.setAttribute('stroke-opacity', 0);
                rect.setAttribute('stroke-width', 0.1);
                this.svg.appendChild(rect);
            }
        }
    }

    _nextTetrominoRandom(tetrominoes) {
        let keys = Object.keys(tetrominoes);
        let tetromino = tetrominoes[keys[keys.length * Math.random() << 0]];
        return tetromino
    }

    _nextTetromino(tetrominoes) {
        if (this.bag.length == 0) {
            this.bag = [...tetrominoBag];
        }
        let randomIndex = Math.floor(Math.random() * (this.bag.length));
        let key = Object.keys(tetrominoes)[this.bag[randomIndex]-1]; 
        let tetromino = tetrominoes[key];
        this.bag.splice(randomIndex, 1);
        return tetromino
    }

    _rotate(rotateRight=true) {
        let moveTo = [];
        let moveFrom = this.previousBlocks;
        let moveBool = 0;
        let incRotation = 1
        if (!rotateRight) { 
            this.rotation = (this.rotation + 3) % 4;
            incRotation = -1;
        }
        for (let t=0; t < this.activeBlocks.length; t++) {
            let i = incRotation * this.tetromino.rotations[this.rotation][t][0];
            let j = incRotation * this.tetromino.rotations[this.rotation][t][1];
            if (this.activeBlocks[t][0] + i < this.height && this.activeBlocks[t][1] + j < this.width) {
                moveTo.push([this.activeBlocks[t][0] + i, this.activeBlocks[t][1] + j]);
            }
        } 
        if (moveTo.length == 4) {
            moveBool = this._moveBlocks(moveFrom, moveTo, 0);
            if (moveBool) {
                this.activeBlocks = moveTo;
                if (rotateRight) {
                    this.rotation = (this.rotation + 1) % 4;
                }     
            } else {
                this.rotation = (this.rotation + 1) % 4;
            }
        }
        return moveBool       
    }

    _move(upDown, leftRight) {
        let moveTo = [];
        let moveFrom = this.previousBlocks;
        let moveBool = 0;
        for (let t=0; t < this.activeBlocks.length; t++) {
            let i = upDown;
            let j = leftRight;
            if (this.activeBlocks[t][0] + i < this.height && this.activeBlocks[t][1] + j < this.width) {
                moveTo.push([this.activeBlocks[t][0] + i, this.activeBlocks[t][1] + j]);
            }
        } 
        if (moveTo.length == 4) {
            moveBool = this._moveBlocks(moveFrom, moveTo);
            if (moveBool) {
                this.activeBlocks = moveTo;
            }
        }
        return moveBool
    }

    _moveBlocks(moveFrom, moveTo) {
        var moveBool = 1;
        for (let to=0; to < moveTo.length; to++) {
            let i = moveTo[to][0];
            let j = moveTo[to][1];
            if (j >= this.width || (this.grid[i][j] != 0 && !this._activeBlocksContainsPoint(moveTo[to]))) {
                moveBool = 0;
            }
        }
        if (moveBool == 1) {
            for (let from=0; from < moveFrom.length; from++) {
                let i = moveFrom[from][0];
                let j = moveFrom[from][1];
                this.grid[i].splice(j, 1, 0);   
            }             
            for (let to=0; to < moveTo.length; to++) {
                let i = moveTo[to][0];
                let j = moveTo[to][1];
                this.grid[i].splice(j, 1, this.tetromino.block);
            }
        }
        return moveBool
    }

    _checkRows() {
        let rowsDeleted = 0;
        for (let i=1; i < this.height; i++) {
            if (!this.grid[i].includes(0)) {
                rowsDeleted += 1;
                for (let row=i; row > 0; row--) {
                    this.grid[row] = this.grid[row-1].slice();
                }
                for (let col=0; col < this.width; col++) {
                    this.grid[0][col] = 0;
                }
            }
        }
        this.lines += rowsDeleted;
        switch (rowsDeleted) {
            case 1:
                this.score += (this.level + 1) * 40;
                break;
            case 2:
                this.score += (this.level + 1) * 100;
                break;
            case 3:
                this.score += (this.level + 1) * 300;
                break;
            case 4: 
                this.score += (this.level + 1) * 1200;
        }
        if (((this.lines / 10) - 1) >= this.level) {
            this.level += 1;
        }
    }

    _activeBlocksContainsPoint(gridPoint) {
        let match = false;
        for (let i=0; i<this.activeBlocks.length; i++) {
            if (this.activeBlocks[i][0] == gridPoint[0] && this.activeBlocks[i][1] == gridPoint[1]) {
            	match = true;
            }
        }
        return match
    }
}

