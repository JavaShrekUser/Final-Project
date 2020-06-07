class Level1 extends Phaser.Scene {
    constructor() {
        super("level1Scene");
    }

    preload(){
        //preload assets
        this.load.image('bg3', './assets/Level1/Level1-2.png');
        this.load.image('door1','./assets/Level1/door1.png');
        this.load.audio('choco','./assets/sound/BGM.mp3');
        this.load.audio('walk', './assets/sound/Walk.mp3');
        this.load.audio('jump', './assets/sound/Jump.mp3');
        this.load.audio('levelup', './assets/sound/LevelUp.mp3');
        this.load.audio('bounce', './assets/sound/Bounce.mp3');
        this.load.audio('door', './assets/sound/DoorOpen.mp3');
        this.load.image("1bit_tiles", "./assets/MainTiledSet.png");
        this.load.tilemapTiledJSON('platform_map', './assets/Level1/Level1Map.json');
        this.load.spritesheet('black', './assets/Level1/black.png', { frameWidth: 20, frameHeight: 50, startFrame: 0, endFrame: 11 });
        this.load.spritesheet('walkTuition', './assets/tutorial/walkTuition.png', { frameWidth: 640, frameHeight: 480, startFrame: 0, endFrame: 3 });
        this.load.spritesheet('jumpTuition', './assets/tutorial/jumpTuition.png', { frameWidth: 640, frameHeight: 480, startFrame: 0, endFrame: 3 });
        this.load.path = './assets/';
        this.load.image('cross', 'white_pixel.png');
    }

    create() {

        this.bgm = this.sound.add('choco',{     //add background music
            mute : false,
            volume : 0.3,
            rate : 1,
            loop : true
        });

        this.bgm.play();

        // add a tilemap
        const map = this.add.tilemap("platform_map");

        // add a tileset to the map
        const tileset = map.addTilesetImage("MainTiledSet", "1bit_tiles");

        // create tilemap layers
        const platforms = map.createStaticLayer("Platforms", tileset, 0, 0);

        platforms.setCollisionByProperty({ collides: true });

        // variables and settings
        this.ACCELERATION = 650;
        this.MAX_X_VEL = 220;   // pixels/second
        this.MAX_Y_VEL = 700;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.JUMP_VELOCITY = -750;
        this.physics.world.gravity.y = 3000;

        // set bg
        this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg1').setOrigin(0, 0);

        // print Scene name
        this.add.text(game.config.width / 2, 30, 'level1', { font: '14px Futura', fill: '#32CD32' }).setOrigin(0.5).setDepth(99998);

        // set up robot
        this.robot = this.physics.add.sprite(100, 350, 'player').setOrigin(0);
        this.anims.create({
            key: 'Moving',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 3, first: 0}),
            frameRate: 6
        });
        this.anims.create({
            key: 'Moving2',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player1', {start: 0, end: 3, first: 0}),
            frameRate: 6
        });
        
        this.robot.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.robot.setCollideWorldBounds(true);
        this.robot.setDepth(99998);
        
        //tutorial
        this.walkTuition = new Door(this, 0, 0, 'walkTuition').setOrigin(0, 0);
        this.anims.create({
            key: 'walkTuition',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('walkTuition', {start: 0, end: 3, first: 0}),
            frameRate: 3
        });
        this.walkTuition.setDepth(99999);

        this.jumpTuition = new Door(this, 0, 0, 'jumpTuition').setOrigin(0, 0);
        this.anims.create({
            key: 'jumpTuition',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('jumpTuition', {start: 0, end: 1, first: 0}),
            frameRate: 2
        });
        this.jumpTuition.setDepth(99998);
        
        // add physics collider
        this.physics.add.collider(this.robot, platforms);

        //color squares
        this.color = new Color(this, 370, 390, 'black').setOrigin(0, 0);
        this.anims.create({
            key: 'gem1',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('black', {start: 0, end: 11, first: 0}),
            frameRate: 8
        });
        this.color.setDepth(99999);
        
        //door
        this.door = new Door(this, 580, 0, 'door1').setOrigin(0, 0);
        this.door.setDepth(99999);
        this.door.alpha = 0;
        
        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //cheater for debugging
        this.input.keyboard.on('keydown', (event) => {
            switch (event.key) {
                case '1':
                    this.scene.start("level1Scene");
                    break;
                case '2':
                    this.scene.start("level2Scene");
                    break;
                case '3':
                    this.scene.start("level3Scene");
                    break;   
                case '4':
                    this.scene.start("level4Scene");
                    break;  
                case '5':
                    this.scene.start("level5Scene");
                    break;
                case '6':
                    this.scene.start("endlevelScene");
                    break;
                    
                default:
                    break;
            }
        });

        this.canJump = true;
    }

    update() {
        if (this.robot.x >95 && this.robot.x < 135){
            this.walkTuition.play('walkTuition',true)
            this.walkTuition.alpha = 1;
        }else{
            this.walkTuition.alpha = 0;
        }
        this.color.play('gem1',true);

        if (this.robot.x >337 && this.robot.x < 415){
            if(this.color.y>400){
                this.jumpTuition.play('jumpTuition',true) 
                this.jumpTuition.alpha = 1;             
            } 
        }else{
            this.jumpTuition.alpha = 0;
        }

        // check collisions
        if (this.checkCollision(this.robot, this.color)) {
            this.colorExplode(this.color);
        }

        if (this.checkCollision(this.robot, this.door)) {
            this.doorExplode(this.door);
        }

        // check keyboard input
        if (cursors.left.isDown) {
            if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
                this.robot.body.setVelocityX(0);
                // play walking sound
                if (this.robot.body.onFloor()) {
                    this.sound.play('walk');
                }
                if (this.color.y >400 ){
                    this.robot.play('Moving2',true);
                }else{
                    this.robot.play('Moving',true);
                }
            }
            this.robot.body.setAccelerationX(-this.ACCELERATION);
            this.robot.setFlip(true, false);

        } else if (cursors.right.isDown) {
            if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
                this.robot.body.setVelocityX(0);
                // play walking sound
                if (this.robot.body.onFloor()) {
                    this.sound.play('walk');
                }
                if (this.color.y >400 ){
                    this.robot.play('Moving2',true);
                }else{
                    this.robot.play('Moving',true);
                }
            }
            this.robot.resetFlip();
            this.robot.body.setAccelerationX(this.ACCELERATION);

        } else {
            // set acceleration to 0 so DRAG will take over
            this.robot.body.setAccelerationX(0);
            this.robot.body.setDragX(this.DRAG);
            this.robot.play('Moving',false);
            if (this.color.y >400 ){
                this.robot.play('Moving2',true);
            }
        }

        // jump & bounce
        if (this.robot.body.onFloor() && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.robot.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play('jump');
        }

        this.physics.world.wrap(this.robot, this.robot.width / 2);
    }

    checkCollision(robot, obstacle) {
        // simple AABB checking
        if (robot.x < obstacle.x + obstacle.width &&
            robot.x + robot.width > obstacle.x &&
            robot.y < obstacle.y + obstacle.height &&
            robot.height + robot.y > obstacle.y) {
            return true;
        } else {
            return false;
        }
    }

    colorExplode(color) {
        //temporarily hide obstacle
        this.color.alpha = 0;
        this.color.y = 450
        this.sound.play('levelup');

        this.particleManager = this.add.particles('cross');
        this.gravityEmitter = this.particleManager.createEmitter({
            x: 380,
            y: 400,
            speed: 1500,
            lifespan: 3000,
            quantity: 50,
            scale: { start: 100, end: 8 },
            tint: [ 0x000000 ],
            on : true,
        });
        this.time.delayedCall(500, ()=>{
            this.gravityEmitter.stop();
            this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg3').setOrigin(0, 0);
            this.door.y = 356;
            this.door.alpha = 1;
            
        });
        

        this.particleManager.setDepth(99999);

    }

    //Destoring the door when collides
    doorExplode(obstacle) {    // change level 
        this.door.alpha = 0;
        this.sound.play('door');
        this.scene.start('level2Scene');
        
        

    }
}