window.addEventListener("load", function () {
    setTimeout(preloadEnd, 2000);
    setInterval(draw, 1000 / framerate);
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
});

function preloadEnd() {
    const preloader = document.querySelector('#preload');
    preloader.classList.add('preload-finish');
}

//webcam stuff

var webcamHeight = 0;
var webcamWidth = 0;

navigator.mediaDevices.getUserMedia({
        video: true
    })
    .then(mediaStream => {
        const track = mediaStream.getVideoTracks()[0];
        webcamHeight = track.getCapabilities().height.max;
        webcamWidth = track.getCapabilities().width.max;
    })

//pong game logic
var canvas = document.getElementById("myCanvas");
var leftScoreDisplay = document.getElementById("player-1-points");
var rightScoreDisplay = document.getElementById("player-2-points");
var bounceClip = new Audio('http://victordibia.com/skyfall/bounce.wav');

var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 15;
var dy = -15;
var ballRadius = 10;

// left player paddle
var cornerRadius = 15;
var leftPaddleHeight = 150;
var leftPaddleWidth = 15;
var leftPaddleX = 10;
var leftPaddleY = canvas.height / 2 - leftPaddleHeight / 2;
console.log(canvas.height, canvas.width);

// Right player paddle
var rightPaddleHeight = 150;
var rightPaddleWidth = 15;
var rightPaddleX = canvas.width - (rightPaddleWidth + 10);
var rightPaddleY = canvas.height / 2 - rightPaddleHeight / 2;

// boolean to handle pressed keys
var leftUpPressed = false;
var leftDownPressed = false;
var rightUpPressed = false;
var rightDownPressed = false;
var leftScore = 0;
var rightScore = 0;

//
var gameOver = false;

function keyDownHandler(e) {
    if (e.keyCode == 87) {
        leftUpPressed = true;
    } else if (e.keyCode == 83) {
        leftDownPressed = true;
    }
    if (e.keyCode == 38) {
        rightUpPressed = true;
    } else if (e.keyCode == 40) {
        rightDownPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 87) {
        leftUpPressed = false;
    } else if (e.keyCode == 83) {
        leftDownPressed = false;
    }
    if (e.keyCode == 38) {
        rightUpPressed = false;
    } else if (e.keyCode == 40) {
        rightDownPressed = false;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function drawScores() {
    leftScoreDisplay.innerHTML = leftScore;
    rightScoreDisplay.innerHTML = rightScore;
}

function collisionsWithLeftPaddle() {
    if ((x - ballRadius) <= 5 + leftPaddleWidth) {
        if (y > leftPaddleY && y < leftPaddleY + leftPaddleHeight) {
            bounceClip.play();
            dx = -dx;
        } else if ((x - ballRadius) <= 0) {
            rightScore++;
            //alert("Game Over");
            x = canvas.width / 2;
            y = canvas.height / 2;
            dx = -dx;
            dy = -dy;
            //         document.location.reload();
            if (rightScore >= winningScore) {
                winnerOverlay.style.opacity = '1';
                winnerOverlay.style.pointerEvents = 'all';
                winnerDisplay.textContent = '2 (Right)';
                isPaused = true;
            }
        }
    }
}

function collisionsWithRightPaddle() {
    if ((x + ballRadius) >= canvas.width - (rightPaddleWidth + 5)) {
        if (y > rightPaddleY && y < rightPaddleY + rightPaddleHeight) {
            bounceClip.play();
            dx = -dx;
        } else if (x + ballRadius >= canvas.width) {
            leftScore++;
            //alert("Game Over");
            x = canvas.width / 2;
            y = canvas.height / 2;
            dx = -dx;
            dy = -dy;
            //document.location.reload();
            if (leftScore >= winningScore) {
                winnerOverlay.style.opacity = '1';
                winnerOverlay.style.pointerEvents = 'all';
                winnerDisplay.textContent = '1 (Left)';
                isPaused = true;
            }
        }
    }
}

function computeCollisionsWithWallsAndPaddle() {
    collisionsWithLeftPaddle();
    collisionsWithRightPaddle();
    if (((y - ballRadius) <= 0) || ((y + ballRadius) >= canvas.height)) {
        dy = -dy;
    }
}

function drawLeftPaddle() {
    // Set faux rounded corners
    ctx.lineJoin = "round";
    ctx.lineWidth = cornerRadius;

    ctx.strokeRect(leftPaddleX + (cornerRadius / 2), leftPaddleY + (cornerRadius / 2), leftPaddleWidth - cornerRadius, leftPaddleHeight - cornerRadius);

    ctx.fillRect(leftPaddleX + (cornerRadius / 2), leftPaddleY + (cornerRadius / 2), leftPaddleWidth - cornerRadius, leftPaddleHeight - cornerRadius);


    ctx.fillStyle = "#e8d60e";
    ctx.strokeStyle = "#e8d60e";

    if ((leftDownPressed && leftPaddleY < canvas.height - leftPaddleHeight)) {
        leftPaddleY += 7;
    } else if ((leftUpPressed && leftPaddleY > 0)) {
        leftPaddleY -= 7;
    }
}

function printLeftPaddleY() {
    console.log(leftPaddleY);
}

function drawRightPaddle() {
    ctx.lineJoin = "round";
    ctx.lineWidth = cornerRadius;

    ctx.strokeRect(rightPaddleX + (cornerRadius / 2), rightPaddleY + (cornerRadius / 2), rightPaddleWidth - cornerRadius, rightPaddleHeight - cornerRadius);

    ctx.fillRect(rightPaddleX + (cornerRadius / 2), rightPaddleY + (cornerRadius / 2), rightPaddleWidth - cornerRadius, rightPaddleHeight - cornerRadius);


    ctx.fillStyle = "#f0931a";
    ctx.strokeStyle = "#f0931a";

    if (rightDownPressed && rightPaddleY < canvas.height - rightPaddleHeight) {
        rightPaddleY += 7;
    } else if (rightUpPressed && rightPaddleY > 0) {
        rightPaddleY -= 7;
    }
}

function drawScene() {
    ctx.beginPath();
    ctx.fill();
    ctx.closePath();
}

function draw() {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScene();
        drawLeftPaddle();
        drawRightPaddle();
        drawBall();
        computeCollisionsWithWallsAndPaddle();
        drawScores();
        x += dx;
        y += dy;
    }
}

//Pausing logic
var isPaused = false;

const pauseButton = document.querySelector('#pause');
var pauseDisplay = document.querySelector('#pause-overlay');

pauseButton.addEventListener('click', function () {
    if (!isPaused) {
        isPaused = true;
        console.log("game is paused");
        pauseDisplay.style.opacity = '1';
        this.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        isPaused = false;
        pauseDisplay.style.opacity = '0';
        this.innerHTML = '<i class="fas fa-pause"></i>';
    }
})

//Handtracking Stuff 
const video = document.querySelector('#webcam-video');
const trackingCanvas = document.getElementById("tracking-canvas");

const context = trackingCanvas.getContext('2d');

let model;

var modelParams = {
    flipHorizontal: true, // flip e.g for video 
    imageScaleFactor: 0.9, // reduce input image size for gains in speed.
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.6, // ioU threshold for non-max suppression
    scoreThreshold: 0.61, // confidence threshold for predictions.
}

handTrack.startVideo(video)
    .then(status => {
        if (status) {
            navigator.getUserMedia({
                    video: {}
                },
                stream => {
                    setInterval(runDetection, 150);
                },
                err => console.log(err)
            )
        }
    })


handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
});

var webcamMiddleY = webcamHeight / 2;
var webcamTopY = webcamHeight / 2;

function runDetection() {
    model.detect(video)
        .then(predictions => {
            model.renderPredictions(predictions, trackingCanvas, context, video);

            if (predictions.length > 0) {
                webcamMiddleY = predictions[0].bbox[1] + (predictions[0].bbox[3] / 2);
                webcamTopY = predictions[0].bbox[1];

                if (predictions[0].bbox[3] / webcamHeight >= 0.7 || predictions[0].bbox[2] / webcamWidth >= 0.7) {
                    modalDisplay('Poor Hand Detection', 'It seems like you are too close to the webcam/camera. A distance between 1.5 and 4 feet is optimal.');
                } else if (predictions[0].bbox[3] / webcamHeight <= 0.2) {
                    modalDisplay('Poor Hand Detection', 'It seems like you are too far from the webcam/camera. A distance between 1.5 and 4 feet is optimal depending on hand.');
                }

                if (playerDetection == 1) {
                    if (webcamMiddleY > webcamHeight / 3) {
                        leftPaddleY = (webcamTopY + (webcamMiddleY - webcamTopY)) * canvas.height / webcamHeight;
                    } else if (webcamMiddleY > webcamHeight * 2 / 3 && ((webcamTopY + (predictions[0].bbox[3])) * canvas.height / webcamHeight) < canvas.height - leftPaddleHeight) {
                        leftPaddleY = (webcamTopY + (predictions[0].bbox[3])) * canvas.height / webcamHeight;
                    } else {
                        leftPaddleY = webcamTopY * canvas.height / webcamHeight;
                    }
                } else if (playerDetection == 2) {
                    if (webcamMiddleY > webcamHeight / 3) {
                        rightPaddleY = (webcamTopY + (webcamMiddleY - webcamTopY)) * canvas.height / webcamHeight;
                    } else if (webcamMiddleY > webcamHeight * 2 / 3 && ((webcamTopY + (predictions[0].bbox[3])) * canvas.height / webcamHeight) < canvas.height - leftPaddleHeight) {
                        rightPaddleY = (webcamTopY + (predictions[0].bbox[3])) * canvas.height / webcamHeight;
                    } else {
                        rightPaddleY = webcamTopY * canvas.height / webcamHeight;
                    }
                }
            }
        });
}

//options logic
const optionsButton = document.querySelector('#options');

const optionsOverlay = document.querySelector('#options-overlay');
const optionsClose = document.querySelector('#options-close');

optionsButton.addEventListener('click', function () {
    if (!isPaused) {
        isPaused = true;
        console.log("game is paused");
        pauseButton.innerHTML = '<i class="fas fa-play"></i>';
        optionsOverlay.style.opacity = '1';
        optionsOverlay.style.pointerEvents = 'all';
    } else {
        isPaused = false;
        pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        optionsOverlay.style.opacity = '0';
        optionsOverlay.style.pointerEvents = 'none';
    }
})

optionsClose.addEventListener('click', function () {
    isPaused = false;
    pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    optionsOverlay.style.opacity = '0';
    optionsOverlay.style.pointerEvents = 'none';
})

var framerate = 30;
var winningScore = 11;
var playerDetection = 1;

var framerateSlider = document.getElementById("framerate-slider");
var framerateDisplay = document.getElementById("framerate-value");

framerateSlider.value = framerate;
framerateDisplay.textContent = framerateSlider.value;

framerateSlider.oninput = function () {
    framerate = this.value;
    framerateDisplay.textContent = framerate;
}

var winningScoreSlider = document.getElementById("score-slider");
var winningScoreDisplay = document.getElementById("score-value");
var winnerOverlay = document.getElementById("winner-overlay");
var winnerDisplay = document.getElementById("winner-text");

winningScoreSlider.value = winningScore;
winningScoreDisplay.textContent = winningScoreSlider.value;

winningScoreSlider.oninput = function () {
    winningScore = this.value;
    winningScoreDisplay.textContent = winningScore;
}

var resetButton = document.getElementById("reset-button");

resetButton.addEventListener('click', function () {
    winnerOverlay.style.opacity = '0';
    winnerOverlay.style.pointerEvents = 'none';
    isPaused = false;
    leftScore = 0;
    rightScore = 0;
});

var playerLeftDetectionButton = document.getElementById("player-1-track");
var playerRightDetectionButton = document.getElementById("player-2-track");

playerLeftDetectionButton.addEventListener('click', function () {
    this.classList.add('is-selected');
    playerRightDetectionButton.classList.remove('is-selected');
    playerDetection = 1;
});

playerRightDetectionButton.addEventListener('click', function () {
    this.classList.add('is-selected');
    playerLeftDetectionButton.classList.remove('is-selected');
    playerDetection = 2;
});

//modal logic

const modalOverlay = document.querySelector('#modal-overlay');
const modalClose = document.querySelector('#modal-close');
const modalTitle = document.querySelector('#modal-title');
const modalText = document.querySelector('#modal-text');

function modalDisplay(title, text) {
    modalOverlay.style.opacity = '1';
    modalOverlay.style.pointerEvents = 'all';

    modalTitle.innerHTML = title;
    modalText.innerHTML = text;
};

modalClose.addEventListener('click', function () {
    modalOverlay.style.opacity = '0';
    modalOverlay.style.pointerEvents = 'none';
});

window.addEventListener('resize', function () {
    var w = window.innerWidth;
    var h = window.innerHeight;

    if (w < 700 || h < 700) {
        modalDisplay('Poor Mobile Experience', 'Currently, this game is not optimized for mobile screens. Work is in progress. However, the game is still playable.');
    }
})