/*

Team: JavaSherkProgrammer

Programmer:          
Abudula Aisikaer
Zihan Guo

Artist & Designer: 
Logan Park 

*/

"use strict";

// global variables
let cursors;
let currentScene = 0;
const SCALE = 0.5;
const tileSize = 21;

// main game object
let config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Menu, Credit, Load, Level1, Level2, Level3, Level4, Level5, EndLevel]
};
// reserve keyboard vars
let keyRIGHT,keyR, keyY,keySPACE;

let game = new Phaser.Game(config);
