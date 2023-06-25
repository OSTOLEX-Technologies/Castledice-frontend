import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import {CastleDiceBoard} from "./Board.ts";
import {GameLogic} from "./GameLogic.ts";
import {config, Players} from "./game.config.ts";
import {ArraySerializer} from "./serializers.ts";

const Random = Phaser.Math.Between;


export class Game extends Phaser.Scene {
    rexBoard: BoardPlugin;
    board: CastleDiceBoard;
    actionsCount: Phaser.GameObjects.Text;
    currentTurn: Phaser.GameObjects.Text;
    cameraController: Phaser.Cameras.Controls.SmoothedKeyControl;
    logic: GameLogic;
    playerColor: 'red' | 'blue' = 'blue';
    currentPlayerColor: 'red' | 'blue' = 'blue';
    canMove: boolean = true;
    serializer: ArraySerializer;

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
        this.actionsCount = this.add.text(0, 32, '', {
            fontSize: '32px',
            color: '#000'
        }).setScrollFactor(0);

        this.currentTurn = this.add.text(0, 0, '', {
            fontSize: '32px',
            color: '#000'
        }).setScrollFactor(0);

        this.playerColor = config.playerColor as 'red' | 'blue';
        this.currentPlayerColor = config.currentPlayerColor as 'red' | 'blue';
        this.serializer = new ArraySerializer(this.playerColor);
        this.logic = new GameLogic(this.board, this.serializer.deserialize(config.boardSetup));


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
        this.logic.start(this.playerColor === this.currentPlayerColor ? Players.Player : Players.Opponent, config.actionsCount);
        this.logic.highlightAvailableMoves();
        this.board.on('tileup', (pointer, tileXY) => {
            if (!this.logic.isMoveAvailable(tileXY.x, tileXY.y) || !this.canMove) {
                return;
            }
            this.logic.placeChess(tileXY.x, tileXY.y);
            this.canMove = false;
            if (this.logic.actions > 0) {
                this.logic.highlightAvailableMoves();
            } else {
                this.logic.removeHighlightAvailableMoves();
            }
        });
        window.addEventListener('moveFinishedInternal', (e) => {
            this.canMove = true;
        });
        window.addEventListener('reinitBoardInternal', (e: CustomEvent) => {
            this.logic.updateBoard(this.serializer.deserialize(e.detail.setup));
            this.logic.actions = e.detail.actions;
        });
        window.addEventListener('updateActionsCountInternal' , (e: CustomEvent) => {
            this.logic.actions = e.detail.actions;
        });
        window.addEventListener('switchTurnInternal', (e: CustomEvent) => {
            this.logic.switchTurn(e.detail.actions);
            this.currentPlayerColor = this.currentPlayerColor === 'red' ? 'blue' : 'red';
            if (this.currentPlayerColor === this.playerColor) {
                this.logic.highlightAvailableMoves();
            }
        });
    }

    update(time: number, delta: number) {
        this.cameraController.update(delta);
        this.actionsCount.setText(`Actions left: ${this.logic.actions}`);
        if (this.logic.turn === Players.Player) {
            this.currentTurn.setText(`Your turn`);
        } else {
            this.currentTurn.setText(`Opponent turn`);
        }
    }

}
