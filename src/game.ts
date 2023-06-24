import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import {CastleDiceBoard} from "./Board.ts";
import {GameLogic} from "./GameLogic.ts";
import {Players} from "./game.config.ts";
import defaultSetup from './assets/defaultSetup.json';
import {ArraySerializer} from "./serializers.ts";

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

        const serializer = new ArraySerializer("blue");
        this.logic = new GameLogic(this.board, serializer.deserialize(defaultSetup));


        let cursors = this.input.keyboard!.createCursorKeys();
        this.cameraController = new Phaser.Cameras.Controls.SmoothedKeyControl({
            camera: this.cameras.main,

            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
        });
        this.logic.removePlayerTails();
        this.logic.removeOpponentTails();
        this.logic.start(Players.Player, 3);
        this.logic.highlightAvailableMoves();
        this.board.on('tileup', (pointer, tileXY) => {
            if (!this.logic.isMoveAvailable(tileXY.x, tileXY.y)) {
                return;
            }
            this.logic.placeChess(tileXY.x, tileXY.y);
            if (this.logic.actions > 0) {
                this.logic.highlightAvailableMoves();
            } else {
                this.logic.switchTurn(4)
                this.logic.removeHighlightAvailableMoves();
            }
        });
    }

    update(time: number, delta: number) {
        this.cameraController.update(delta);

        let pointer = this.input.activePointer;
        let out = this.board.worldXYToTileXY(pointer.worldX, pointer.worldY, true);
        this.print.setText(out.x + ',' + out.y);
    }

}
