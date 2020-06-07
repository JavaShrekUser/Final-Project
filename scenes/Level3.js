class Level3 extends Phaser.Scene {
    constructor() {
        super("level3Scene");
    }

    preload() {
        // preload assets
        this.load.audio('choco', './assets/sound/BGM.mp3');
        this.load.image('door3','./assets/Level3/door3.png');
        this.load.audio('walk', './assets/sound/Walk.mp3');
        this.load.audio('jump', './assets/sound/Jump.mp3');
        this.load.audio('levelup', './assets/sound/LevelUp.mp3');
        this.load.audio('bounce', './assets/sound/Bounce.mp3');
        this.load.audio('door', './assets/sound/DoorOpen.mp3');
        this.load.image("1bit_tiles3", "./assets/MainTiledSet.png");
        this.load.image('Trap', './assets/Trap.png');
        this.load.image("Level3CoverTop","./assets/Level3/Level3CoverTop.png");
        this.load.image("Level3CoverBot","./assets/Level3/Level3CoverBot.png");
        this.load.tilemapTiledJSON('platform_map3', './assets/Level3/Level3Map-1.json');
        this.load.image('bg6', './assets/Level3/Level3-2.png');
        this.load.spritesheet('green', './assets/Level3/green.png', { frameWidth: 20, frameHeight: 50, startFrame: 0, endFrame: 11 });
        this.load.spritesheet('bounceTuition', './assets/tutorial/bounceTuition.png', { frameWidth: 640, frameHeight: 480, startFrame: 0, endFrame: 4 });


    }

    create() {

        // add a tilemap
        const map = this.add.tilemap("platform_map3");

        // add a tileset to the map
        const tileset = map.addTilesetImage("MainTiledSet", "1bit_tiles3");

        this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg5').setOrigin(0, 0);

        // create tilemap layers
        const platforms = map.createStaticLayer("Platforms", tileset, 0, 0).setDepth(99998);

        platforms.setCollisionByProperty({ collides: true});

        // variables and settings
        this.ACCELERATION = 650;
        this.MAX_X_VEL = 220;   // pixels/second
        this.MAX_Y_VEL = 700;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.JUMP_VELOCITY = -750;
        this.physics.world.gravity.y = 3000;

        // print Scene name
        this.add.text(game.config.width / 2, 30, 'level3', { font: '14px Futura', fill: '#32CD32' }).setOrigin(0.5).setDepth(99999);

        // set up robot
        this.robot = this.physics.add.sprite(150, 350, 'player2').setOrigin(0);
        this.anims.create({
            key: 'Moving4',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player3', {start: 0, end: 3, first: 0}),
            frameRate: 6
        });
        this.robot.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.robot.setCollideWorldBounds(true);
        this.robot.setDepth(99999);

        //tutorial
        this.bounceTuition = new Door(this, 0, 0, 'bounceTuition').setOrigin(0, 0);
        this.anims.create({
            key: 'bounceTuition',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('bounceTuition', {start: 0, end: 4, first: 0}),
            frameRate: 2
        });
        this.bounceTuition.setDepth(99999);
        // add physics collider
        this.physics.add.collider(this.robot, platforms);

        //color squares
        this.color = new Color(this, 100, 15, 'green').setOrigin(0, 0);
        this.anims.create({
            key: 'gem3',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('green', {start: 0, end: 11, first: 0}),
            frameRate: 8
        });
        this.color.setDepth(99999);

        //door
        this.door = new Door(this, 580, 440, 'door3').setOrigin(0, 0);
        this.door.setDepth(99999);
        this.door.alpha = 0;

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
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
        this.color.play('gem3',true);

        if (this.robot.x >400 && this.robot.x < 500){
            this.bounceTuition.play('bounceTuition',true)
            this.bounceTuition.alpha = 1;
        }else{
            this.bounceTuition.alpha = 0;
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

                // play walking sound
                if (this.robot.body.onFloor()) {
                    this.sound.play('walk');
                }
                if (this.color.y >400 ){
                    this.robot.play('Moving4',true);
                }else{
                    this.robot.play('Moving3',true);
                }
            }
            this.robot.body.setAccelerationX(-this.ACCELERATION);
            this.robot.setFlip(true, false);

        } else if (cursors.right.isDown) {
            if (Phaser.Input.Keyboard.JustDown(cursors.right)) {

                // play walking sound
                if (this.robot.body.onFloor()) {
                    this.sound.play('walk');
                }
                if (this.color.y >400 ){
                    this.robot.play('Moving4',true);
                }else{
                    this.robot.play('Moving3',true);
                }
            }
            this.robot.resetFlip();
            this.robot.body.setAccelerationX(this.ACCELERATION);

        } else {
            // set acceleration to 0 so DRAG will take over
            this.robot.body.setAccelerationX(0);
            this.robot.body.setDragX(this.DRAG);
            this.robot.play('Moving3',false);
            if (this.color.y >400 ){
                this.robot.play('Moving4',true);
            }
        }

        // jump & bounce
        if (this.robot.body.onFloor() && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.robot.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play('jump');
        }
        if (this.color.y >440){
            if ((this.robot.body.blocked.right || this.robot.body.blocked.left) && !this.robot.body.onFloor() && this.canJump) {
                this.robot.body.setVelocityY(this.JUMP_VELOCITY);
                if (this.robot.body.blocked.right) {
                    this.robot.body.setVelocityX(this.JUMP_VELOCITY);
                }
                if (this.robot.body.blocked.left) {
                    this.robot.body.setVelocityX(-this.JUMP_VELOCITY);
                }
                this.canJump = false;
                this.sound.play('bounce');
            } else if (this.robot.body.onFloor()) {
                this.canJump = true;
            }
        }
        

        if (Phaser.Input.Keyboard.JustDown(keyR)) {     //é‡åŠ›åè½¬ invers the gravity
            this.physics.world.gravity.y = -(this.physics.world.gravity.y);
        }
        
        // wrap physics object(s) .wrap(gameObject, padding)
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

    //destroy the door when collides
    colorExplode(obstacle) {
        //temporarily hide obstacle
        obstacle.alpha = 0;
        this.color.y = 450;
        this.sound.play('levelup');

        this.particleManager = this.add.particles('cross');
        this.gravityEmitter = this.particleManager.createEmitter({
            x: 100,
            y: 15,
            // angle: { min: 180, max: 360 }, // try steps: 1000
            speed: 1500,
            // { min: 1000, max: 5000, steps: 500000 },
            // gravityY: 350,
            lifespan: 3000,
            quantity: 51,
            scale: { start: 100, end: 8 },
            tint: [ 0x72D572 ],
            on : true,
        });
        this.time.delayedCall(500, ()=>{
            this.gravityEmitter.stop();
            this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg6').setOrigin(0, 0);
            this.door.y = 220;
            this.door.alpha = 1;
            this.mainBack1 = this.add.tileSprite(0, 0, 640, 480, 'Level3CoverTop').setOrigin(0, 0).setDepth(1);
            this.mainBack2 = this.add.tileSprite(0, 0, 640, 480, 'Level3CoverBot').setOrigin(0, 0).setDepth(99998);
        });

        this.particleManager.setDepth(99999);

    }

    doorExplode(obstacle){
        obstacle.alpha = 0;
        this.sound.play('door');
        this.scene.start('level4Scene');

    }

}