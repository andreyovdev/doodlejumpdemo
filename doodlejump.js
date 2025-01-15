let canvas, ctx;
let doodler;
let platforms = [];
let breakablePlatforms = [];
let coins = []; 
let score = 0;
let scoreBest = 0;
let coinsCollected = 0;
const platformCount = 6;
let highestPlatformY = 0;
let gameOver = false;
let doodlerSelectedImage = 0;
let doodlerCollected = [];
let clickX = 0;
let clickY = 0;

let doodlerWidth = 50;
let doodlerHeight = 50;

let doodlerImageLeft = new Image(); 
let doodlerImageRight = new Image(); 
let platformImageNormal = new Image(); 
let platformImageBreakable = new Image(); 
let coinImage = new Image(); 

let doodler2ImageLeft = new Image(); 
let doodler2ImageRight = new Image(); 
let doodler3ImageLeft = new Image(); 
let doodler3ImageRight = new Image(); 
let doodler4ImageLeft = new Image(); 
let doodler4ImageRight = new Image(); 

function init() {
    canvas = document.getElementById('board');
    canvas.width = 360;
    canvas.height = 640;
    ctx = canvas.getContext('2d');

    doodlerImageLeft.src = 'doodler1-left.png'; 
    doodlerImageRight.src = 'doodler1-right.png'; 
    platformImageNormal.src = 'platform.png';
    platformImageBreakable.src = 'platform-broken.png'; 
    coinImage.src = 'coin.png';
 	
	doodler2ImageLeft.src = 'doodler2-left.png'; 
    doodler2ImageRight.src = 'doodler2-right.png'; 
	doodler3ImageLeft.src = 'doodler3-left.png'; 
    doodler3ImageRight.src = 'doodler3-right.png'; 
	doodler4ImageLeft.src = 'doodler4-left.png'; 
    doodler4ImageRight.src = 'doodler4-right.png'; 

    doodler = new Doodler(canvas.width / 2 - doodlerWidth  / 2, canvas.height - 100); 
    
    generatePlatforms();
    requestAnimationFrame(update);
    generateNewPlatforms();

 canvas.addEventListener('click', function(event) {
    clickX = event.offsetX;
    clickY = event.offsetY;
    
selectDoodler();
  });
}

class Doodler {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = doodlerWidth;
        this.height = doodlerHeight;
        this.velocityY = 0;
        this.jumpForce = 7;
        this.isJumping = true;
	this.lookingDirection = 0;
    }

    jump() {
        this.velocityY = -this.jumpForce;
        this.isJumping = true;
    }

    applyGravity() {
        this.velocityY += 0.12;
        this.y += this.velocityY;
    }

    render() {
	let leftImage = doodlerImageLeft;
	let rightImage = doodlerImageRight;

	if(doodlerSelectedImage == 1){
		leftImage = doodler2ImageLeft;
		rightImage = doodler2ImageRight;
	} else if(doodlerSelectedImage == 2){
		leftImage = doodler3ImageLeft;
		rightImage = doodler3ImageRight;
	} if(doodlerSelectedImage == 3){
		leftImage = doodler4ImageLeft;
		rightImage = doodler4ImageRight;
	} 

	if(this.lookingDirection == 0) {
		ctx.drawImage(leftImage, this.x, this.y, this.width, this.height);
	} else {
		ctx.drawImage(rightImage, this.x, this.y, this.width, this.height);
	}
        
    }

     update(deltaTime) {
        this.applyGravity();
        this.y += this.velocityY * deltaTime; 

        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height;
            gameOver = true;
        }
    }
}

class Platform {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 80; 
        this.height = 20; 
        this.type = type; 
        this.broken = false;
        this.direction = 1;
this.speed = 88;
    }

    render() {
        if (this.type === 0 || this.type === 2) {
            ctx.drawImage(platformImageNormal, this.x, this.y, this.width, this.height);
        } else if (this.type === 1) {
            ctx.drawImage(platformImageBreakable, this.x, this.y, this.width, this.height);
        } 
    }

     update(deltaTime) {
        let speedMultiplier = 1;

        if (doodler.y < canvas.height / 2) {
            speedMultiplier = 1 + (canvas.height / 2 - doodler.y) / 1000;
        }

        if (this.type === 2) { 
	this.x += this.direction * this.speed * speedMultiplier * deltaTime;
            
            if (this.x <= 0 || this.x + this.width >= canvas.width) {
                this.direction *= -1;
            }
        }
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 26; 
        this.height = 26; 
        this.collected = false;
    }

    render() {
        if (!this.collected) {
            ctx.drawImage(coinImage, this.x, this.y, this.width, this.height);
        }
    }

    checkCollision(doodler) {
        if (
            !this.collected &&
            doodler.x + doodler.width > this.x &&
            doodler.x < this.x + this.width &&
            doodler.y + doodler.height > this.y &&
            doodler.y < this.y + this.height
        ) {
            this.collected = true;
coinsCollected++; 
        }
    }

    update(amount) {
        if (!this.collected) {
        }
    }
}


function generatePlatforms() {
    platforms.push(new Platform(canvas.width / 2 - 30, canvas.height - 50, 0)); 
}

function generateNewPlatforms() {
    const step = canvas.height / platformCount + 30;
    const newPlatformY = platforms[platforms.length - 1].y - step;

    if (newPlatformY < 0) return;

    for (let i = 0; i < platformCount; i++) {
        const isBreakable = Math.random() < 0.25;
        const isMoving = Math.random() < 0.25;  
        const type = isBreakable ? 1 : 0; 
        
        if (isBreakable) {
            breakablePlatforms.push(new Platform(Math.random() * (canvas.width - 80), (newPlatformY - step * i) -20, 1)); 
        } 
	let platformX = Math.random() * (canvas.width - 80);
        if (isMoving) {
            platforms.push(new Platform(platformX , (newPlatformY - step  * i), 2));
        } else {
        if (Math.random() < 0.15) { 
            const coinX = platformX + 28; 
            coins.push(new Coin(coinX, newPlatformY - step * i - 35));  
        }
            platforms.push(new Platform(platformX , (newPlatformY - step * i), 0));
        }



        if (i === platformCount - 1) {
            highestPlatformY = newPlatformY - step * i;
        }
    }
}

function checkCollisions() {
    platforms.forEach(platform => {
        if (doodler.y + doodler.height > platform.y &&
            doodler.y + doodler.height < platform.y + platform.height &&
            doodler.x + doodler.width > platform.x &&
            doodler.x < platform.x + platform.width &&
            doodler.velocityY > 0) {
                doodler.jump();
                if (platform.y > highestPlatformY) {
                    highestPlatformY = platform.y;
                    score += 1;
                }
        }
    });

    breakablePlatforms.forEach(platform => {
        if (doodler.y + doodler.height > platform.y &&
            doodler.y + doodler.height < platform.y + platform.height &&
            doodler.x + doodler.width > platform.x &&
            doodler.x < platform.x + platform.width &&
            doodler.velocityY > 0) {
                platform.broken = true;
        }
    });

    platforms = platforms.filter(platform => !platform.broken); 
    breakablePlatforms = breakablePlatforms.filter(platform => !platform.broken);

 coins.forEach(coin => {
        coin.checkCollision(doodler); 
    });

    coins = coins.filter(coin => !coin.collected);
}

function movePlatformsDown(amount) {
    let speedMultiplier = 53;

    if (doodler.y > canvas.height / 2) {
        speedMultiplier = 1 + (canvas.height / 2 - doodler.y) / 500;  
    }

    platforms.forEach(platform => {
        platform.y += amount * speedMultiplier;
    });

    breakablePlatforms.forEach(platform => {
        platform.y += amount * speedMultiplier;
    });

  coins.forEach(coin => {
        coin.y += amount * speedMultiplier;  
    });
}

let leftPressed = false;
let rightPressed = false;

function handleInput() {
    if (leftPressed) {
        doodler.x -= 3;
        if (doodler.x < 0) doodler.x = 0;
	doodler.lookingDirection = 0;
    }

    if (rightPressed) {
        doodler.x += 3;
        if (doodler.x + doodler.width > canvas.width) doodler.x = canvas.width - doodler.width;
    	doodler.lookingDirection = 1;
	}
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightPressed = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
    }
});
function selectDoodler(){

if(!gameOver){return;}

if(clickX >doodler2ShopX && clickX <doodler2ShopX + doodlerWidth
	&& clickY >doodlerShopY && clickY <doodlerShopY + doodlerHeight)
{
if(coinsCollected >= 1 && !doodlerCollected.includes(1)) {
	coinsCollected -= 1;
ctx.clearRect(0, 0, canvas.width, canvas.height);
	displayGameOver();
	doodlerSelectedImage = 1;
doodlerCollected.push(1);

}	
}

if(clickX >doodler3ShopX && clickX <doodler3ShopX + doodlerWidth
	&& clickY >doodlerShopY && clickY <doodlerShopY + doodlerHeight)
{
if(coinsCollected >= 3  && !doodlerCollected.includes(2)) {
	coinsCollected -= 3;
ctx.clearRect(0, 0, canvas.width, canvas.height);
	displayGameOver();
	doodlerSelectedImage = 2;
doodlerCollected.push(2);
}	
}

if(clickX >doodler4ShopX && clickX <doodler4ShopX + doodlerWidth
	&& clickY >doodlerShopY && clickY <doodlerShopY + doodlerHeight)
{
if(coinsCollected >= 10 && !doodlerCollected.includes(3)) {
	coinsCollected -= 10;
ctx.clearRect(0, 0, canvas.width, canvas.height);
	displayGameOver();
	doodlerSelectedImage = 3;
doodlerCollected.push(3);
}	
}

}

const doodler2ShopX = 30 * 2;
const doodler3ShopX = 30 * 5.3;
const doodler4ShopX = 30 * 8.5;
const doodlerShopY = 120;

function displayShop(){
ctx.drawImage(doodler2ImageRight, doodler2ShopX, doodlerShopY , doodlerWidth, doodlerHeight);
ctx.drawImage(doodler3ImageRight, doodler3ShopX, doodlerShopY , doodlerWidth, doodlerHeight);
ctx.drawImage(doodler4ImageRight, doodler4ShopX, doodlerShopY , doodlerWidth, doodlerHeight);

 ctx.fillStyle = 'black';

ctx.font = '20px Arial';
    const priceText = `1🌕`;
    ctx.fillText(priceText, 30 * 2, 200);

const priceText2 = `3🌕`;
    ctx.fillText(priceText2, 30 * 5.3, 200);

const priceText3 = `10🌕`;
    ctx.fillText(priceText3, 30 * 8.5, 200);


    const coinsText = `Coins: ${coinsCollected}`;
    const coinTextWidth = ctx.measureText(coinsText ).width;
    ctx.fillText(coinsText , (canvas.width - coinTextWidth ) / 2, 60);

const topScoreText = `Top Score: ${scoreBest}`;
    const topScoreTextWidth = ctx.measureText(topScoreText ).width;
    ctx.fillText(topScoreText  , (canvas.width - topScoreTextWidth  ) / 2, 30);

}

function displayGameOver() {
if(score > scoreBest) {
scoreBest = score;
}

  displayShop()	

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 100); 
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
    
    ctx.font = '20px Arial';
    const scoreText = `Score: ${score}`;
    const textWidth = ctx.measureText(scoreText).width;
    ctx.fillText(scoreText, (canvas.width - textWidth) / 2, canvas.height / 2 + 30);




    ctx.fillText('Press R to Restart', canvas.width / 2 - 90, canvas.height / 2 + 60);
}

function restartGame() {


    gameOver = false;
    score = 0;
    platforms = [];
    breakablePlatforms = [];
    generatePlatforms(); 
    generateNewPlatforms();
    doodler.y = canvas.height - 100; 
    doodler.x = canvas.width / 2 - doodler.width / 2; 
    doodler.velocityY = 0; 
    requestAnimationFrame(update);
}

document.addEventListener('keydown', (event) => {
    if (gameOver && event.key === 'r') {
        restartGame();
    }
});

let lastTime = 0;

function update(timestamp) {
    let deltaTime = (timestamp - lastTime) / 1000; 
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        displayGameOver();
        return;
    }

    handleInput();
    doodler.update(deltaTime);
    doodler.render();

    platforms.forEach(platform => {
        platform.update(deltaTime); 
        platform.render();
    });

    breakablePlatforms.forEach(platform => {
        platform.update(deltaTime); 
        platform.render();
    });


    coins.forEach(coin => {
        coin.update(deltaTime);
        coin.render(); 
    });

    checkCollisions();

    if (doodler.y < canvas.height / 2) {
        generateNewPlatforms();
        movePlatformsDown(doodler.jumpForce * deltaTime);  
        doodler.y += doodler.jumpForce * deltaTime; 
    }

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`🏆 ${score}`, 20, 40);

ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`${coinsCollected} 🌕`, 300, 40);

    requestAnimationFrame(update);  
}



window.onload = init;
