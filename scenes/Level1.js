class Level1 extends Phaser.Scene {
    constructor() {
        super("level1Scene");
    }

    create() {
        // variables and settings
        this.ACCELERATION = 500;
        this.MAX_X_VEL = 500;   // pixels/second
        this.MAX_Y_VEL = 5000;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.JUMP_VELOCITY = -1000;
        this.physics.world.gravity.y = 3500;

        // set bg
        // this.cameras.main.setBackgroundColor("#227B96");
        this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg1').
            setOrigin(0, 0);

        // print Scene name
        this.add.text(game.config.width / 2, 30, 'level1', { font: '14px Futura', fill: '#32CD32' }).setOrigin(0.5);

        // make ground tiles group
        this.ground = this.add.group();
        // 小方块（顺序：从上往下)
        // 地面
        for (let i = 467; i < game.config.width; i += tileSize) {
            let groundTile1 = this.physics.add.sprite(i, game.config.height - tileSize*4).setScale(SCALE).setOrigin(0);
            let groundTile2 = this.physics.add.sprite(i, game.config.height - tileSize*3).setScale(SCALE).setOrigin(0);
            groundTile1.body.immovable = true;
            groundTile1.body.allowGravity = false;
            groundTile2.body.immovable = true;
            groundTile2.body.allowGravity = false;
            this.ground.add(groundTile1);
            this.ground.add(groundTile2);
        }
        for (let i = 0; i < game.config.width - tileSize * 20; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*5).setScale(SCALE).setOrigin(0);
            let groundTile1 = this.physics.add.sprite(i, game.config.height - tileSize*4).setScale(SCALE).setOrigin(0);
            let groundTile2 = this.physics.add.sprite(i, game.config.height - tileSize*3).setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            groundTile1.body.immovable = true;
            groundTile1.body.allowGravity = false;
            groundTile2.body.immovable = true;
            groundTile2.body.allowGravity = false;
            this.ground.add(groundTile);
            this.ground.add(groundTile1);
            this.ground.add(groundTile2);
        }
        for (let i = 0; i < game.config.width; i += tileSize) {
            let groundTile1 = this.physics.add.sprite(i, game.config.height - tileSize*2).setScale(SCALE).setOrigin(0);
            let groundTile2 = this.physics.add.sprite(i, game.config.height - tileSize).setScale(SCALE).setOrigin(0);
            groundTile1.body.immovable = true;
            groundTile1.body.allowGravity = false;
            groundTile2.body.immovable = true;
            groundTile2.body.allowGravity = false;
            this.ground.add(groundTile1);
            this.ground.add(groundTile2);
        }

        

        // set up robot
        this.robot = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, 'player').setScale(SCALE);
        this.robot.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // add physics collider
        this.physics.add.collider(this.robot, this.ground);

        // 快速切换关卡 方便测试
        this.input.keyboard.on('keydown', (event) => {
            switch (event.key) {
                case '1':
                    this.scene.start("level1Scene");
                    break;
                case '2':
                    this.scene.start("level2Scene");
                    break;
                default:
                    break;
            }
        });
    }

    update() {
        // check keyboard input
        if (cursors.left.isDown) {
            this.robot.body.setAccelerationX(-this.ACCELERATION);
            this.robot.setFlip(true, false);
            // see: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html#play__anchor
            // play(key [, ignoreIfPlaying] [, startFrame])
            //this.robot.anims.play('walk', true);
        } else if (cursors.right.isDown) {
            this.robot.body.setAccelerationX(this.ACCELERATION);
            this.robot.resetFlip();
            //this.robot.anims.play('walk', true);
        } else {
            // set acceleration to 0 so DRAG will take over
            this.robot.body.setAccelerationX(0);
            this.robot.body.setDragX(this.DRAG);
            //this.robot.anims.play('idle');
        }

        // jump
        // use JustDown to avoid "pogo" jumps if you player keeps the up key held down
        // note: there is unfortunately no .justDown property in Phaser's cursor object
        if (this.robot.body.touching.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.robot.body.setVelocityY(this.JUMP_VELOCITY);
        }
        // wrap physics object(s) .wrap(gameObject, padding)
        this.physics.world.wrap(this.robot, this.robot.width / 2);
    }
}