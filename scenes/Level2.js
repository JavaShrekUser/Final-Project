class Level2 extends Phaser.Scene {
    constructor() {
        super("level2Scene");
    }

    preload(){
        this.load.image('green', './assets/level2/green.png');  // preload assets
        this.load.image('bg4', './assets/level2/basicBack2.png');
        this.load.audio('choco','./assets/sound/BGM.mp3');
        this.load.audio('walk', './assets/sound/Walk.mp3');
        this.load.audio('jump', './assets/sound/Jump.mp3');
        this.load.audio('levelup', './assets/sound/LevelUp.mp3');
        this.load.audio('bounce', './assets/sound/Bounce.mp3');
        this.load.audio('door', './assets/sound/DoorOpen.mp3');
        this.load.image("1bit_tiles", "./assets/MainTiledSet.png");
        this.load.image('Trap', './assets/level2/Trap.png');
        this.load.image('bgimage', './assets/level2/BGI.png');
        this.load.tilemapTiledJSON('platform_map', './assets/level2/TiledMap.json'); 

    }

    create() {

        // add a tilemap
        const map = this.add.tilemap("platform_map");

        // add a tileset to the map
        const tileset = map.addTilesetImage("TiledSet","1bit_tiles");

        this.bgimage = this.add.tileSprite(0, 0, 640, 480, 'bgimage').setOrigin(0, 0);;

        // create tilemap layers
        const platforms = map.createStaticLayer("Platforms", tileset, 0, 0);
        // const trapLayer = map.createStaticLayer("Trap", tileset, 0, 0);

        platforms.setCollisionByExclusion(-1,true);
        

        // trapLayer.setCollisionByExclusion(-1,true);


                // define a render debug so we can see the tilemap's collision bounds
        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // platforms.renderDebug(debugGraphics, {
        //     tileColor: null,    // color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),    // color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)                // color of colliding face edges
        // });

        // set map collision (two styles: uncomment *one* of the two lines below)
        //groundLayer.setCollision([19, 20, 21, 67, 69, 120]);
      

        // variables and settings
        this.ACCELERATION = 500;
        this.MAX_X_VEL = 500;   // pixels/second
        this.MAX_Y_VEL = 5000;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.JUMP_VELOCITY = -1000;
        this.physics.world.gravity.y = 4000;

        // set bg
        // this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg2').
        //     setOrigin(0, 0);

        // print Scene name
        this.add.text(game.config.width / 2, 30, 'level2', { font: '14px Futura', fill: '#32CD32' }).setOrigin(0.5);
        this.add.text(game.config.width / 2, 50, 'End', { font: '14px Futura', fill: '#00000' }).setOrigin(0.5).setDepth(99998);
        this.add.text(120,10, 'Press R to inverse your gravity', { font: '14px Futura', fill: '#00000' }).setOrigin(0.5);


        // set up robot
        this.robot = this.physics.add.sprite(260, 300, 'player').setScale(1.2).setOrigin(0);
        this.robot.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.robot.setCollideWorldBounds(true);
        this.robot.setDepth(99999);

        // add physics collider
        this.physics.add.collider(this.robot,platforms);

        //color squares
        this.color = new Color(this, 573, 45, 'green').setOrigin(0, 0);
        this.color.setDepth(99998);

        //door
        // this.door = new Door(this, 580, 349, 'door').setOrigin(0, 0);
        // this.door.setDepth(99999);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        const spikeObjects = map.getObjectLayer('Trap')['objects'];

        spikeObjects.forEach(spikeObject => {
        // Add new spikes to our sprite group
        const spike = this.spikes.create(spikeObject.x+18, spikeObject.y, 'Trap').setOrigin(1,1);

        this.physics.add.collider(this.robot, this.spikes, robotHit, null, this);
  
        });
    }

    update() {

         // check collisions
         if (this.checkCollision(this.robot, this.color)) {
            this.colorExplode(this.color); 
            // this.door.alpha = 1;
            // this.robotExplode(this.robot.x,this.robot.y);
        }

        // if (this.checkCollision(this.robot, this.door)) {
        //     // this.doorExplode(this.door); 
        //     // this.robotExplode(this.robot.x,this.robot.y);
        // }

        // check keyboard input
        if (cursors.left.isDown) {
            this.robot.body.setAccelerationX(-this.ACCELERATION);
            this.robot.body.setBounceX(0.3);
            this.robot.setFlip(true, false);
            // play(key [, ignoreIfPlaying] [, startFrame])
            //this.robot.anims.play('walk', true);
        } else if (cursors.right.isDown) {
            this.robot.body.setAccelerationX(this.ACCELERATION);
            this.robot.body.setBounceX(0.3);

            this.robot.resetFlip();
            //this.robot.anims.play('walk', true);
        } else {
            // set acceleration to 0 so DRAG will take over
            this.robot.body.setAccelerationX(0);
            this.robot.body.setDragX(this.DRAG);
            //this.robot.anims.play('idle');
        }

        // jump & bounce
        if (this.robot.body.onFloor() && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.robot.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play('jump');
        }

        if ((this.robot.body.blocked.right || this.robot.body.blocked.left) && !this.robot.body.onFloor()) {
            this.robot.body.setVelocityY(this.JUMP_VELOCITY);
            if(this.robot.body.blocked.right) this.robot.body.setVelocityX(this.JUMP_VELOCITY/3);
            if(this.robot.body.blocked.left) this.robot.body.setVelocityX(-this.JUMP_VELOCITY/3);
            this.sound.play('bounce');
        }
        // if ((this.robot.body.blocked.right || this.robot.body.blocked.left) && !this.robot.body.onFloor() && Phaser.Input.Keyboard.JustDown(cursors.up)) {
        //     this.robot.body.setVelocityY(this.JUMP_VELOCITY);
        //     if(this.robot.body.blocked.right) this.robot.body.setVelocityX(this.JUMP_VELOCITY/3);
        //     if(this.robot.body.blocked.left) this.robot.body.setVelocityX(-this.JUMP_VELOCITY/3);
        //     this.sound.play('bounce');
        // }

        //walk sound
        if (this.robot.body.onFloor() && Phaser.Input.Keyboard.JustDown(cursors.right)) {
            this.sound.play('walk');
        }
        if (this.robot.body.onFloor() && Phaser.Input.Keyboard.JustDown(cursors.left)) {
            this.sound.play('walk');
        }

        if(Phaser.Input.Keyboard.JustDown(keyR)){     //重力反转 invers the gravity
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
    colorExplode(obstacle){
        //temporarily hide obstacle
        obstacle.alpha = 0;
        this.color.y = 450;
        this.sound.play('levelup');
        this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg4').setOrigin(0, 0);
        // this.door.y = 450;
        
    }

    // doorExplode(obstacle){
    //     obstacle.alpha = 0;
    //     this.scene.start('level2Scene');
        
    // }

    
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