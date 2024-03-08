import Phaser from "phaser";

export default class Main3 extends Phaser.Scene {
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private player?: Phaser.Physics.Arcade.Sprite;
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private shields?: Phaser.Physics.Arcade.StaticGroup;
    private PlayerX: number;
    private PlayerY: number;

    constructor() {
        super({ key: "Main3" });
    }

    init(data: { PlayerX: number; PlayerY: number }) {
        this.PlayerX = data.PlayerX;
        this.PlayerY = data.PlayerY;
    }

    create() {
        this.add
            .image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "winter"
            )
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        this.platforms = this.physics.add.staticGroup();
        const ground = this.platforms.create(
            630,
            568,
            "ground"
        ) as Phaser.Physics.Arcade.Sprite;
        ground.setScale(2).refreshBody();

        this.platforms.create(1250, 100, "ground").setScale(0.4).refreshBody();
        this.platforms.create(50, 400, "ground").setScale(0.5).refreshBody();
        this.platforms.create(300, 250, "ground").setScale(0.35).refreshBody();
        this.platforms.create(535, 105, "ground").setScale(0.2).refreshBody();
        this.platforms.create(800, 325, "ground").setScale(0.35).refreshBody();
        const rotatedPlatform = this.platforms.create(
            1075,
            200,
            "ground"
        ) as Phaser.Physics.Arcade.Sprite;
        rotatedPlatform.setScale(0.5).refreshBody();

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
            1250,
            70,
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

        this.scene.start("Main4", { PlayerX, PlayerY });
    }

    update() {
        if (!this.cursors) {
            return;
        }
        if (this.cursors.left.isDown) {
            this.player?.setVelocityX(-160);
            this.player?.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player?.setVelocityX(160);
            this.player?.anims.play("right", true);
        } else {
            this.player?.setVelocityX(0);
            this.player?.anims.play("turn");
        }
        if (this.cursors.up.isDown && this.player?.body?.touching.down) {
            this.player.setVelocityY(-300);
        } else if (this.cursors.down.isDown) {
            this.player?.setVelocityY(300);
        }
    }
}
