
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('tire', './assets/tire.png');
        this.load.image('boat', './assets/boat.png');
        this.load.image('wire', './assets/wire.png');
        this.load.image('hook', './assets/hook.png');
        this.load.image('beer', './assets/beer.png');
        this.load.image('blueSeaweed', './assets/blueSeaweed.png');
        this.load.image('bubble', './assets/bubble.png');
        this.load.image('cloudMid', './assets/cloudMid.png');
        this.load.image('cloudTop', './assets/cloudTop.png');
        this.load.image('deepShip', './assets/deepShip.png');
        this.load.image('fishNet', './assets/fishNet.png');
        this.load.image('leftFish', './assets/leftFish.png');
        this.load.image('rightFish', './assets/rightFish.png');
        this.load.image('sand1', './assets/sand1.png');
        this.load.image('skyMid', './assets/skyMid.png');
        this.load.image('skyTop', './assets/skyTop.png');
        this.load.image('smallStone', './assets/smallStone.png');
        this.load.image('waterBase', './assets/waterBase.png');
        this.load.image('waves', './assets/waves.png');
        this.load.image('UInew', './assets/UInew.png');
        this.load.audio('choco','./assets/chocobirdsrun.mp3');


 
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9 });
        this.load.spritesheet('player', './assets/player.png', { frameWidth: 63, frameHeight: 32, startFrame: 0, endFrame: 7 });
    }

    create() {

        this.bgm = this.sound.add('choco',{
            mute : false,
            volume : 0.5,
            rate : 3,
            loop : true
        });

        this.sound.play('choco');

        // place tile sprite
        this.sand1 = this.add.tileSprite(0, 0, 640, 480, 'sand1').
        setOrigin(0, 0);
        this.sand1.setDepth(1500);

        this.blueSeaweed = this.add.tileSprite(0, 0, 640, 480, 'blueSeaweed').
        setOrigin(0, 0);
        this.blueSeaweed.setDepth(1600);

        this.smallStone = this.add.tileSprite(0, 0, 640, 480, 'smallStone').
        setOrigin(0, 0);
        this.smallStone.setDepth(1450);


        this.deepShip = this.add.tileSprite(0, 0, 640, 480, 'deepShip').
        setOrigin(0, 0);
        this.deepShip.setDepth(1400);

        //鱼线
        this.wire = new Fishwire(this, 600, -90, 'wire').setOrigin(this.x, this.y);
        this.wire.setDepth(3800);

        this.waterBase = this.add.tileSprite(0, 0, 640, 480, 'waterBase').
        setOrigin(0, 0);
        this.waterBase.setDepth(1000);
        

        this.bubble = this.add.tileSprite(0, 0, 640, 480, 'bubble').
        setOrigin(0, 0);
        this.bubble.setDepth(2000);

        

        this.leftFish = this.add.tileSprite(0, 0, 640, 480, 'leftFish').
        setOrigin(0, 0);
        this.leftFish.setDepth(2050);

        

        this.rightFish = this.add.tileSprite(0, 0, 640, 480, 'rightFish').
        setOrigin(0, 0);
        this.rightFish.setDepth(2060);

        

        this.skyTop = this.add.tileSprite(0, 0, 640, 480, 'skyTop').
        setOrigin(0, 0);
        this.skyTop.setDepth(4000);

        

        this.skyMid = this.add.tileSprite(0, 0, 640, 480, 'skyMid').
        setOrigin(0, 0);
        this.skyMid.setDepth(3700);

        this.waves = this.add.tileSprite(0, 0, 640, 480, 'waves').
        setOrigin(0, 0);
        this.waves.setDepth(3790);

        this.cloudMid = this.add.tileSprite(0, 0, 640, 480, 'cloudMid').
        setOrigin(0, 0);
        this.cloudMid.setDepth(4300);
        
        this.cloudTop = this.add.tileSprite(0, 0, 640, 480, 'cloudTop').
        setOrigin(0, 0);
        this.cloudTop.setDepth(4200);

        this.UInew = this.add.tileSprite(-60, 0, 640, 480, 'UInew').setScale(1.2,1.5).
        setOrigin(0, 0);
        this.UInew.setDepth(5000);



        // add fish (p1)
        this.p1Fish = new Fish(this, game.config.width / 2 - 8, 350, 'player').setOrigin(0, 0);
        this.anims.create({
            key: 'p1Moving',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 7, first: 0}),
            frameRate: 6
        });
        this.p1Fish.setDepth(99999);

        // add obstacles (x4)
        this.tire1 = new Obstacle(this, 12000, 132, 'tire').setOrigin(0, 0);
        this.beer1 = new Obstacle(this, 8000, 196, 'beer').setOrigin(0, 0);
        this.fishNet = new Obstacle(this, 5000, 260, 'fishNet').setOrigin(0, 0);
        this.beer2 = new Obstacle(this, game.config.width - 96, 340, 'beer').setOrigin(0, 0);
        this.tire2 = new Obstacle(this, game.config.width, 190, 'tire').setOrigin(0, 0);
        

        this.tire1.setDepth(99999);
        this.beer1.setDepth(99999);
        this.fishNet.setDepth(99999);
        this.beer2.setDepth(99999);
        this.tire2.setDepth(99999);

        //船的运动
        this.boat = new Fishship(this, 550, 70, 'boat').setOrigin(0, 0);
        this.boat.setDepth(99999);
        //鱼钩
        this.hook = new Fishhook(this, 595, 140, 'hook').setOrigin(0, 0);
        this.hook.setDepth(99999);

        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0 }),
            frameRate: 30
        });

        //score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.p1Score = 0;
        
        var timedEvent;
        // 每1000ms使用onEvent()一次
        timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true});
        this.scoreLeft = this.add.text(199, 37, this.p1Score, scoreConfig);
        this.scoreLeft.setDepth(99999);

        //typeface for ending
        let endConfig = {
            fontFamily: 'fantasy',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#000000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        //game over flag
        this.gameOver = false;

        this.time.paused = false;

        this.add.text(game.config.width / 2 + 65, game.config.height / 2 - 182, 'LEVEL1', endConfig).setOrigin(0.5).setDepth(99999);

        //四段加速
        endConfig.fixedWidth = 0;

        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2 + 65, game.config.height / 2 - 182, 'LEVEL2', endConfig).setOrigin(0.5).setDepth(99999);
            game.settings = {
                fishSpeed: game.settings.fishSpeed + 1.5,
            }
        }, null, this);

        this.clock = this.time.delayedCall(game.settings.gameTimer + 30000, () => {
            this.add.text(game.config.width / 2 + 65, game.config.height / 2 - 182, 'LEVEL3', endConfig).setOrigin(0.5).setDepth(99999);
            game.settings = {
                fishSpeed: game.settings.fishSpeed + 2.5,
            }
        }, null, this);

        this.clock = this.time.delayedCall(game.settings.gameTimer + 60000, () => {
            this.add.text(game.config.width / 2 + 65, game.config.height / 2 - 182, 'LEVEL4', endConfig).setOrigin(0.5).setDepth(99999);
            game.settings = {
                fishSpeed: game.settings.fishSpeed + 3.5,
            }
        }, null, this);

        this.clock = this.time.delayedCall(game.settings.gameTimer + 90000, () => {
            this.add.text(game.config.width / 2 + 65, game.config.height / 2 - 182, 'LEVEL5', endConfig).setOrigin(0.5).setDepth(99999);
            game.settings = {
                fishSpeed: game.settings.fishSpeed + 4.5,
            }
        }, null, this);

    }

    update() {

        this.p1Fish.play('p1Moving',true);
        // check key input for restart / menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
            game.sound.stopAll();
            
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
            game.sound.stopAll();
        }

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // 当玩家爆炸，游戏结束
        if (this.gameOver) {
            //this.p1Score = -1; // 重置score为0（这边用-1是因为每1s刷新一次）
            this.time.paused = true;
            game.settings.fishSpeed = 2;
            game.settings.gameTimer = 30000;
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5).setDepth(99999);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press R to Restart or ← for Menu', scoreConfig).setOrigin(0.5).setDepth(99999);
        }

        //scroll background
        if (!this.gameOver) {
        this.sand1.tilePositionX += 1  ;
        this.blueSeaweed.tilePositionX += 1.5;
        this.smallStone.tilePositionX += 1.1;
        this.deepShip.tilePositionX += 0.7;

        this.leftFish.tilePositionX += 1.3;
        this.rightFish.tilePositionX -= 0.5;

        this.bubble.tilePositionX += 0.7;
        this.bubble.tilePositionY += 0.7;

        this.cloudTop.tilePositionX += 0.8;
        this.cloudMid.tilePositionX += 1;
        }

      

        if (!this.gameOver) {
            this.p1Fish.update();         // update player sprite
            this.tire1.update();           // update obstacles
            this.beer1.update();
            this.fishNet.update();
            this.beer2.update();
            this.boat.update();
            this.wire.update();
            this.hook.update();
            this.tire2.update();

        }
        // check collisions
        if (this.checkCollision(this.p1Fish, this.tire2)) {
            this.shipExplode(this.tire2); 
            this.fishExplode(this.p1Fish.x, this.p1Fish.y);
        }
        if (this.checkCollision(this.p1Fish, this.hook)) {
            this.shipExplode(this.hook); 
            this.fishExplode(this.p1Fish.x, this.p1Fish.y);
        }
        if (this.checkCollision(this.p1Fish, this.beer2)) {
            this.shipExplode(this.beer2); 
            this.fishExplode(this.p1Fish.x, this.p1Fish.y);
        }
        if (this.checkCollision(this.p1Fish, this.fishNet)) {
            this.shipExplode(this.fishNet); 
            this.fishExplode(this.p1Fish.x, this.p1Fish.y);
        }
        if (this.checkCollision(this.p1Fish, this.beer1)) {
            this.shipExplode(this.beer1);
            this.fishExplode(this.p1Fish.x, this.p1Fish.y);
        }
        if (this.checkCollision(this.p1Fish, this.tire1)) {
            this.shipExplode(this.tire1);
            this.fishExplode(this.p1Fish.x, this.p1Fish.y);
        }
    }

    checkCollision(fish, obstacle) {
        // simple AABB checking
        if (fish.x < obstacle.x + obstacle.width &&
            fish.x + fish.width > obstacle.x &&
            fish.y < obstacle.y + obstacle.height &&
            fish.height + fish.y > obstacle.y) {
            return true;
        } else {
            return false;
        }
    }


    // 玩家爆炸
    fishExplode(x, y) {
        this.p1Fish.alpha = 0;
        this.p1Fish.reset();

        let boom = this.add.sprite(x, y, 'explosion').setOrigin(0, 0);

        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            boom.destroy();
            this.gameOver = true;

        });
        this.sound.play('sfx_explosion');
    }
    
    //障碍物爆炸
    shipExplode(obstacle){

        //temporarily hide obstacle
        obstacle.alpha = 0;
        obstacle.reset();
    }


    // change score
    onEvent(){
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        if(!this.gameOver) {
            this.p1Score += 1; // 每次使用该function的时候， p1score + 1
        }
        this.scoreLeft = this.add.text(199, 37, this.p1Score, scoreConfig);
        this.scoreLeft.setDepth(99999);
    }
}