// game configuration object
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, ]
    // scene: [ Menu, Level1 ]
}

// main game object
let game = new Phaser.Game(config);

// define game settings
game.settings = {
    moveSpeed: 2,
}

// reserve keyboard vars
let keyR, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyS;