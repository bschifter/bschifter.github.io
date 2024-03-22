// @pjs preload must be used to preload the image

/* @pjs preload="bank.png"; */

var sketchProc = function (processingInstance) {
    with (processingInstance) {
        size(400, 400);
        frameRate(60);
        smooth();

        // END BOILER PLATE
       
        var bankImage = loadImage("bank.png");
        var robberImage = loadImage("robber.png");

        var Ball = function(config){
            this.x = config.x;
            this.y = config.y;
            this.vx = 0;
            this.vy = 0;
            this.drag = 0.07;
            this.acceleration = 0.17;
            this.ax = 0;
            this.ay = 0;
            this.gravity = 0.2;
        };
        
        var keys = [];
        var Level = function(platforms, startX, startY, endX, endY, endWidth, endHeight) {
            this.platforms = platforms;
            this.startX = startX;
            this.startY = startY;
            this.endX = endX;
            this.endY = endY;
            this.endWidth = endWidth;
            this.endHeight = endHeight;
            
        };
        var Button = function(config) {
            this.buttonX = config.buttonX;
            this.buttonY = config.buttonY;
            this.buttonWidth = config.buttonWidth;
            this.buttonHeight = config.buttonHeight;
            this.color1 = config.color1;
            this.color2 = config.color2;
            this.color3 = config.color3;
        };
        var playButton = new Button({buttonX: 127, buttonY: 93, buttonWidth: 120, buttonHeight: 40, color1: 4, color2: 255, color3: 0});
        
        var controlButton = new Button({buttonX: 127, buttonY: 147, buttonWidth: 120, buttonHeight: 40, color1: 4, color2: 255, color3: 0});
        
        var settingButton = new Button({buttonX: 127, buttonY: 199, buttonWidth: 120, buttonHeight: 40, color1: 4, color2: 255, color3: 0});
        
        var buttons = [playButton, controlButton, settingButton];
        //Platforms
        var Platform = function(config) {
            this.x = config.x;
            this.y = config.y;
            this.width = config.width;
            this.height = config.height;
            this.moveLeft = false;
            this.moveUp = false;
            this.canKill = config.canKill;
            this.canMove = config.canMove;
        };
        Platform.prototype.draw = function() {
            if (this.canKill === false) {
                fill(4, 255, 0);
                rect(this.x, this.y, this.width, this.height);
            }
            else {
                fill(255, 36, 36);
                rect(this.x, this.y, this.width, this.height);
            }
        };
        
        var Platform1 = new Platform({x: 100, y: 100, width: 100, height: 100});
        var platforms0 = [];
        var platforms1 = [Platform1];    
        var platforms2 = [];   
        var platforms3 = [];
        
        var homeScreen = new Level(platforms0, 1, 1);
        var level1 = new Level(platforms1, 10, 340, 323, 35, 37, 37);
        var level2 = new Level(platforms2, 10, 340, 33, 25, 10, 10);
        var level3 = new Level(platforms3, 10, 380, 10, 10, 10, 10);
        var levels = [homeScreen, level1, level2, level3];
        var currentLevel = 0;
        
        var blueBall = new Ball ({x: levels[currentLevel].startX, y: levels[currentLevel].startY});
        
        Level.applyChangeInLevels = function() {
            if (blueBall.x > levels[currentLevel].endX && blueBall.x < levels[currentLevel].endX + levels[currentLevel].endWidth && blueBall.y > levels[currentLevel].endY && blueBall.y < levels[currentLevel].endY + levels[currentLevel].endHeight) {
                    currentLevel ++;
                    blueBall.x = levels[currentLevel].startX;
                    blueBall.y = levels[currentLevel].startY;
                    
                    blueBall.vx = 0;
                    blueBall.vy = 0;
                }
        };
        Level.drawTextAndEnd = function() {
            fill(128, 96, 74);
            rect(levels[currentLevel].endX, levels[currentLevel].endY, levels[currentLevel].endWidth, levels[currentLevel].endHeight);
            if (currentLevel === 0) {
                fill(0, 0, 0);
                textSize(32);
                text("The Escape", 109, 29, 400, 100);
                fill(0, 0, 0);
                text("Play", 156, 100, 100, 100);
                textSize(20);
                text("Made by 1145-901", 115, 364, 339, 100);
            }
            if (currentLevel === 1) {
            
            }
            if (currentLevel === 2) {
                
            }
        
        };
        
        Level.drawImages = function() {
            if (currentLevel === 0) {
            fill(117, 88, 0);
            rect(-1, 350, 401, 50);
            fill(5, 255, 0);
            rect (-1, 345, 401, 5);
            image(bankImage, 40, 244, 100, 100);
            image(robberImage, 200, 250, 90, 90);
            }
        };
        Button.prototype.draw = function() {
            if(currentLevel === 0) {
                fill(this.color1, this.color2, this.color3);
                rect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
                if (currentLevel === 0 && mouseX > this.buttonX && mouseX < this.buttonX + this.buttonWidth && mouseY > this.buttonY && mouseY < this.buttonY + this.buttonHeight) {
                this.color1 = 37;
                this.color2 = 130;
                }
                else {
                    this.color1 = 4;
                    this.color2 = 255;
                }
            }
            
        };
        
        Button.prototype.applyMouse = function() {
            if (currentLevel === 0 && mouseX > this.buttonX && mouseX < this.buttonX + this.buttonWidth && mouseY > this.buttonY && mouseY < this.buttonY + this.buttonHeight) {
                currentLevel = 1;
                blueBall.x = levels[currentLevel].startX;
                blueBall.y = levels[currentLevel].startY;
            }
        };
        
        Platform.prototype.applyMovement = function() {
            if (this.canMove === true) {
                if (this.moveLeft === true) {
                    this.x --;
                    if (blueBall.y > this.y - 5 && blueBall.y < this.y + 1 && blueBall.x > this.x &&             blueBall.x < this.x + this.width) {
                        blueBall.x --;
                    }
                }
                else {
                    this.x ++;
                    if (blueBall.y > this.y - 5 && blueBall.y < this.y + 1 && blueBall.x > this.x &&             blueBall.x < this.x + this.width) {
                        blueBall.x ++;
                    }
                }
                if (this.x + this.width > 400) {
                    this.moveLeft = true;
                }
                    if (this.x < 0) {
                        this.moveLeft = false;
                    }
            }
            
        };
        Ball.prototype.applyIntersect = function(platform) {
            if (platform.canKill === false && this.y > platform.y - 5 && this.y < platform.y + 1 && this.x > platform.x && this.x < platform.x + platform.width) {
                this.y = platform.y - 5;
                this.vy = 0;
            } 
            
            if (platform.canKill === true && this.y > platform.y - 5 && this.y < platform.y + 1 && this.x > platform.x && this.x < platform.x + platform.width) {
                this.x = levels[currentLevel].startX;
                this.y = levels[currentLevel].startY;
                this.vx = 0;
                this.vy = 0;
                
            } 
            if (platform.canKill === false && this.y > platform.y && this.y < platform.y + platform.height && this.x > platform.x - 5 && this.x < platform.x + 1) {
                    this.x = platform.x - 5;
                    this.vx = 0;
                }
                
            if (platform.canKill === true && this.y > platform.y && this.y < platform.y + platform.height && this.x > platform.x - 5 && this.x < platform.x + 1) {
                    this.x = levels[currentLevel].startX;
                    this.y = levels[currentLevel].startY;
                    this.vx = 0;
                    this.vy = 0;
                }
                
            if (platform.canKill === false && this.y > platform.y && this.y < platform.y + platform.height && this.x < platform.x + platform.width + 5 && this.x > platform.x + platform.width - 1) {
                    this.x = platform.x + platform.width + 5;
                    this.vx = 0;
                }
                
            if (platform.canKill === true && this.y > platform.y && this.y < platform.y + platform.height && this.x < platform.x + platform.width + 5 && this.x > platform.x + platform.width - 1) {
                    this.x = levels[currentLevel].startX;
                    this.y = levels[currentLevel].startY;
                    this.vx = 0;
                    this.vy = 0;
                }
                
            if (platform.canKill === false && this.x > platform.x && this.x < platform.x + platform.width && this.y < platform.y + platform.height + 5 && this.y > platform.y + platform.height - 1) {
                this.y = platform.y + platform.height + 5;
                this.vy = 0;
            }
            
            if (platform.canKill === true && this.x > platform.x && this.x < platform.x + platform.width && this.y < platform.y + platform.height + 5 && this.y > platform.y + platform.height - 1) {
                this.x = levels[currentLevel].startX;
                this.y = levels[currentLevel].startY;
                this.vx = 0;
                this.vy = 0;
                
            }
        };
        //Movement
        Ball.prototype.applyUserInput = function(platforms) {
            
            if (keys.includes(RIGHT)) {
                
                this.ax = this.acceleration;
            }
            else if (keys.includes(LEFT)) {
                    this.ax = -this.acceleration;
                }
            else  {
                this.ax = 0;
                }
                var intersect = false;
            for (var i = 0; i < platforms.length; i++){
                if (keys.includes(UP) && this.y === platforms[i].y - 5 && this.x > platforms[i].x &&           this.x < platforms[i].x + platforms[i].width) {
                    intersect = true;
                    
                }
                if(intersect === true){
                    this.ay = -6;  
                }
                else {
                    this.ay = 0;
                }
            }
        };
        Ball.prototype.applyBorders = function() {
            if (this.x < 5) {
                this.x = 5;
                this.vx = 0;
            }
            if (this.x > 395) {
                this.x = 395;
                this.vx = 0;
            }
            if (this.y > 400) {
                fill(0, 0, 0);
                this.x = levels[currentLevel].startX;
                this.y = levels[currentLevel].startY;
                this.vy = 0;
                this.vx = 0;
            }
        };
        //Applying Velocity and Drag
        Ball.prototype.applyGravity = function() {
            this.vy += this.gravity;
        };
        Ball.prototype.applyVelocity = function() {
            this.x += this.vx;
            this.y += this.vy;
        };
        Ball.prototype.applyAcceleration = function() {
            this.vx += this.ax;
            this.vy += this.ay;
        };
        Ball.prototype.applyDrag = function() {
            if (this.vx > 0) {
                if (this.vx < this.drag) {
                    this.vx = 0;
                } else {
                this.vx -= this.drag;
                }
            }
            if (this.vx < 0) {
                if (this.vx > this.drag) {
                    this.vx = 0;
                } else {
                this.vx += this.drag;
                }
            }
            if (this.vy > 0) {
                if (this.vy < this.drag) {
                    this.vy = 0;
                } else {
                this.vy -= this.drag;
                }
            }
            if (this.vy < 0) {
                if (this.vy > this.drag) {
                    this.vy = 0;
                } else {
                this.vy += this.drag;
                }
            }
        };
        Ball.prototype.draw = function() {
            fill(0, 98, 255);
            if (currentLevel > 0) {
                image(robberImage, this.x, this.y, 50, 50);
            }
        };
        
        draw = function() {
            
            var level = levels[currentLevel];
            var platforms = level.platforms;
            
            for (var i = 0; i < platforms.length; i++) {
                blueBall.applyIntersect(platforms[i]);
            }
            
            blueBall.applyUserInput(platforms);
            blueBall.applyBorders();
            blueBall.applyGravity();
            blueBall.applyAcceleration();
            blueBall.applyDrag();
            blueBall.applyVelocity();
            for (var i = 0; i < platforms.length; i++) {
                platforms[i].applyMovement();
            }
            
            background(110, 115, 255);
            playButton.draw();
            controlButton.draw();
            settingButton.draw();
            Level.drawImages();
            Level.drawTextAndEnd();
            blueBall.draw();
            Level.applyChangeInLevels();
            for (var i = 0; i < platforms.length; i++) {
                platforms[i].draw();
            }
        };
        
        mousePressed = function() {
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].applyMouse();
            }
        };
        keyPressed = function() {
            if (keys.includes(keyCode)) {
                
            }
            else {
            keys.push(keyCode);
            }
        };
        
        keyReleased = function() {
            keys.splice(keys.indexOf(keyCode), 1);
            
        };
        

        // START BOILER PLATE

    }
}

var canvas = document.getElementById("canvas");
var processingInstance = new Processing(canvas, sketchProc);
