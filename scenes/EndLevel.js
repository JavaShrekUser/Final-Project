class EndLevel extends Phaser.Scene {
    constructor() {
        super("endlevelScene");
    }

    preload() {
        // this.load.image('brown', './assets/Level4/brown.png');  // preload assets
        this.load.audio('choco', './assets/sound/BGM.mp3');
        this.load.audio('walk', './assets/sound/Walk.mp3');
        this.load.audio('die', './assets/sound/Die.mp3');
        this.load.image('doorEnd','./assets/EndLevel/doorEnd.png');
        this.load.audio('jump', './assets/sound/Jump.mp3');
        this.load.audio('levelup', './assets/sound/LevelUp.mp3');
        this.load.audio('bounce', './assets/sound/Bounce.mp3');
        this.load.audio('door', './assets/sound/DoorOpen.mp3');
        this.load.image("1bit_tiles6", "./assets/MainTiledSet.png");
        this.load.image('Trap', './assets/Trap.png');
        this.load.tilemapTiledJSON('platform_map6', './assets/EndLevel/EndLevel.json');
        this.load.image('cloudPlat', './assets/EndLevel/cloud.png');
        this.load.image("EndLevelCoverTop1","./assets/EndLevel/EndLevelCoverTop1.png");
        this.load.image("EndLevelCoverBot1","./assets/EndLevel/EndLevelCoverBot1.png");
        this.load.image("EndLevelCoverTop2","./assets/EndLevel/EndLevelCoverTop2.png");
        this.load.image("EndLevelCoverBot2","./assets/EndLevel/EndLevelCoverBot2.png");
        this.load.spritesheet('red', './assets/EndLevel/red.png', { frameWidth: 20, frameHeight: 50, startFrame: 0, endFrame: 11 });
        
    }

    create() {

        // add a tilemap
        const map = this.add.tilemap("platform_map6");

        // add a tileset to the map
        const tileset = map.addTilesetImage("MainTiledSet", "1bit_tiles6");

        this.mainBack = this.add.tileSprite(0, 0, 640, 1440, 'bg11').setOrigin(0, 0);

        // create tilemap layers
        const platforms = map.createStaticLayer("Platforms", tileset, 0, 0).setDepth(99999);
        // const trapLayer = map.createStaticLayer("Trap", tileset, 0, 0);

        platforms.setCollisionByProperty({ collides: true });

        // trapLayer.setCollisionByExclusion(-1,true);

        // variables and settings
        this.ACCELERATION = 650;
        this.MAX_X_VEL = 220;   // pixels/second
        this.MAX_Y_VEL = 700;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.JUMP_VELOCITY = -750;
        this.physics.world.gravity.y = 3000;

        // print Scene name
        this.add.text(game.config.width / 2, 30, 'EndLevel', { font: '14px Futura', fill: '#32CD32' }).setOrigin(0.5).setDepth(99999);
        this.add.text(game.config.width / 2, 50, 'End', { font: '14px Futura', fill: '#00000' }).setOrigin(0.5).setDepth(99998);

        this.BotBack1 = this.add.tileSprite(0, 980 , 640, 480, 'EndLevelCoverTop1').setOrigin(0, 0).setDepth(99999);
        this.BotBack2 = this.add.tileSprite(0, 980, 640, 480, 'EndLevelCoverBot1').setOrigin(0, 0).setDepth(99999);
        this.MidBack1 = this.add.tileSprite(0, 500 , 640, 480, 'EndLevelCoverTop2').setOrigin(0, 0).setDepth(99999);
        this.MidBack2 = this.add.tileSprite(0, 500, 640, 480, 'EndLevelCoverBot2').setOrigin(0, 0).setDepth(99999);


        // set up robot
        this.robot = this.physics.add.sprite(80, 1300, 'player5').setOrigin(0);
        this.anims.create({
            key: 'Moving7',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player6', {start: 0, end: 3, first: 0}),
            frameRate: 6
        });

        this.endanims = new Door(this, 0, 0, 'ending').setOrigin(0, 0);
        this.anims.create({
            key: 'lastending',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('ending', {start: 0, end: 20, first: 0}),
            frameRate: 2
        })
        this.robot.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.robot.setCollideWorldBounds(true);
        this.robot.setDepth(99999);

        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // set up cloudPlat
        this.cloud1 = this.physics.add.sprite(240, 855, 'cloudPlat').setScale(1).setOrigin(0);
        this.cloud1.body.immovable = true;
        this.cloud1.body.allowGravity = false;
        this.canRefresh1 = true;

        this.cloud2 = this.physics.add.sprite(350, 715, 'cloudPlat').setScale(1).setOrigin(0);
        this.cloud2.body.immovable = true;
        this.cloud2.body.allowGravity = false;
        this.canRefresh2 = true;

        this.cloud3 = this.physics.add.sprite(350, 715, 'cloudPlat').setScale(1).setOrigin(0);
        this.cloud3.body.immovable = true;
        this.cloud3.body.allowGravity = false;
        this.canRefresh3 = true;

        // add physics collider
        this.physics.add.collider(this.robot, platforms);
        this.physics.add.collider(this.cloud1, this.robot, cloud1Explode, null, this);
        this.physics.add.collider(this.cloud2, this.robot, cloud2Explode, null, this);
        this.physics.add.collider(this.cloud3, this.robot, cloud3Explode, null, this);

        const spikeObjects = map.getObjectLayer('Trap')['objects'];
        this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        spikeObjects.forEach(spikeObject => {
            // Add new spikes to our sprite group
            const spike = this.spikes.create(spikeObject.x + 18, spikeObject.y, 'Trap').setOrigin(1, 1);

            this.physics.add.collider(this.robot, this.spikes, robotHit, null, this);
        });

        // timer for cloudPlat
        this.timer1 = 0;
        this.time.addEvent({ delay: 100, callback: this.onEvent1, callbackScope: this, loop: true });
        this.timer2 = 0;
        this.time.addEvent({ delay: 100, callback: this.onEvent2, callbackScope: this, loop: true });
        this.timer3 = 0;
        this.time.addEvent({ delay: 100, callback: this.onEvent3, callbackScope: this, loop: true });

        //color squares
        this.color = new Color(this, 310, 99, 'red').setOrigin(0, 0);
        this.anims.create({
            key: 'gem6',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('red', {start: 0, end: 11, first: 0}),
            frameRate: 8
        });
        this.color.setDepth(99999);

        //door
        this.door = new Door(this, 5800, 4800, 'doorEnd').setOrigin(0, 0);
        this.door.setDepth(99999);
        this.door.alpha = 0;

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
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

        // setup camera
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels-20);
        this.cameras.main.startFollow(this.robot, true, 0.25, 0.25);

        this.gameOver = false;
    }

    update() {
        this.color.play('gem6',true);

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyY)) {
            game.sound.stopAll();
            this.scene.start('level1Scene');
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
                if (this.robot.body.onFloor() || this.robot.body.touching.down) {
                    if(this.color.y <440){
                        this.sound.play('walk');
                    }
                }
                if (this.color.y >400 ){
                    this.robot.play('Moving7',true);
                }else{
                    this.robot.play('Moving6',true);
                }
            }
            this.robot.body.setAccelerationX(-this.ACCELERATION);
            this.robot.setFlip(true, false);

        } else if (cursors.right.isDown) {
            if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
                // play walking sound
                if (this.robot.body.onFloor() || this.robot.body.touching.down) {
                    if(this.color.y <440){
                        this.sound.play('walk');
                    }
                }
                if (this.color.y >400 ){
                    this.robot.play('Moving7',true);
                }else{
                    this.robot.play('Moving6',true);
                }
            }
            this.robot.resetFlip();
            this.robot.body.setAccelerationX(this.ACCELERATION);
        } else {
            // set acceleration to 0 so DRAG will take over
            this.robot.body.setAccelerationX(0);
            this.robot.body.setDragX(this.DRAG);
            this.robot.play('Moving6',false);
            if (this.color.y >400 ){
                this.robot.play('Moving7',true);
            }

        }

        // jump & bounce
        if ((this.robot.body.onFloor() || this.robot.body.touching.down)
            && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.robot.body.setVelocityY(this.JUMP_VELOCITY);
            if(this.color.y <440){
                this.sound.play('jump');
            }
        }

        if (this.robot.y>960){
            if ((this.robot.body.blocked.right || this.robot.body.blocked.left
                || this.robot.body.touching.right || this.robot.body.touching.left)
                && (!this.robot.body.onFloor() || this.robot.body.touching.down)
                && this.canJump) {
                this.robot.body.setVelocityY(this.JUMP_VELOCITY);
                if (this.robot.body.blocked.right || this.robot.body.touching.right) {
                    this.robot.body.setVelocityX(this.JUMP_VELOCITY);
                }
                if (this.robot.body.blocked.left || this.robot.body.touching.left) {
                    this.robot.body.setVelocityX(-this.JUMP_VELOCITY);
                }
                this.canJump = false;
                this.sound.play('bounce');
            } else if (this.robot.body.onFloor() || this.robot.body.touching.down) {
                this.canJump = true;
            }
        }
        

        if (this.robot.y<600  ){
            this.physics.world.gravity.y = 1800;

         
        }else{
            this.physics.world.gravity.y = 3000;
      
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
        this.MAX_X_VEL = 0;
        this.ACCELERATION = 0;
        this.JUMP_VELOCITY = 0;
        this.sound.play('levelup');
        this.particleManager = this.add.particles('cross');
        this.gravityEmitter = this.particleManager.createEmitter({
            x: 310,
            y: 99,
            // angle: { min: 180, max: 360 }, // try steps: 1000
            speed: 300,
            // { min: 1000, max: 5000, steps: 500000 },
            // gravityY: 350,
            lifespan: 1300,
            quantity: 6,
            scale: { start: 9, end: 23 },
            tint: [0xFBF036,0x72D572,0x4FC3F7,0xFF0000, 0xFFFD2A, 0xFF9D11 ],
            on : true,
        });
        this.time.delayedCall(10000, ()=>{
            this.gravityEmitter.stop();
            this.door.y = 220;
            this.door.alpha = 1;
        });
        this.time.delayedCall(5000, ()=>{
            this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg11').setOrigin(0, 0);
            this.door.y = 220;
            this.door.alpha = 1;
            this.endanims.play('lastending',true);
            this.endanims.setDepth(100000);
            this.gameOver = true;
        });

        this.particleManager.setDepth(99999);

    }

    doorExplode(obstacle) {
        obstacle.alpha = 0;
        this.scene.start('endlevelScene');

    }

    onEvent1() {
        if (this.timer1 > 0) {
            this.timer1 -= 1;
        }
        if (this.timer1 == 12) {
            this.cloud1.x = -250;
            this.cloud1.alpha = 0;
        }
        if (this.timer1 == 0) {
            this.cloud1.x = 270;
            this.cloud1.alpha = 1;
            this.canRefresh1 = true;
        }
    }
    onEvent2() {
        if (this.timer2 > 0) {
            this.timer2 -= 1;
        }
        if (this.timer2 == 12) {
            this.cloud2.x = -250;
            this.cloud2.alpha = 0;
        }
        if (this.timer2 == 0) {
            this.cloud2.x = 520;
            this.cloud2.alpha = 1;
            this.canRefresh2 = true;
        }
    }
    onEvent3() {
        if (this.timer3 > 0) {
            this.timer3 -= 1;
        }
        if (this.timer3 == 12) {
            this.cloud3.x = -250;
            this.cloud3.alpha = 0;
        }
        if (this.timer3 == 0) {
            this.cloud3.x = 35;
            this.cloud3.alpha = 1;
            this.canRefresh3 = true;
        }
    }
}
function robotHit(robot, spike) {
    // Set velocity back to 0
    this.robot.setVelocity(0, 0);
    this.sound.play('die');
    // Put the player back in its original position
    this.robot.setX(80);
    this.robot.setY(1380);
    // Set the visibility to 0 i.e. hide the player
    this.robot.setAlpha(0);
    // Add a tween that 'blinks' until the player is gradually visible
    let tw = this.tweens.add({
        targets: this.robot,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
        repeat: 5,
    });
}

function cloud1Explode() {
    if (this.canRefresh1) {
        this.timer1 = 20;
        this.canRefresh1 = false;
    }
}
function cloud2Explode() {
    if (this.canRefresh2) {
        this.timer2 = 20;
        this.canRefresh2 = false;
    }
}
function cloud3Explode() {
    if (this.canRefresh3) {
        this.timer3 = 20;
        this.canRefresh3 = false;
    }
}
