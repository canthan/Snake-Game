/*
 function cookie(){
 var x = Math.floor(Math.random() * boardSize);
 x = x - (x % fieldSize) + fieldSize / 2;

 var y = Math.floor(Math.random() * boardSize);
 y = y - (y % fieldSize) + fieldSize / 2;

 cookieX.push(x);
 cookieY.push(y);

 ctx.fillStyle = 'black';
 ctx.beginPath();
 ctx.arc(x, y, fieldSize / 2, 0, (Math.PI*2), true);
 ctx.closePath();
 ctx.fill();
 }
 */
/*
 function cookie(){
 var x = rndPosition();

 var y = rndPosition();

 cookieX.push(x);
 cookieY.push(y);

 ctx.fillStyle = 'black';
 ctx.beginPath();
 ctx.arc(x, y, fieldSize / 2, 0, (Math.PI*2), true);
 ctx.closePath();
 ctx.fill();

 }*


 //=============================== POMOCNICZE WYŚWIETLANIE ============================================
 /* var wsp = document.createElement('p');
 wsp.textContent = 'Współrzędne: ' + cookieX;
 document.body.appendChild(wsp);*/

//=============================== DRAW A SNAKE ============================================
ctx.fillStyle = 'green';
ctx.fillRect(snake[0].position.X-fieldSize/2,
    snake[0].position.Y-fieldSize/2,
    fieldSize,
    fieldSize);