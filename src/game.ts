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
        this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'background').setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);

        let board = new CastleDiceBoard(this, this.rexBoard);
        board.setInteractive();

        this.board = board;
        this.actionsCount = this.add.text(0, this.sys.canvas.height - 32, '', {
            fontSize: '32px',
            color: '#fff'
        }).setScrollFactor(0);

        this.currentTurn = this.add.text(0, this.sys.canvas.height - 64, '', {
            fontSize: '32px',
            color: '#fff'
        }).setScrollFactor(0);

        this.add.image(0, 0, 'rules').setOrigin(0, 0).setScrollFactor(0).setDisplaySize(this.sys.canvas.width / 4, this.sys.canvas.height / 2);

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
            if (!this.logic.isMoveAvailable(tileXY.x, tileXY.y)) {
                return;
            }
            this.logic.placeChess(tileXY.x, tileXY.y);
            if (this.logic.actions > 0) {
                console.log("highlighting on moving");
                this.logic.highlightAvailableMoves();
            } else {
                this.logic.removeHighlightAvailableMoves();
            }
        });
        window.addEventListener('reinitBoardInternal', (e: CustomEvent) => {
            this.logic.updateBoard(this.serializer.deserialize(e.detail.setup));
            this.logic.actions = e.detail.actions;
        });
        window.addEventListener('updateActionsCountInternal' , (e: CustomEvent) => {
            this.logic.actions = e.detail.actions;
        });
        window.addEventListener('switchTurnInternal', (e: CustomEvent) => {
            console.log("switching turn", e.detail.actions, this.logic.turn, "player", Players.Player, "opponent", Players.Opponent);
            if (this.currentPlayerColor !== e.detail.currentPlayer) {
                this.logic.switchTurn(e.detail.actions);
            }
            console.log("switched turn", this.logic.turn, "player", Players.Player, "opponent", Players.Opponent);
            this.currentPlayerColor = this.currentPlayerColor === 'red' ? 'blue' : 'red';
            if (this.logic.turn === Players.Player) {
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

        if (this.logic.isGameFinished()) {
            this.scene.start('endScreen', {
                message: this.logic.getWinner() === Players.Player ? 'You won!' : 'You lost!'
            });
        }
    }

}
