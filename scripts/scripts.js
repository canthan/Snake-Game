const ctx = document.getElementById('canvas').getContext('2d');
const statsCookies = document.getElementById('stats-cookies');
const statsSpeed = document.getElementById('stats-speed');
const statsTime = document.getElementById('stats-time');

const canvas = document.getElementById('canvas');
var msgButton = document.getElementById('msgButton');
var msgBox = document.getElementById('msgBox');
const html = document.querySelector('html');

var cookies = [];
var snake = [];

var intervalCookie;
var intervalSnake;
var intervalClock;

//=============================== CONSTANTS DECLARATIONS ============================================
const keyUp = 119; // w
const keyDown = 115; // s
const keyRight = 100; // d
const keyLeft = 97; // a

const boardSize = 500;
const fieldSize = 20;
const fieldRadius = fieldSize / 2;

var direction = 97;
var points = 0;
var time = 0;
var speed = 1;
var speedInterval = 120;
var erase = true; //If snake should be shortened

//=============================== COOKIE OBJECT ============================================
function Cookie (X, Y) {
    this.position = {
        X,
        Y
    };
};

//=============================== DRAW A COOKIE ============================================
Cookie.prototype.draw = function() {

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.position.X, this.position.Y, fieldRadius, 0, (Math.PI*2), true);
    ctx.closePath();
    ctx.fill();
};

//=============================== CHECK IF COOKIE IS ON THE EMPTY FIELD ============================================
Cookie.prototype.checkIfEmpty = function() {
    for (var i = 0; i < snake.length; i++) {
        if (snake[i].position.X === this.position.X && snake[i].position.Y === this.position.Y) {
            return false;
        }
    }
    return true;
};

//=============================== GENERATE NEW COOKIE ============================================
function cookieNew(){
    let cookie = new Cookie(rndPosition(),rndPosition());
    if(cookie.checkIfEmpty()){
        cookie.draw();
        cookies.push(cookie);
    }
}

//=============================================================================================
//=============================== SNAKE OBJECT ============================================
function Snake (X, Y) {
    Cookie.call(this, X, Y);
}

Snake.prototype = Object.create(Cookie.prototype);
Snake.prototype.constructor = Snake;

//=============================== DRAW SNAKE ============================================
Snake.prototype.draw = function() {

    ctx.fillStyle = 'green';
    ctx.fillRect(this.position.X - fieldRadius,
                 this.position.Y - fieldRadius,
                 fieldSize,
                 fieldSize);
};

//=============================== SNAKE MOVEMENT ============================================
function snakeNew(posX, posY){
    let snakePiece = new Snake(posX,posY);
    snakePiece.draw();
    snake.unshift(snakePiece);
}

//=============================== GENERATE RANDOM POSITION ============================================
function rndPosition(){
    let pos = Math.floor(Math.random() * boardSize);
    pos -= (pos % fieldSize) + fieldRadius;
    return pos;
}
//=============================== NEW SNAKE HEAD POSITION ============================================
function snakeHeadPosition(){
    switch (direction){
        case keyUp:
            snakeNew(snake[0].position.X, snake[0].position.Y - fieldSize);
            break;
        case keyDown:
            snakeNew(snake[0].position.X, snake[0].position.Y + fieldSize);
            break;
        case keyRight:
            snakeNew(snake[0].position.X + fieldSize, snake[0].position.Y);
            break;
        case keyLeft:
            snakeNew(snake[0].position.X - fieldSize, snake[0].position.Y);
            break;
    }
}
//=============================== ERASE THE TAIL ============================================
function eraseTail(){
ctx.fillStyle = 'lightgrey';
ctx.fillRect(snake[snake.length-1].position.X - fieldRadius,
    snake[snake.length-1].position.Y - fieldRadius,
    fieldSize,
    fieldSize);
}
//=============================== CHECK IF SNAKE ATE COOKIE ============================================
function ateCookie() {
    let speedChange = 5;
    let speedFactor = 0.8;
    for (var i = 0; i < cookies.length; i++) {
        if (snake[0].position.X === cookies[i].position.X && snake[0].position.Y === cookies[i].position.Y) {
            erase = false;
            cookies.splice(i, 1);
            points++;
            statsCookies.textContent = 'Points: ' + points;

            if (points % speedChange === 0) {
                speedInterval *= speedFactor;
                clearInterval(intervalSnake);
                intervalSnake = setInterval(snakeMain, speedInterval);
                speed++;
                statsSpeed.textContent = 'Speed: ' + speed;
            }
        }
    }
}
//=============================== CHECK IF SNAKE ATE HIMSELF ============================================
function ateHimself() {
    for (var i = 1; i < snake.length; i++) {
        if (snake[0].position.X === snake[i].position.X) {
            if (snake[0].position.Y === snake[i].position.Y) {
                endGame();
            }
        }
    }
}
//=============================== CHECK IF SNAKE HIT THE WALL ============================================
function hitTheWall() {
    if (snake[0].position.X > boardSize
        || snake[0].position.X < 0
        || snake[0].position.Y > boardSize
        || snake[0].position.Y < 0) {
        endGame();
    }
}
//=============================== FUNCTION - START GAME ============================================
function startGame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cookies = [];
    generateSnake();
    resetStats();

    msgButton.parentNode.removeChild(msgButton);
    msgBox.parentNode.removeChild(msgBox);

}
//=============================== FUNCTION - GENERATE SNAKE ============================================
function generateSnake (){
    snake = [];

    let snakePiece = new Snake(50,250);
    snake.push(snakePiece);
    snakePiece = new Snake(30,250);
    snake.push(snakePiece);
    snakePiece = new Snake(10,250);
    snake.push(snakePiece);
}
//=============================== FUNCTION - RESET STATS ============================================
function resetStats(){
    var cookieInterval = 2000;
    direction = keyRight;
    points = 0;
    time = 0;
    speed = 1;
    speedInterval = 120;

    statsCookies.textContent = 'Points: 0';
    statsSpeed.textContent = 'Speed: 1';
    statsTime.textContent = 'Time: 0';

    intervalCookie = setInterval(cookieNew, cookieInterval);
    intervalSnake = setInterval(snakeMain, speedInterval);
    intervalClock = setInterval(clock, 100);
}
//=============================== GAME INTERVAL MAIN FUNCTION ============================================
function snakeMain(){
    erase = true; //If snake should be shortened
    snakeHeadPosition();
    ateCookie();
    eraseTail();

    if (erase) {
        snake.pop();
    }

    ateHimself();
    hitTheWall();
}
//=============================== FUNCTION END GAME ============================================
function endGame(){
    clearInterval(intervalCookie);
    clearInterval(intervalSnake);
    clearInterval(intervalClock);

    msgBox = document.createElement('div');
    msgBox.setAttribute('class','msgBox msgBoxM');
    html.appendChild(msgBox);

    msgText = document.createElement('h2');
    msgText.textContent = 'END OF GAME!';
    msgBox.appendChild(msgText);

    msgButton = document.createElement('button');
    msgButton.setAttribute('class','msgButton msgButtonOver');

    msgButton.textContent = 'PLAY AGAIN';
    msgBox.appendChild(msgButton);

    msgButton.onclick = startGame;
}
//=============================== CHANGE DIRECTION ============================================
function changeDir(){
    let x = event.keyCode;

    if ((direction === keyUp || direction === keyDown) && (x === keyRight || x === keyLeft)){
        direction = x;
    }
    if ((direction === keyRight || direction === keyLeft) && (x === keyUp || x === keyDown)){
        direction = x;
    }
}
//=============================== FUNCTION TIMER ============================================
function clock(){
    time += 0.1;
    statsTime.textContent = 'Time: ' + Math.round(time* 100) / 100 +' s';
}

//=============================== FUNCTION - BUTTONS FOR MOBILE ============================================
function lClick() {
    if (direction === keyUp || direction === keyDown) {
        direction = keyLeft;
    }
}

function tClick() {
    if (direction === keyRight || direction === keyLeft) {
        direction = keyUp;
    }
}

function bClick() {
    if (direction === keyRight || direction === keyLeft) {
        direction = keyDown;
    }
}

function rClick() {
    if (direction === keyUp || direction === keyDown) {
        direction = keyRight;
    }
}

//=============================== EVENT LISTENERS ============================================
window.addEventListener('keypress', changeDir);
msgButton.onclick = startGame;
document.getElementById('mButtonL').addEventListener('touchend',lClick,false);
document.getElementById('mButtonT').addEventListener('touchend',tClick,false);
document.getElementById('mButtonB').addEventListener('touchend',bClick,false);
document.getElementById('mButtonR').addEventListener('touchend',rClick,false);