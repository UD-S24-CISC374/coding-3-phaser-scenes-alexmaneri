import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("ground", "assets/platform.png");
        this.load.image("desert", "assets/desert.png");
        this.load.image("sky", "assets/sky.png");
        this.load.image("space", "assets/space.png");
        this.load.image("winter", "assets/winter.png");
        this.load.image("shield", "assets/shield.png");
        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load;
    }

    create() {
        this.scene.start("MainScene");
    }
}
