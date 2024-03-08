import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private player?: Phaser.Physics.Arcade.Sprite;
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private shields?: Phaser.Physics.Arcade.StaticGroup;
    private PlayerX: number = 400;
    private PlayerY: number = 300;
    private flag: boolean = false;

    constructor() {
        super({ key: "MainScene" });
    }

    init(data: { PlayerX: number; PlayerY: number; b: boolean }) {
        if (this.flag) {
            this.PlayerX = data.PlayerX;
            this.PlayerY = data.PlayerY;
            this.flag = data.b;
        }
    }

    create() {
        this.add.image(400, 300, "desert");
        this.platforms = this.physics.add.staticGroup();
        const ground = this.platforms.create(
            630,
            568,
            "ground"
        ) as Phaser.Physics.Arcade.Sprite;
        ground.setScale(2).refreshBody();

        this.player = this.physics.add.sprite(
            this.PlayerX,
            this.PlayerY,
            "dude"
        );
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.physics.add.collider(this.player, this.platforms);
        this.cursors = this.input.keyboard?.createCursorKeys();

        this.shields = this.physics.add.staticGroup();
        const shield = this.shields.create(
            1000,
            510,
            "shield"
        ) as Phaser.Physics.Arcade.Sprite;
        shield.setScale(0.05).refreshBody();

        this.physics.add.overlap(
            this.player,
            this.shields,
            this.handleChangeScene1,
            undefined,
            this
        );
    }

    private handleChangeScene1(
        player:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile
    ) {
        let PlayerX, PlayerY;

        if ("body" in player) {
            // player is a GameObjectWithBody
            PlayerX = player.body.x;
            PlayerY = player.body.y;
        } else {
            // player is a Tile
            PlayerX = player.x;
            PlayerY = player.y;
        }

        this.scene.start("Main2", { PlayerX, PlayerY });
    }

    update() {
        if (!this.cursors) {
            return;
        }
        if (this.cursors.left.isDown) {
            this.player?.setVelocityX(-400);
            this.player?.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player?.setVelocityX(400);
            this.player?.anims.play("right", true);
        } else {
            this.player?.setVelocityX(0);
            this.player?.anims.play("turn");
        }
        if (this.cursors.up.isDown && this.player?.body?.touching.down) {
            this.player.setVelocityY(-330);
        } else if (this.cursors.down.isDown) {
            this.player?.setVelocityY(330);
        }
    }
}
