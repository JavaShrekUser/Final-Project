class Level2 extends Phaser.Scene {
    constructor() {
        super("level2Scene");
    }

    preload() {
        // preload assets
        this.load.audio('choco', './assets/sound/BGM.mp3');
        this.load.image('door2','./assets/Level2/door2.png');
        this.load.audio('walk', './assets/sound/Walk.mp3');
        this.load.audio('jump', './assets/sound/Jump.mp3');
        this.load.audio('levelup', './assets/sound/LevelUp.mp3');
        this.load.audio('bounce', './assets/sound/Bounce.mp3');
        this.load.audio('door', './assets/sound/DoorOpen.mp3');
        this.load.image("1bit_tiles2", "./assets/MainTiledSet.png");
        this.load.tilemapTiledJSON('platform_map2', './assets/Level2/Level2Map-2.json');
        this.load.image('bg4', './assets/Level2/Level2-2.png');
        this.load.spritesheet('yellow', './assets/Level2/yellow.png', { frameWidth: 20, frameHeight: 50, startFrame: 0, endFrame: 11 });

    }

    create() {

        // add a tilemap
        const map = this.add.tilemap("platform_map2");

        // add a tileset to the map
        const tileset = map.addTilesetImage("MainTiledSet", "1bit_tiles2");

        this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg2').setOrigin(0, 0);

        // create tilemap layers
        const platforms = map.createStaticLayer("Platforms", tileset, 0, 0).setDepth(99999);;

        platforms.setCollisionByProperty({ collides: true });
        
        // variables and settings
        this.ACCELERATION = 650;
        this.MAX_X_VEL = 220;   // pixels/second
        this.MAX_Y_VEL = 700;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.JUMP_VELOCITY = -750;
        this.physics.world.gravity.y = 3000;

        // print Scene name
        this.add.text(game.config.width / 2, 30, 'level2', { font: '14px Futura', fill: '#32CD32' }).setOrigin(0.5).setDepth(99998);

        // set up robot
        this.robot = this.physics.add.sprite(150, 350, 'player1').setOrigin(0);

        this.anims.create({
            key: 'Moving3',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player2', {start: 0, end: 3, first: 0}),
            frameRate: 6
        });
        this.robot.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.robot.setCollideWorldBounds(true);
        this.robot.setDepth(99999);

        // add physics collider
        this.physics.add.collider(this.robot, platforms);

        //color squares
        this.color = new Color(this, 600, 160, 'yellow').setOrigin(0, 0);
        this.anims.create({
            key: 'gem2',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('yellow', {start: 0, end: 11, first: 0}),
            frameRate: 8
        });
        this.color.setDepth(99999);

        //door
        this.door = new Door(this, 580, 470, 'door2').setOrigin(0, 0);
        this.door.setDepth(99999);
        this.door.alpha = 0;

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        const spikeObjects = map.getObjectLayer('Trap')['objects'];

        spikeObjects.forEach(spikeObject => {
            // Add new spikes to our sprite group
            const spike = this.spikes.create(spikeObject.x + 18, spikeObject.y, 'Trap').setOrigin(1, 1);

            this.physics.add.collider(this.robot, this.spikes, robotHit, null, this);

        });

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
        this.color.play('gem2',true);

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
                    this.robot.play('Moving3',true);
                }else{
                    this.robot.play('Moving2',true);
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
                    this.robot.play('Moving3',true);
                }else{
                    this.robot.play('Moving2',true);
                }
            }
            this.robot.resetFlip();
            this.robot.body.setAccelerationX(this.ACCELERATION);

        } else {
            // set acceleration to 0 so DRAG will take over
            this.robot.body.setAccelerationX(0);
            this.robot.body.setDragX(this.DRAG);
            this.robot.play('Moving2',false);
            if (this.color.y >400 ){
                this.robot.play('Moving3',true);
            }
            
        }

        // jump & bounce
        if (this.robot.body.onFloor() && Phaser.Input.Keyboard.JustDown(keySPACE))  {
            this.robot.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play('jump');
        }


        if (Phaser.Input.Keyboard.JustDown(keyR)) {     //é‡åŠ›åè½¬ invers the gravity
            this.physics.world.gravity.y = -(this.physics.world.gravity.y);
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

    //destroy the door when collides
    colorExplode(obstacle) {
        //temporarily hide obstacle
        obstacle.alpha = 0;
        this.color.y = 450;
        this.sound.play('levelup');

        this.particleManager = this.add.particles('cross');
        this.gravityEmitter = this.particleManager.createEmitter({
            x: 600,
            y: 160,
            // angle: { min: 180, max: 360 }, // try steps: 1000
            speed: 1500,
            // { min: 1000, max: 5000, steps: 500000 },
            // gravityY: 350,
            lifespan: 3000,
            quantity: 50,
            scale: { start: 100, end: 8 },
            tint: [ 0xFBF036 ],
            on : true,
        });
        this.time.delayedCall(500, ()=>{
            this.gravityEmitter.stop();
            this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg4').setOrigin(0, 0);
            this.door.x = 30
            this.door.y = 329;
            this.door.alpha = 1;
        });

        this.particleManager.setDepth(99999);

    }

    doorExplode(obstacle) {
        obstacle.alpha = 0;
        this.sound.play('door');
        this.scene.start('level3Scene');

    }


}
function robotHit(robot, spike) {
    // Set velocity back to 0
    this.robot.setVelocity(0, 0);
    // Put the player back in its original position
    this.robot.setX(260);
    this.robot.setY(300);
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