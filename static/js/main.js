var tetris = new Tetris();

var isRotating = false; 

document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        
        // z
        case 90: 
            tetris.moveLeft();
        break;

        // c
        case 67: 
            tetris.moveRight();
        break;

        // a
        case 65: 
            tetris.moveLeft();
        break;
    
        // d
        case 68: 
            tetris.moveRight();
        break;

        // x
        case 88: 
            tetris.moveDown();
        break;

        // s
        case 83: 
            tetris.moveDown();
        break;

        // left arrow 
        case 37: 
            isRotating = true;
            tetris.rotateLeft(false);
        break;

        // right arrow 
        case 39: 
            isRotating = true;
            tetris.rotateRight(true);
        break;

        // Space
        case 32:
            tetris.drop();
        break;   
    }
}, false);

function playTetris(){
    tetris.start();
    toggleStartButton(true);
    var gameStep = setInterval(function(){
        if (!isRotating) {
            tetris.frameStep();
        }
        if (tetris.rotationCount > tetris.rotationCountLimit) {
            tetris.drop();
        }
        isRotating = false;
        if (tetris.isGameOver) {
            toggleStartButton(false);
            clearInterval(gameStep);
        }
    }, tetris.timeStep);
}

function toggleStartButton(turnButtonOn) {
    let button = document.getElementById('start-button');
    button.disabled = turnButtonOn;
}