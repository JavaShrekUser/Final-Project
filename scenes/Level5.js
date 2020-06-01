class Level5 extends Phaser.Scene {
    constructor() {
        super("level5Scene");
    }

    preload() {
        // preload assets
        this.load.audio('choco', './assets/sound/BGM.mp3');
        this.load.audio('walk', './assets/sound/Walk.mp3');
        this.load.audio('jump', './assets/sound/Jump.mp3');
        this.load.audio('levelup', './assets/sound/LevelUp.mp3');
        this.load.audio('bounce', './assets/sound/Bounce.mp3');
        this.load.audio('door', './assets/sound/DoorOpen.mp3');
        this.load.image("1bit_tiles5", "./assets/MainTiledSet.png");
        this.load.image('Trap', './assets/Trap.png');
        this.load.tilemapTiledJSON('platform_map5', './assets/Level5/Level5Map.json');
        this.load.image('bg10', './assets/Level5/Level5-2.png');
        this.load.spritesheet('blue', './assets/Level5/blue.png', { frameWidth: 20, frameHeight: 50, startFrame: 0, endFrame: 11 });

    }

    create() {

        // add a tilemap
        const map = this.add.tilemap("platform_map5");

        // add a tileset to the map
        const tileset = map.addTilesetImage("MainTiledSet", "1bit_tiles5");

        this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg9').setOrigin(0, 0);

        // create tilemap layers
        const platforms = map.createStaticLayer("Platforms", tileset, 0, 0).setDepth(99999);
        // const trapLayer = map.createStaticLayer("Trap", tileset, 0, 0);

        platforms.setCollisionByProperty({ collides: true});

        // trapLayer.setCollisionByExclusion(-1,true);

        // variables and settings
        this.ACCELERATION = 650;
        this.MAX_X_VEL = 220;   // pixels/second
        this.MAX_Y_VEL = 700;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.JUMP_VELOCITY = -750;
        this.physics.world.gravity.y = 3000;

        // print Scene name
        this.add.text(game.config.width / 2, 30, 'level5', { font: '14px Futura', fill: '#32CD32' }).setOrigin(0.5).setDepth(99999);
        this.add.text(120, 10, 'Press R to inverse your gravity', { font: '14px Futura', fill: '#00000' }).setOrigin(0.5);


        // set up robot
        this.robot = this.physics.add.sprite(150, 350, 'player4').setOrigin(0);
        this.anims.create({
            key: 'Moving6',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player5', {start: 0, end: 3, first: 0}),
            frameRate: 6
        });
        this.robot.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.robot.setCollideWorldBounds(true);
        this.robot.setDepth(99999);

        // add physics collider
        this.physics.add.collider(this.robot, platforms);

        //color squares
        this.color = new Color(this, 190, 75, 'blue').setOrigin(0, 0);
        this.anims.create({
            key: 'gem5',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('blue', {start: 0, end: 11, first: 0}),
            frameRate: 8
        });
        this.color.setDepth(99999);

        //door
        this.door = new Door(this, 550, 480, 'door').setOrigin(0, 0);
        this.door.setDepth(99999);
        this.door.alpha = 0;

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.spikes.setDepth(99999);

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
        this.color.play('gem5',true);

        // check collisions
        if (this.checkCollision(this.robot, this.color)) {
            this.colorExplode(this.color);
            this.door.alpha = 1;
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
                    this.robot.play('Moving6',true);
                }else{
                    this.robot.play('Moving5',true);
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
                    this.robot.play('Moving6',true);
                }else{
                    this.robot.play('Moving5',true);
                }
            }
            this.robot.resetFlip();
            this.robot.body.setAccelerationX(this.ACCELERATION);
        } else {
            // set acceleration to 0 so DRAG will take over
            this.robot.body.setAccelerationX(0);
            this.robot.body.setDragX(this.DRAG);
            this.robot.play('Moving5',false);
            if (this.color.y >400 ){
                this.robot.play('Moving6',true);
            }
            
        }

        // jump & bounce
        if (this.robot.body.onFloor() && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.robot.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play('jump');
        }

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

        if (this.robot.body.blocked.up){
            this.robot.setFlipY(true);
        } else {
            this.robot.setFlipY(false);
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
        this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg10').setOrigin(0, 0);
        this.mainBack.setDepth(99998);
        this.door.y = 220;

    }

    doorExplode(obstacle){
        obstacle.alpha = 0;
        this.scene.start('endlevelScene');

    }


}
function robotHit(robot, spike) {
    // Set velocity back to 0
    this.robot.setVelocity(0, 0);
    // Put the player back in its original position
    this.robot.setX(150);
    this.robot.setY(350);
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