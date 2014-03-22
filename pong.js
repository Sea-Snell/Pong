$(document).ready(function() {
    console.log("game running");
    var backGround = new Canvas(50, 50, 400, 700, '#000000');
    var leftPaddle = new Paddle(25, 200, 50, 10, '#ffffff');
    var rightPaddle = new Paddle(675, 200, 50, 10, '#ffffff');
    var ball = new Ball(350, 200, 20, 20, 50, '#ffffff');
    var midLine = new MidLine(358, 5, 405, 2, '#ffffff');
    var scoreBoard = new ScoreBoard(0, 10, 100, 700, 11, '#aaaaaa');
    var timeout = setTimeout(ballFrameFunction, 2000);
    var resetGame = function() {
        ball.x = 350;
        ball.y = 200;
        leftPaddle.x = 25;
        leftPaddle.y = 200;
        rightPaddle.x = 675;
        rightPaddle.y = 200;
        ball.startDirection();
        clearInterval(ballFrame);
        clearInterval(speedFrame);
        setTimeout(ballFrameFunction, 2000 + (10 * scoreBoard.leftBarIncrement));
    }
    
    var keys = {
        upArrow: 38,
        downArrow: 40,
        spaceBar: 32,
        lowerW: 87,
        lowerS: 83
    };
    
    function Paddle(x, y, height, width, color) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.color = color;
        this.paddleDiv = $('<div class = "paddle"></div>');
        $('.canvas').append(this.paddleDiv);
        this.paddleDiv.css('left', x);
        this.paddleDiv.css('top', y);
        this.paddleDiv.css('background-color', color);
        this.paddleDiv.height(height);
        this.paddleDiv.width(width);
        this.paddleYUpwardSpeed = 1;
        this.paddleYDownwardSpeed = 1;
        
        $(document).keydown(function(key){
            var keyId = parseInt(key.which,10);
            if(keyId === keys.lowerW) leftPaddle.lowerWIsPressed = 1; 
            if(keyId === keys.lowerS) leftPaddle.lowerSIsPressed = 1;
            if(keyId === keys.upArrow) rightPaddle.upArrowIsPressed = 1; 
            if(keyId === keys.downArrow) rightPaddle.downArrowIsPressed = 1;
        });
        
        $(document).keyup(function(key){
            var keyId = parseInt(key.which,10);
            if(keyId === keys.lowerW) leftPaddle.lowerWIsPressed = 0; 
            if(keyId === keys.lowerS) leftPaddle.lowerSIsPressed = 0;
            if(keyId === keys.upArrow) rightPaddle.upArrowIsPressed = 0; 
            if(keyId === keys.downArrow) rightPaddle.downArrowIsPressed = 0;
        });
        
        this.rightPaddleKeyPress = function() {
            if(rightPaddle.upArrowIsPressed === 1) rightPaddle.y -= rightPaddle.paddleYUpwardSpeed;
            if(rightPaddle.downArrowIsPressed === 1) rightPaddle.y += rightPaddle.paddleYDownwardSpeed;
        }
        
        this.leftPaddleKeyPress = function() {
            if(leftPaddle.lowerWIsPressed === 1) leftPaddle.y -= leftPaddle.paddleYUpwardSpeed;
            if(leftPaddle.lowerSIsPressed === 1) leftPaddle.y += leftPaddle.paddleYDownwardSpeed;
        }
        
        this.ifPaddleOutOfPlay = function() {
            if(this.y >= 360) this.paddleYDownwardSpeed = 0;
            if(this.y < 360) this.paddleYDownwardSpeed = 5;
            if(this.y <= 5) this.paddleYUpwardSpeed = 0;
            if(this.y > 5) this.paddleYUpwardSpeed = 5;
        }
        
        this.paddleMovement = function() {
            this.paddleDiv.css('top', this.y);
        }
    }

    function Canvas(x, y, height, width, color) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.color = color;
        this.canvasDiv = $('<div class = "canvas"></div>');
        $('body').append(this.canvasDiv);
        this.canvasDiv.css('left', x);
        this.canvasDiv.css('top', y);
        this.canvasDiv.css('background-color', color);
        this.canvasDiv.height(height);
        this.canvasDiv.width(width);
    }

    function Ball(x, y, height, width, radius, color) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.radius = radius;
        this.color = color;
        this.ballDiv = $('<div class = "ball"></div>');
        $('.canvas').append(this.ballDiv);
        this.ballDiv.css('left', x);
        this.ballDiv.css('top', y);
        this.ballDiv.css('background-color', color);
        this.ballDiv.height(height);
        this.ballDiv.width(width);
        this.ballDiv.css('border-radius', radius + '%');
    
        this.startDirection = function() {
            this.xSkipPositive = Math.floor((Math.random() * 2) + 1);
            this.xSkipNegative = Math.floor(Math.random() * -2);
            this.xSkipChoice = Math.floor(Math.random() + 0.5);
            this.ySkipPositive = Math.floor((Math.random() * 2) + 1);
            this.ySkipNegative = Math.floor(Math.random() * -2);
            this.ySkipChoice = Math.floor(Math.random() + 0.5);
            if(this.xSkipChoice === 0) this.xChosen = this.xSkipPositive;
            if(this.xSkipChoice === 1) this.xChosen = this.xSkipNegative;
            if(this.ySkipChoice === 0) this.yChosen = this.ySkipPositive;
            if(this.ySkipChoice === 1) this.yChosen = this.ySkipNegative;
        }
        
        this.ifHitWall = function() {
            if(ball.y >= 390 || ball.y <= 5) this.yChosen *= -1;
        }
        
        this.ifHitPaddle = function() {
            if(ball.y + 20 >= leftPaddle.y && ball.y <= leftPaddle.y + 50 && ball.x <= leftPaddle.x + 10 && ball.x >= leftPaddle.x) this.xChosen *= -1;
            if(ball.y + 20 >= rightPaddle.y && ball.y <= rightPaddle.y + 50 && ball.x + 20 >= rightPaddle.x && ball.x + 20 <= rightPaddle.x + 10) this.xChosen *= -1;
        }
        
        this.ifBallOutOfPlay = function() {
            if(ball.x <= -20) {
                scoreBoard.rightScore += 1;
                resetGame();
            }
            if(ball.x >= 720) {
                scoreBoard.leftScore += 1;
                resetGame();
            }
        }
        
        this.ballSpeedIncrease = function() {
            if(ball.xChosen >= 1) ball.xChosen += 1;
            if(ball.xChosen <= -1) ball.xChosen -= 1;
            if(ball.yChosen >= 1) ball.yChosen += 1;
            if(ball.yChosen <= -1) ball.yChosen -= 1;
        }
        
        this.ballMovement = function() {
                ball.ballDiv.css('left', ball.x += this.xChosen);
                ball.ballDiv.css('top', ball.y -= this.yChosen);
            }
    }

    function MidLine(x, y, height, width, color) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.color = color;
        this.midLineDiv = $('<div class = "midLine">');
        $('.canvas').append(this.midLineDiv);
        this.midLineDiv.css('left', x);
        this.midLineDiv.css('top', y);
        this.midLineDiv.css('background-color', color);
        this.midLineDiv.height(height);
        this.midLineDiv.width(width);
    
    }
    
    function ScoreBoard (x, y, height, width, scoreToWin, color){
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.scoreToWin = scoreToWin;
        this.color = color;
        this.scoreMeterLeftWidth = 0;
        this.scoreMeterRightWidth = 0;
        this.leftScore = 0;
        this.rightScore = 0;
        this.scoreBoardDiv = $('<div class = "scoreBoard"></div>');
        this.scoreVisualLeft = $('<div class = "leftScore"></div>');
        this.scoreVisualRight = $('<div class = "rightScore"></div>');
        this.scoreMeterLeft = $('<div class = "leftScoreMeter"></div>');
        this.scoreMeterRight = $('<div class = "rightScoreMeter"></div>');
        this.scoreBar = $('<div class = "scoreBar"></scoreBar>');
        this.midBar = $('<div class = midBar></div>');
        this.highScore = $('<div class = scoreToWin></div>');
        this.maxScoreSlider = $('<input type = "range" min = "1" max = "272" value = "11" name = "maxScore"></input>');
        this.scoreVariable = $('<div class = "scoreVariable">Score To Win:</div>');
        this.resetScore = $('<div class = "resetScore">Reset Score</div>');
        this.scoreVarCanvas = $('<div class = "scoreVarCanvas"></div>');
        $('body').append(this.scoreBoardDiv);
        $(this.scoreBoardDiv).append(this.scoreVisualLeft);
        $(this.scoreBoardDiv).append(this.scoreVisualRight);
        $(this.scoreBar).append(this.scoreMeterLeft);
        $(this.scoreBar).append(this.scoreMeterRight);
        $(this.scoreBoardDiv).append(this.scoreBar);
        $(this.scoreBar).append(this.midBar);
        $('body').append(this.scoreVarCanvas);
        $(this.scoreVarCanvas).append(this.maxScoreSlider);
        $(this.scoreVarCanvas).append(this.highScore);
        $(this.scoreVarCanvas).append(this.scoreVariable);
        $(this.scoreVarCanvas).append(this.resetScore);
        this.scoreBoardDiv.css('left', x);
        this.scoreBoardDiv.css('top', y);
        this.scoreBoardDiv.css('background-color', color);
        this.scoreBoardDiv.height(height);
        this.scoreBoardDiv.width(width);
        this.scoreMeterLeft.width(this.scoreMeterLeftWidth);
        this.scoreMeterRight.width(this.scoreMeterRightWidth);
        
        this.scoreUpdate = function() {
            $('.leftScore').html(this.leftScore);
            $('.rightScore').html(this.rightScore);
        }
        
        this.ifScoreMaxed = function() {
            if(this.leftScore >= this.scoreToWin) {
                if(this.scoreMeterLeftWidth >= 275) {
                        confirm("Game over left player wins! Would you like to play again?");
                        this.leftScore = 0;
                        this.rightScore = 0;
                }
            }
            if(this.rightScore >= this.scoreToWin) {
                if(this.scoreMeterRightWidth >= 272) {
                    confirm("Game over right player wins! Would you like to play again?");
                    this.leftScore = 0;
                    this.rightScore = 0;
                }
            }
        }
            this.maxScoreSet = function() {
                this.maxScoreSetting = $('input[name = maxScore]').val();
                this.scoreToWin = this.maxScoreSetting;
                $('.scoreToWin').html(this.maxScoreSetting);
            }
        
        this.barIncrease = function() {
            this.rightBarIncrement = 272 / this.scoreToWin;
            this.leftBarIncrement = 275 / this.scoreToWin;
            if(this.scoreMeterLeftWidth < this.leftBarIncrement * this.leftScore) {
                $('.leftScoreMeter').width(this.scoreMeterLeftWidth += 1);
            }
            if(this.scoreMeterRightWidth < this.rightBarIncrement * this.rightScore) {
                $('.rightScoreMeter').width(this.scoreMeterRightWidth += 1);
            }
            if(this.scoreMeterLeftWidth > this.leftBarIncrement * this.leftScore){
                $('.leftScoreMeter').width(this.scoreMeterLeftWidth -= 1);
            }
            if(this.scoreMeterRightWidth > this.rightBarIncrement * this.rightScore){
                $('.rightScoreMeter').width(this.scoreMeterRightWidth -= 1);
            }
        }
        
        this.ifScoreReset = function() {
            $('.resetScore').click(function() {
                scoreBoard.leftScore = 0;
                scoreBoard.rightScore = 0;
            });
        }
        
        this.ifHoverOverResetScore = function() {
            $('.resetScore').hover(function() {
                $('.resetScore').css('background-color', '#aaaaaa');
                $('.resetScore').css('color', '#333333');
            }, 
            function() {
                $('.resetScore').css('background-color', '#000000');
                $('.resetScore').css('color', '#ffffff');
            });
        }
    }
    
    var speedFrameWork = function() {
        ball.ballSpeedIncrease();
    }
    
    var ballFrameWork = function() {
        ball.ifBallOutOfPlay();
        ball.ifHitWall();
        ball.ifHitPaddle();
        ball.ballMovement();
    }
    
    var paddleFrameWork = function() {
        leftPaddle.ifPaddleOutOfPlay();
        rightPaddle.ifPaddleOutOfPlay();
        leftPaddle.leftPaddleKeyPress();
        rightPaddle.rightPaddleKeyPress();
        leftPaddle.paddleMovement();
        rightPaddle.paddleMovement();
        scoreBoard.barIncrease();
        scoreBoard.scoreUpdate();
        scoreBoard.maxScoreSet();
        scoreBoard.ifScoreMaxed();
        scoreBoard.ifScoreReset();
        scoreBoard.ifHoverOverResetScore();
    }
    
    ball.startDirection();
    function ballFrameFunction() {
        window.ballFrame = window.setInterval(ballFrameWork, 1000/100);
        window.speedFrame = window.setInterval(speedFrameWork, 10000);
    }
    var paddleFrame = window.setInterval(paddleFrameWork, 1000/100);
});
