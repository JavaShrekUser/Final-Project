class Credit extends Phaser.Scene {
    constructor() {
        super("creditScene");
    }

    preload() {
        // load credit scene
        this.load.path = "assets/";
        this.load.image('credit', 'credit.png');
        
    }


    create() {
        // ...and pass to the next Scene
        this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'credit').setOrigin(0, 0);
        cursors = this.input.keyboard.createCursorKeys();
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
            this.scene.start('menuScene');
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
            this.scene.start('loadScene');
        }
    }
}