import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import Vector3 = Phaser.Math.Vector3;
import GameObject = Phaser.GameObjects.GameObject;
import Pointer = Phaser.Input.Pointer;
import {CastleDiceBoard} from "./Board.ts";
import {TileXYType} from "phaser3-rex-plugins/plugins/board/types/Position";
import {GameLogic} from "./GameLogic.ts";

const Random = Phaser.Math.Between;


export class Game extends Phaser.Scene {
    rexBoard: BoardPlugin;
    board: CastleDiceBoard;
    print: Phaser.GameObjects.Text;
    cameraController: Phaser.Cameras.Controls.SmoothedKeyControl;
    logic: GameLogic;

    constructor() {
        super({
            key: 'mainScreen'
        })
    }

    preload() { }

    create() {
        this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'background').setOrigin(0, 0);

        let board = new CastleDiceBoard(this, this.rexBoard);
        board.setInteractive();

        this.board = board;
        this.print = this.add.text(0, 0, '').setScrollFactor(0);
        this.logic = new GameLogic(this.board);


        let cursors = this.input.keyboard!.createCursorKeys();
        this.cameraController = new Phaser.Cameras.Controls.SmoothedKeyControl({
            camera: this.cameras.main,

            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
        });
    }

    update(time: number, delta: number) {
        this.cameraController.update(delta);

        let pointer = this.input.activePointer;
        let out = this.board.worldXYToTileXY(pointer.worldX, pointer.worldY, true);
        this.print.setText(out.x + ',' + out.y);
    }

}
