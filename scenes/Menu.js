class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        //load image
        this.load.image('background', './assets/Menu.png');

    }

    create() {

        this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'background').
            setOrigin(0, 0);

        // define keys
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
            this.scene.start('loadScene');
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
            this.scene.start('creditScene');
        }

    }
}
