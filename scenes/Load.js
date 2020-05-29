class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        // load player
        this.load.path = "assets/player/";
        this.load.spritesheet('player', 'slimeAnimation.png', { frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 3 });
        // this.load.path = "assets/player/";
        // this.load.image('player', 'player.png');
        // load level1 assets
        this.load.path = "assets/Level1/";
        this.load.image('bg1', 'Level1-1.png');
        // load level2 assets
        this.load.path = "assets/Level2/";
        this.load.image('bg2', 'Level2-1.png');
        // load level3 assets
        this.load.path = "assets/Level3/";
        this.load.image('bg5', 'Level3-1.png');
        // load level4 assets
        this.load.path = "assets/Level4/";
        this.load.image('bg7', 'Level4-1.png');
        // load endlevel assets
        this.load.path = "assets/EndLevel/";
        this.load.image('bg8', 'EndLevel.png');
        
    }


    create() {
        // ...and pass to the next Scene
        this.scene.start("level1Scene");
    }
}