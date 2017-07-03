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
const KEY_UP = 119; // w
const KEY_DOWN = 115; // s
const KEY_RIGHT = 100; // d
const KEY_LEFT = 97; // a

const BOARD_SIZE = 500;
const FIELD_SIZE = 20;
const FIELD_RADIUS = FIELD_SIZE / 2;

var direction = 97;
var points = 0;
var time = 0;
var speed = 1;
var speedInterval = 120;
var erase = true; //If snake should be shortened
var canChangeDir = true;

//=============================== COOKIE CLASS ============================================
class Cookie  {
    constructor(X, Y){
        this.position = {X,Y};
    }

    get getX() {return this.position.X;}
    get getY() {return this.position.Y;}
};

//=============================== DRAW A COOKIE ============================================
Cookie.prototype.draw = function() {

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.getX, this.getY, FIELD_RADIUS, 0, (Math.PI*2), true);
    ctx.closePath();
    ctx.fill();
};
//=============================== CHECK IF COOKIE IS ON THE EMPTY FIELD ============================================
Cookie.prototype.checkIfEmpty = function() {
    for (var i in snake) {
        if (snake[i].getX === this.getX && snake[i].getY === this.getY) {
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
//=============================== GENERATE RANDOM POSITION ============================================
function rndPosition(){
    let pos = Math.floor(Math.random() * BOARD_SIZE);
    pos -= (pos % FIELD_SIZE) + FIELD_RADIUS;
    return pos;
}

//=============================================================================================
//=============================== SNAKE CLASS ============================================
class Snake extends Cookie {}

Snake.prototype = Object.create(Cookie.prototype);

//=============================== DRAW SNAKE ============================================
Snake.prototype.draw = function() {

    ctx.fillStyle = 'green';
    ctx.fillRect(this.getX - FIELD_RADIUS,
                 this.getY - FIELD_RADIUS,
                 FIELD_SIZE,
                 FIELD_SIZE);
}

//=============================== NEW SNAKE HEAD POSITION ============================================
function snakeHeadPosition(){
    switch (direction){
        case KEY_UP:
            snakeNew(snake[0].getX, snake[0].getY - FIELD_SIZE);
            break;
        case KEY_DOWN:
            snakeNew(snake[0].getX, snake[0].getY + FIELD_SIZE);
            break;
        case KEY_RIGHT:
            snakeNew(snake[0].getX + FIELD_SIZE, snake[0].getY);
            break;
        case KEY_LEFT:
            snakeNew(snake[0].getX - FIELD_SIZE, snake[0].getY);
            break;
    }
}
//=============================== SNAKE MOVEMENT ============================================
function snakeNew(posX, posY){
    let snakePiece = new Snake(posX,posY);
    snakePiece.draw();
    snake.unshift(snakePiece);
}
//=============================== CHECK IF SNAKE ATE COOKIE ============================================
function ateCookie() {
    let speedChange = 5;
    let speedFactor = 0.8;
    for (var i in cookies) {
        if (snake[0].getX === cookies[i].getX && snake[0].getY === cookies[i].getY) {
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
//=============================== ERASE THE TAIL ============================================
function eraseTail(){
ctx.fillStyle = 'lightgrey';
ctx.fillRect(snake[snake.length-1].getX- FIELD_RADIUS,
    snake[snake.length-1].getY - FIELD_RADIUS,
    FIELD_SIZE,
    FIELD_SIZE);
}
//=============================== CHECK IF SNAKE ATE HIMSELF ============================================
function ateHimself() {
    for (var i = 1; i < snake.length; i++) {
        if (snake[0].getX === snake[i].getX) {
            if (snake[0].getY === snake[i].getY) {
                endGame();
            }
        }
    }
    canChangeDir = true;
}
//=============================== CHECK IF SNAKE HIT THE WALL ============================================
function hitTheWall() {
    if (snake[0].getX > BOARD_SIZE
        || snake[0].getX < 0
        || snake[0].getY > BOARD_SIZE
        || snake[0].getY < 0) {
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
    direction = KEY_RIGHT;
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
    if (canChangeDir){
        if ((direction === KEY_UP || direction === KEY_DOWN) && (x === KEY_RIGHT || x === KEY_LEFT)){
            direction = x;
            canChangeDir = false;
        }
        if ((direction === KEY_RIGHT || direction === KEY_LEFT) && (x === KEY_UP || x === KEY_DOWN)){
            direction = x;
            canChangeDir = false;
        }
    }
}
//=============================== FUNCTION TIMER ============================================
function clock(){
    time += 0.1;
    statsTime.textContent = 'Time: ' + Math.round(time* 100) / 100 +' s';
}

//=============================== FUNCTION - BUTTONS FOR MOBILE ============================================
function lClick() {
    if ((direction === KEY_UP || direction === KEY_DOWN)&&canChangeDir) {
        direction = KEY_LEFT;
        canChangeDir = false;
    }
}

function tClick() {
    if ((direction === KEY_RIGHT || direction === KEY_LEFT)&&canChangeDir) {
        direction = KEY_UP;
        canChangeDir = false;
    }
}

function bClick() {
    if ((direction === KEY_RIGHT || direction === KEY_LEFT)&&canChangeDir) {
        direction = KEY_DOWN;
        canChangeDir = false;
    }
}

function rClick() {
    if ((direction === KEY_UP || direction === KEY_DOWN)&&canChangeDir) {
        direction = KEY_RIGHT;
        canChangeDir = false;
    }
}

//=============================== EVENT LISTENERS ============================================
window.addEventListener('keypress', changeDir);
msgButton.onclick = startGame;
document.getElementById('mButtonL').addEventListener('touchend',lClick,false);
document.getElementById('mButtonT').addEventListener('touchend',tClick,false);
document.getElementById('mButtonB').addEventListener('touchend',bClick,false);
document.getElementById('mButtonR').addEventListener('touchend',rClick,false);