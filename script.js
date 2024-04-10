// @pjs preload must be used to preload the image

/* @pjs preload="bank.png"; */

var sketchProc = function (processingInstance) {
    with (processingInstance) {
        size(400, 400);
        frameRate(60);
        smooth();

        // END BOILER PLATE

        //var bankImage = loadImage("bank.png");
        //var robberImage = loadImage("robber.png");
        var img = loadImage("robot_male_1.svg");
        var robber = loadImage("robber2.png");
        var song = new Audio("scifi.mp3");
        song.loop = true;

        //var img = getImage("avatars/robot_male_1");
        var flippedimage = function (img, x, y, width, height) {
            pushMatrix();
            scale(-1.0, 1.0);
            image(img, -x, y, width, height);
            popMatrix();
        };

        var Ball = function (config) {
            this.x = config.x;
            this.y = config.y;
            this.vx = 0;
            this.vy = 0;
            this.drag = 0.07;
            this.acceleration = 0.17;
            this.ax = 0;
            this.ay = 0;
            this.gravity = 0.2;
            this.onLadder = false;
            this.width = 10;
            this.height = 10;
        };

        var keys = [];
        var Win = 0;
        var Level = function (platforms, ladders, moneys, enemies, startX, startY, endX, endY, endWidth, endHeight) {
            this.platforms = platforms;
            this.ladders = ladders;
            this.moneys = moneys;
            this.enemies = enemies;
            this.startX = startX;
            this.startY = startY;
            this.endX = endX;
            this.endY = endY;
            this.endWidth = endWidth;
            this.endHeight = endHeight;

        };
        var Button = function (config) {
            this.buttonX = config.buttonX;
            this.buttonY = config.buttonY;
            this.buttonWidth = config.buttonWidth;
            this.buttonHeight = config.buttonHeight;
            this.color1 = config.color1;
            this.color2 = config.color2;
            this.color3 = config.color3;
            this.isPlayButton = config.isPlayButton || false;
            this.isControlButton = config.isControlButton || false;
            this.isLevelButton = config.isLevelButton || false;
            this.isBackButton = config.isBackButton || false;
            this.isConfirmationButton = config.isConfirmationButton || false;
        };
        var playButton = new Button({ buttonX: 127, buttonY: 93, buttonWidth: 130, buttonHeight: 40, color1: 4, color2: 255, color3: 0, isPlayButton: true });

        var controlButton = new Button({ buttonX: 127, buttonY: 147, buttonWidth: 130, buttonHeight: 40, color1: 4, color2: 255, color3: 0, isControlButton: true });

        var levelButton = new Button({ buttonX: 127, buttonY: 199, buttonWidth: 130, buttonHeight: 40, color1: 4, color2: 255, color3: 0, isLevelButton: true });

        var backButton = new Button({ buttonX: 5, buttonY: 355, buttonWidth: 90, buttonHeight: 40, color1: 4, color2: 255, color3: 0, isBackButton: true });

        var confirmationButton = new Button({ buttonX: 127, buttonY: 198, buttonWidth: 120, buttonHeight: 40, color1: 4, color2: 255, color3: 0, isConfirmationButton: true });

        var buttons = [playButton, controlButton, levelButton, backButton, confirmationButton];
        //Platforms
        var Platform = function (config) {
            this.x = config.x;
            this.y = config.y;
            this.width = config.width;
            this.height = config.height;
            this.moveLeft = false;
            this.moveUp = false;
            this.canKill = config.canKill;
            this.canMove = config.canMove;
        };
        Platform.prototype.draw = function () {
            if (this.canKill === false) {
                fill(4, 255, 0);
                rect(this.x, this.y, this.width, this.height);
            }
            else {
                fill(255, 36, 36);
                rect(this.x, this.y, this.width, this.height);
            }
        };

        var Ladder = function (config) {
            this.x = config.x;
            this.y = config.y;
        };

        Ladder.prototype.draw = function () {
            stroke(128, 96, 74);
            strokeWeight(5);
            line(this.x, this.y - 11, this.x, this.y + 65);
            line(this.x + 30, this.y - 11, this.x + 30, this.y + 65);
            line(this.x, this.y + 60, this.x + 30, this.y + 60);
            line(this.x, this.y + 50, this.x + 30, this.y + 50);
            line(this.x, this.y + 40, this.x + 30, this.y + 40);
            line(this.x, this.y + 30, this.x + 30, this.y + 30);
            line(this.x, this.y + 20, this.x + 30, this.y + 20);
            line(this.x, this.y + 10, this.x + 30, this.y + 10);
            line(this.x, this.y, this.x + 30, this.y);
            line(this.x, this.y - 10, this.x + 30, this.y - 10);
            strokeWeight(1);
            stroke(0, 0, 0);
        };

        var Money = function (config) {
            this.x = config.x;
            this.y = config.y;
            this.radius = 10;
            this.drawn = true;
        };

        Money.prototype.draw = function () {
            if (this.drawn === true) {
                fill(234, 255, 0);
                ellipse(this.x, this.y, 20, 20);
                fill(0, 0, 0);
                text("$", this.x - 4, this.y - 4, 100, 100);
            }
        };

        var Enemy = function (config) {
            this.x = config.x;
            this.y = config.y;
            this.width = config.width;
            this.height = config.height;
            this.canMove = config.canMove;
            this.moveLeft = false;
        };
        Enemy.prototype.draw = function () {
            if (this.moveLeft === false) {
                imageMode(CENTER);
                image(img, this.x, this.y, this.width, this.height);
                imageMode(CORNER);
            }
        };
        Enemy.prototype.flip = function () {
            if (this.moveLeft === true) {
                imageMode(CENTER);
                flippedimage(img, this.x, this.y, this.width, this.height);
                imageMode(CORNER);
            }
        };

        var Platform1 = new Platform({ x: -1, y: 350, width: 405, height: 50, canKill: false });
        var Platform2 = new Platform({ x: -1, y: 275, width: 80, height: 10, canKill: false });
        var Platform3 = new Platform({ x: 111, y: 275, width: 292, height: 10, canKill: false });
        var Platform4 = new Platform({ x: -1, y: 200, width: 301, height: 10, canKill: false });
        var Platform5 = new Platform({ x: 333, y: 200, width: 80, height: 10, canKill: false });
        var Platform6 = new Platform({ x: -1, y: 125, width: 177, height: 10, canKill: false });
        var Platform7 = new Platform({ x: 208, y: 125, width: 201, height: 10, canKill: false });
        var Platform8 = new Platform({ x: -1, y: 50, width: 18, height: 10, canKill: false });
        var Platform9 = new Platform({ x: 50, y: 50, width: 302, height: 10, canKill: false });
        var Platform10 = new Platform({ x: 383, y: 50, width: 24, height: 10, canKill: false });
        var Platform11 = new Platform({ x: 258, y: -36, width: 10, height: 86, canKill: false });

        var Platform21 = new Platform({ x: -1, y: 350, width: 405, height: 50, canKill: false });
        var Platform22 = new Platform({ x: -1, y: 275, width: 13, height: 10, canKill: false });
        var Platform23 = new Platform({ x: 45, y: 275, width: 256, height: 10, canKill: false });
        var Platform24 = new Platform({ x: 333, y: 275, width: 74, height: 10, canKill: false });
        var Platform25 = new Platform({ x: -1, y: 200, width: 232, height: 10, canKill: false });
        var Platform26 = new Platform({ x: 264, y: 200, width: 149, height: 10, canKill: false });
        var Platform27 = new Platform({ x: -1, y: 125, width: 169, height: 10, canKill: false });
        var Platform28 = new Platform({ x: 200, y: 125, width: 205, height: 10, canKill: false });
        var Platform29 = new Platform({ x: -1, y: 50, width: 14, height: 10, canKill: false });
        var Platform210 = new Platform({ x: 47, y: 50, width: 310, height: 10, canKill: false });
        var Platform211 = new Platform({ x: 390, y: 50, width: 14, height: 10, canKill: false });
        var Platform212 = new Platform({ x: 65, y: 210, width: 10, height: 65, canKill: true });

        var Platform31 = new Platform({ x: -1, y: 350, width: 405, height: 50, canKill: false });
        var Platform32 = new Platform({ x: -1, y: 275, width: 121, height: 10, canKill: false });
        var Platform33 = new Platform({ x: 153, y: 275, width: 201, height: 10, canKill: false });
        var Platform34 = new Platform({ x: 386, y: 275, width: 18, height: 10, canKill: false });
        var Platform35 = new Platform({ x: -1, y: 200, width: 224, height: 10, canKill: false });
        var Platform36 = new Platform({ x: 255, y: 200, width: 45, height: 10, canKill: false });
        var Platform37 = new Platform({ x: 333, y: 200, width: 91, height: 10, canKill: false });
        var Platform38 = new Platform({ x: -1, y: 125, width: 60, height: 10, canKill: false });
        var Platform39 = new Platform({ x: 92, y: 125, width: 312, height: 10, canKill: false });
        var Platform310 = new Platform({ x: -1, y: 50, width: 217, height: 10, canKill: false });
        var Platform311 = new Platform({ x: 247, y: 50, width: 165, height: 10, canKill: false });
        var Platform312 = new Platform({ x: 268, y: 210, width: 10, height: 65, canKill: true });
        var Platform313 = new Platform({ x: 268, y: 135, width: 10, height: 65, canKill: true });

        var platforms0 = [];
        var platforms1 = [Platform1, Platform2, Platform3, Platform4, Platform5, Platform6, Platform7, Platform8, Platform9, Platform10, Platform11];
        var platforms2 = [Platform21, Platform22, Platform23, Platform24, Platform25, Platform26, Platform27, Platform28, Platform29, Platform210, Platform211, Platform212];
        var platforms3 = [Platform31, Platform32, Platform33, Platform34, Platform35, Platform36, Platform37, Platform38, Platform39, Platform310, Platform311, Platform312, Platform313];

        var Ladder1 = new Ladder({ x: 80, y: 286 });
        var Ladder2 = new Ladder({ x: 301, y: 211 });
        var Ladder3 = new Ladder({ x: 176, y: 136 });
        var Ladder4 = new Ladder({ x: 18, y: 61 });
        var Ladder5 = new Ladder({ x: 352, y: 61 });

        var Ladder21 = new Ladder({ x: 169, y: 136 });
        var Ladder22 = new Ladder({ x: 15, y: 61 });
        var Ladder23 = new Ladder({ x: 359, y: 61 });
        var Ladder24 = new Ladder({ x: 232, y: 211 });
        var Ladder25 = new Ladder({ x: 301, y: 286 });
        var Ladder26 = new Ladder({ x: 13, y: 286 });

        var Ladder31 = new Ladder({ x: 122, y: 286 });
        var Ladder32 = new Ladder({ x: 301, y: 211 });
        var Ladder33 = new Ladder({ x: 355, y: 286 });
        var Ladder34 = new Ladder({ x: 223, y: 211 });
        var Ladder35 = new Ladder({ x: 60, y: 136 });
        var Ladder36 = new Ladder({ x: 216, y: 61 });

        var ladders0 = [];
        var ladders1 = [Ladder1, Ladder2, Ladder3, Ladder4, Ladder5];
        var ladders2 = [Ladder21, Ladder22, Ladder23, Ladder24, Ladder25, Ladder26];
        var ladders3 = [Ladder31, Ladder32, Ladder33, Ladder34, Ladder35, Ladder36];

        var Money1 = new Money({ x: 188, y: 244 });
        var Money2 = new Money({ x: 20, y: 171 });
        var Money3 = new Money({ x: 309, y: 24 });

        var Money21 = new Money({ x: 27, y: 247 });
        var Money22 = new Money({ x: 200, y: 20 });
        var Money23 = new Money({ x: 95, y: 247 });

        var Money31 = new Money({ x: 24, y: 244 });
        var Money32 = new Money({ x: 363, y: 172 });
        var Money33 = new Money({ x: 74, y: 26 });

        var moneys0 = [];
        var moneys1 = [Money1, Money2, Money3];
        var moneys2 = [Money21, Money22, Money23];
        var moneys3 = [Money31, Money32, Money33];

        var Enemy1 = new Enemy({ x: 60, y: 178, width: 50, height: 50, canMove: true });
        var Enemy2 = new Enemy({ x: 260, y: 102, width: 50, height: 50, canMove: true });

        var Enemy21 = new Enemy({ x: 260, y: 28, width: 50, height: 50, canMove: true });
        var Enemy22 = new Enemy({ x: 68, y: 102, width: 50, height: 50, canMove: true });
        var Enemy23 = new Enemy({ x: 357, y: 252, width: 50, height: 50, canMove: true });

        var Enemy31 = new Enemy({ x: 77, y: 252, width: 50, height: 50, canMove: true });
        var Enemy32 = new Enemy({ x: 348, y: 176, width: 50, height: 50, canMove: true });
        var Enemy33 = new Enemy({ x: 175, y: 103, width: 50, height: 50, canMove: true });
        var Enemy34 = new Enemy({ x: 20, y: 27, width: 50, height: 50, canMove: true });

        var enemies0 = [];
        var enemies1 = [Enemy1, Enemy2];
        var enemies2 = [Enemy21, Enemy22, Enemy23];
        var enemies3 = [Enemy31, Enemy32, Enemy33, Enemy34];

        var homeScreen = new Level(platforms0, ladders0, moneys0, enemies0);
        var Controls = new Level(platforms0, ladders0, moneys0, enemies0);
        var Levels = new Level(platforms0, ladders0, moneys0, enemies0);
        var level1 = new Level(platforms1, ladders1, moneys1, enemies1, 386, 350, 61, 7, 31, 43);
        var level2Check = new Level(platforms0, ladders0, moneys0, enemies0);
        var level2 = new Level(platforms2, ladders2, moneys2, enemies2, 9, 197, 334, 157, 31, 43);
        var level3Check = new Level(platforms0, ladders0, moneys0, enemies0);
        var level3 = new Level(platforms3, ladders3, moneys3, enemies3, 9, 345, 30, 308, 31, 43);
        var level4Check = new Level(platforms0, ladders0, moneys0, enemies0);
        var level4 = new Level(platforms3, ladders3, moneys3, enemies3, 9, 23, 10, 10, 10, 10);
        var levels = [homeScreen, level1, level2Check, level2, level3Check, level3, level4, Controls, Levels];
        var currentLevel = 0;

        var blueBall = new Ball({ x: levels[currentLevel].startX, y: levels[currentLevel].startY });

        Enemy.prototype.move = function () {
            if (this.canMove === true && this.moveLeft === false) {
                this.x++;
                if (this.x > 380) {
                    this.moveLeft = true;
                }
            }
            if (this.canMove === true && this.moveLeft === true) {
                this.x--;
                if (this.x < 20) {
                    this.moveLeft = false;
                }
            }
        };
        Ladder.prototype.checkBall = function () {
            if (blueBall.x > this.x && blueBall.x < this.x + 30 && blueBall.y > this.y - 16 && blueBall.y < this.y + 60) {
                return true;
            }
            return false;
        };

        Level.applyChangeInLevels = function () {
            if (Win >= 3 && keys.includes(UP) && blueBall.x > levels[currentLevel].endX && blueBall.x < levels[currentLevel].endX + levels[currentLevel].endWidth && blueBall.y > levels[currentLevel].endY && blueBall.y < levels[currentLevel].endY + levels[currentLevel].endHeight) {
                currentLevel++;
                blueBall.x = levels[currentLevel].startX;
                blueBall.y = levels[currentLevel].startY;

                blueBall.vx = 0;
                blueBall.vy = 0;

                Win = 0;
            }
        };
        Level.drawTextAndEnd = function () {
            fill(128, 96, 74);
            rect(levels[currentLevel].endX, levels[currentLevel].endY, levels[currentLevel].endWidth, levels[currentLevel].endHeight);
            if (currentLevel === 0) {
                fill(0, 0, 0);
                textSize(32);
                text("The Escape", 109, 29, 400, 100);
                fill(0, 0, 0);
                text("Play", 162, 101, 100, 100);
                text("Controls", 131, 157, 138, 100);
                text("Levels", 146, 208, 100, 100);
                textSize(20);
                text("Made by 1145-901", 115, 364, 339, 100);
            }
            if (currentLevel === 1) {
                /*fill(234, 255, 0);
                ellipse(77, 20, 20, 20);
                fill(0, 0, 0);
                text("$", 73, 16, 100, 100);*/
                fill(255, 255, 255);
                rect(62, 8, 29, 17);
                fill(255, 0, 0);
                text("EXIT", 63, 13, 100, 100);
                fill(0, 0, 0);
                textSize(14);
                text(Win + "/3", 66, 31, 100, 100);
                textSize(12);
                text("Use Arrow Keys to Move", 294, 296, 100, 100);
                text("Remember to collect all money you see!", 84, 218, 100, 100);
                text("Watch out for guards!", 268, 147, 132, 100);
                text("Press Up to go to the next level", 101, 15, 113, 100);
            }
            if (currentLevel === 2) {
                fill(0, 0, 0);
                textSize(32);
                text("Go to Level 2?", 94, 31, 229, 100);
                text("Level 2", 136, 206, 134, 100);
            }
            if (currentLevel === 3) {
                /*fill(234, 255, 0);
                ellipse(350, 172, 20, 20);
                fill(0, 0, 0);
                text("$", 345, 167, 100, 100);*/
                fill(255, 255, 255);
                rect(335, 160, 29, 17);
                fill(255, 0, 0);
                text("EXIT", 335, 164, 100, 100);
                fill(0, 0, 0);
                textSize(14);
                text(Win + "/3", 340, 185, 100, 100);
                textSize(12);
                text("These lasers kill you!", 78, 215, 128, 100);
            }
            if (currentLevel === 4) {
                fill(0, 0, 0);
                textSize(32);
                text("Go to Level 3?", 86, 23, 229, 100);
                text("Level 3", 136, 206, 110, 100);
            }
            if (currentLevel === 5) {
                /*fill(234, 255, 0);
                ellipse(46, 322, 20, 20);
                fill(0, 0, 0);
                text("$", 42, 317, 100, 100);*/
                fill(255, 255, 255);
                rect(31, 311, 29, 17);
                fill(255, 0, 0);
                text("EXIT", 32, 315, 100, 100);
                fill(0, 0, 0);
                textSize(14);
                text(Win + "/3", 35, 336, 100, 100);
            }
            if (currentLevel === 7) {
                fill(0, 0, 0);
                textSize(32);
                text("Controls", 137, 23, 114, 100);
                textSize(20);
                text("Up Arrow - Used to jump, go up on ladders, and go in doors.", 40, 80, 339, 171);
                text("Left Arrow - Used to go left.", 40, 169, 289, 100);
                text("Right Arrow - Used to go right.", 40, 240, 329, 171);
            }
            if (currentLevel === 8) {
                fill(0, 0, 0);
                textSize(32);
                text("Levels", 147, 23, 100, 100);
            }

        };

        Level.drawImages = function () {
            if (currentLevel === 0) {
                fill(117, 88, 0);
                rect(-1, 350, 401, 50);
                fill(5, 255, 0);
                rect(-1, 345, 401, 5);
                //image(bankImage, 40, 244, 100, 100);
                //image(robberImage, 200, 250, 90, 90);
            }
        };
        Button.prototype.draw = function () {
            fill(this.color1, this.color2, this.color3);
            rect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
            fill(0, 0, 0);
            textSize(32);
            text("Back", 13, 362, 100, 100);
            textSize(12);
            if (mouseX > this.buttonX && mouseX < this.buttonX + this.buttonWidth && mouseY > this.buttonY && mouseY < this.buttonY + this.buttonHeight) {
                this.color1 = 37;
                this.color2 = 130;
            }
            else {
                this.color1 = 4;
                this.color2 = 255;
            }
        };
        Button.prototype.applyMouse = function () {
            var level = levels[currentLevel];
            var moneys = level.moneys;
            if (mouseX > this.buttonX && mouseX < this.buttonX + this.buttonWidth && mouseY > this.buttonY && mouseY < this.buttonY + this.buttonHeight) {
                if (currentLevel === 0) {
                    if (this.isPlayButton === true) {
                        song.play();
                        currentLevel = 1;
                        blueBall.x = levels[currentLevel].startX;
                        blueBall.y = levels[currentLevel].startY;
                    }
                    if (this.isControlButton === true) {
                        currentLevel = 7;
                        blueBall.x = levels[currentLevel].startX;
                        blueBall.y = levels[currentLevel].startY;
                    }
                    if (this.isLevelButton === true) {
                        currentLevel = 8;
                        blueBall.x = levels[currentLevel].startX;
                        blueBall.y = levels[currentLevel].startY;
                    }
                }
                if (currentLevel > 0) {
                    if (this.isBackButton === true) {
                        currentLevel = 0;
                        Win = 0;
                        for (var i = 0; i < moneys.length; i++) {
                            moneys[i].drawn = true;
                        }
                    }
                }
                if (currentLevel === 2 || currentLevel === 4) {
                    if (this.isConfirmationButton === true) {
                        currentLevel++;
                        blueBall.x = levels[currentLevel].startX;
                        blueBall.y = levels[currentLevel].startY;
                    }
                }
            }
        };

        Platform.prototype.applyMovement = function () {
            if (this.canMove === true) {
                if (this.moveLeft === true) {
                    this.x--;
                    if (blueBall.y > this.y - 5 && blueBall.y < this.y + 1 && blueBall.x > this.x && blueBall.x < this.x + this.width) {
                        blueBall.x--;
                    }
                }
                else {
                    this.x++;
                    if (blueBall.y > this.y - 5 && blueBall.y < this.y + 1 && blueBall.x > this.x && blueBall.x < this.x + this.width) {
                        blueBall.x++;
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
        Ball.prototype.applyIntersect = function (platform) {
            var level = levels[currentLevel];
            var moneys = level.moneys;
            if (platform.canKill === false && this.y > platform.y - this.height * 1 / 2 && this.y < platform.y + 1 && this.x > platform.x && this.x < platform.x + platform.width) {
                this.y = platform.y - this.height * 1 / 2;
                this.vy = 0;
            }

            if (platform.canKill === true && this.y > platform.y - this.height * 1 / 2 && this.y < platform.y + 1 && this.x > platform.x && this.x < platform.x + platform.width) {
                this.x = levels[currentLevel].startX;
                this.y = levels[currentLevel].startY;
                this.vx = 0;
                this.vy = 0;
                Win = 0;
                for (var i = 0; i < moneys.length; i++) {
                    moneys[i].drawn = true;
                }
            }
            if (platform.canKill === false && this.y > platform.y && this.y < platform.y + platform.height && this.x > platform.x - this.width * 1 / 2 && this.x < platform.x + 1) {
                this.x = platform.x - this.width * 1 / 2;
                this.vx = 0;
            }

            if (platform.canKill === true && this.y > platform.y && this.y < platform.y + platform.height && this.x > platform.x - this.width * 1 / 2 && this.x < platform.x + 1) {
                this.x = levels[currentLevel].startX;
                this.y = levels[currentLevel].startY;
                this.vx = 0;
                this.vy = 0;
                Win = 0;
                for (var i = 0; i < moneys.length; i++) {
                    moneys[i].drawn = true;
                }
            }

            if (platform.canKill === false && this.y > platform.y && this.y < platform.y + platform.height && this.x < platform.x + platform.width + this.width * 1 / 2 && this.x > platform.x + platform.width - 1) {
                this.x = platform.x + platform.width + this.width * 1 / 2;
                this.vx = 0;
            }

            if (platform.canKill === true && this.y > platform.y && this.y < platform.y + platform.height && this.x < platform.x + platform.width + this.width * 1 / 2 && this.x > platform.x + platform.width - 1) {
                this.x = levels[currentLevel].startX;
                this.y = levels[currentLevel].startY;
                this.vx = 0;
                this.vy = 0;
                Win = 0;
                for (var i = 0; i < moneys.length; i++) {
                    moneys[i].drawn = true;
                }
            }

            if (platform.canKill === false && this.x > platform.x && this.x < platform.x + platform.width && this.y < platform.y + platform.height + this.height * 1 / 2 && this.y > platform.y + platform.height - 1) {
                this.y = platform.y + platform.height + this.height * 1 / 2;
                this.vy = 0;
            }

            if (platform.canKill === true && this.x > platform.x && this.x < platform.x + platform.width && this.y < platform.y + platform.height + this.height * 1 / 2 && this.y > platform.y + platform.height - 1) {
                this.x = levels[currentLevel].startX;
                this.y = levels[currentLevel].startY;
                this.vx = 0;
                this.vy = 0;
                Win = 0;
                for (var i = 0; i < moneys.length; i++) {
                    moneys[i].drawn = true;
                }
            }
        };
        Ball.prototype.applyIntersect2 = function (money) {
            if (money.drawn === true && this.y + this.height * 1 / 2 > money.y - 5 && this.y - this.height * 1 / 2 < money.y + 5 && this.x + this.width * 1 / 2 > money.x - money.radius && this.x - this.width * 1 / 2 < money.x + money.radius) {
                Win++;
                money.drawn = false;
            }
        };
        Ball.prototype.applyIntersect3 = function (enemy) {
            var level = levels[currentLevel];
            var moneys = level.moneys;
            if (this.y + this.height * 1 / 2 > enemy.y - enemy.height * 1 / 2 && this.y - this.height * 1 / 2 < enemy.y + enemy.height * 1 / 2 && this.x + this.width * 1 / 2 > enemy.x - enemy.width * 1 / 2 && this.x - this.width * 1 / 2 < enemy.x + enemy.width * 1 / 2) {
                this.x = levels[currentLevel].startX;
                this.y = levels[currentLevel].startY;
                this.vx = 0;
                this.vy = 0;
                Win = 0;
                for (var i = 0; i < moneys.length; i++) {
                    moneys[i].drawn = true;
                }
            }
        };
        //Movement
        Ball.prototype.applyUserInput = function (platforms) {

            if (keys.includes(RIGHT)) {
                this.ax = this.acceleration;
            }
            else if (keys.includes(LEFT)) {
                this.ax = -this.acceleration;
            }
            else {
                this.ax = 0;
            }
            var onPlatform = false;
            for (var i = 0; i < platforms.length; i++) {
                if (this.y === platforms[i].y - this.height * 1 / 2 && this.x > platforms[i].x && this.x < platforms[i].x + platforms[i].width) {
                    onPlatform = true;
                }
            }
            if (this.onLadder === true) {
                this.vy = 0;
                if (keys.includes(UP)) {
                    this.vy = -2;
                }
                if (keys.includes(DOWN)) {
                    this.vy = 2;
                }
            }
            if (onPlatform === true) {
                if (keys.includes(UP)) {
                    this.ay = -6;
                }
            }
            else {
                this.ay = 0;
            }
        };
        Ball.prototype.applyBorders = function () {
            if (this.x < this.width * 1 / 2) {
                this.x = this.width * 1 / 2;
                this.vx = 0;
            }
            if (this.x > 400 - this.width * 1 / 2) {
                this.x = 400 - this.width * 1 / 2;
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
        Ball.prototype.applyGravity = function () {
            if (this.onLadder === false) {
                this.vy += this.gravity;
            }
        };
        Ball.prototype.applyVelocity = function () {
            this.x += this.vx;
            this.y += this.vy;
        };
        Ball.prototype.applyAcceleration = function () {
            this.vx += this.ax;
            this.vy += this.ay;
        };
        Ball.prototype.applyDrag = function () {
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

        Ball.prototype.draw = function () {
            fill(0, 98, 255);
            /*if (currentLevel > 0) {
                imageMode(CENTER);
                image(robber, this.x, this.y, 200, 50);
                imageMode(CORNER);*/
            ellipse(this.x, this.y, 10, 10);
            //}
        };
        /*Ball.prototype.flip = function () {
            imageMode(CENTER);
            flippedimage(robber, this.x, this.y, 200, 50);
            imageMode(CORNER);
        };*/

        draw = function () {

            var level = levels[currentLevel];
            var platforms = level.platforms;
            var ladders = level.ladders;
            var moneys = level.moneys;
            var enemies = level.enemies;
            var onLadder = false;

            for (var i = 0; i < ladders.length; i++) {
                if (ladders[i].checkBall()) {
                    onLadder = true;
                }
            }
            blueBall.onLadder = onLadder;

            for (var i = 0; i < platforms.length; i++) {
                blueBall.applyIntersect(platforms[i]);
            }
            for (var i = 0; i < moneys.length; i++) {
                blueBall.applyIntersect2(moneys[i]);
            }
            for (var i = 0; i < enemies.length; i++) {
                blueBall.applyIntersect3(enemies[i]);
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
            for (var i = 0; i < enemies.length; i++) {
                enemies[i].move();
            }

            background(110, 115, 255);
            //Song.play();
            if (currentLevel === 0) {
                playButton.draw();
                controlButton.draw();
                levelButton.draw();
            }
            if (currentLevel === 2 || currentLevel === 4) {
                confirmationButton.draw();
            }
            Level.drawImages();
            Level.drawTextAndEnd();
            Level.applyChangeInLevels();
            for (var i = 0; i < platforms.length; i++) {
                platforms[i].draw();
            }
            if (currentLevel > 0) {
                backButton.draw();
            }
            for (var i = 0; i < ladders.length; i++) {
                ladders[i].draw();
            }
            for (var i = 0; i < moneys.length; i++) {
                moneys[i].draw();
            }
            for (var i = 0; i < enemies.length; i++) {
                enemies[i].draw();
            }
            for (var i = 0; i < enemies.length; i++) {
                enemies[i].flip();
            }
            //if (keys.includes(LEFT)) {
            blueBall.draw();
            /*}
            else {
            blueBall.flip();
            }*/
        };

        mousePressed = function () {
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].applyMouse();
            }
        };
        keyPressed = function () {
            if (keys.includes(keyCode)) {

            }
            else {
                keys.push(keyCode);
            }
        };

        keyReleased = function () {
            keys.splice(keys.indexOf(keyCode), 1);

        };


        // START BOILER PLATE

    }
}

var canvas = document.getElementById("canvas");
var processingInstance = new Processing(canvas, sketchProc);
