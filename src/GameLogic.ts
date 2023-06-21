import {CastleDiceBoard} from "./Board.ts";
import {Players, TileState} from "./game.config.ts";
import {TileXYType} from "phaser3-rex-plugins/plugins/board/types/Position";


export class GameLogic {
    private readonly cells: Array<Array<TileState>>; // every array is a column, every element is a row
    private isHighlighted = false;

    constructor(public board: CastleDiceBoard, public turn: Players = Players.Player, setup?: Array<Array<TileState>>) {
        this.cells = new Array<Array<TileState>>(10);

        if (setup) {
            this.cells = setup.map(row => row.map(cell => cell));
        } else {
            for (let i = 0; i < 10; i++) {
                this.cells[i] = new Array<TileState>(10);
                for (let j = 0; j < 10; j++) {
                    if (i === 0 && j === 0)
                        this.cells[i][j] = TileState.OpponentBase;
                    else if (i === 9 && j === 9)
                        this.cells[i][j] = TileState.PlayerBase;
                    else this.cells[i][j] = TileState.Empty;
                }
            }
        }
        this.initBoard()
    }

    public initBoard() {
        this.board.forEachTileXY((tileXY, board) => {
            const {x, y} = tileXY;
            const tileState = this.cells[x][y];
            if (tileState === TileState.PlayerBase) {
                this.board.addPlayerBase(tileXY);
            } else if (tileState === TileState.OpponentBase) {
                this.board.addOpponentBase(tileXY);
            } else if (tileState === TileState.Player) {
                this.board.addTile(tileXY);
                this.board.addPlayerChess(tileXY);
            } else if (tileState === TileState.Opponent) {
                this.board.addTile(tileXY);
                this.board.addOpponentChess(tileXY);
            } else if (tileState === TileState.Empty) {
                this.board.addTile(tileXY);
            } else if (tileState === TileState.Tree) {
                this.board.addTree(tileXY);
            }
        });
    }

    public switchTurn() {
        this.turn = this.turn === Players.Player ? Players.Opponent : Players.Player;
    }

    public getCell(x: number, y: number): number {
        return this.cells[x][y];
    }

    public isMoveAvailable(x: number, y: number): boolean {
        if (this.turn !== Players.Player) return false;

        // Player can only move from his base to an empty tile or to an opponent tile
        // Player can only move to a tile that is adjacent to his base or another tile that he owns
        // Player base is located on (9, 9)

        if (this.cells[x][y] !== TileState.Empty) return false;
    }


    public isBoardHighlighted(): boolean {
        return this.isHighlighted;
    }

    public highlightAvailableMoves(actions: number) {
        if (this.turn !== Players.Player) return;

        const availableMoves = this.findAvailableMoves(actions);
        availableMoves.forEach((move) => {
            this.board.highlightTile(move satisfies TileXYType);
        });
        this.isHighlighted = true;
    }

    public removeHighlightAvailableMoves() {
        if (this.turn !== Players.Player) return;

        this.board.forEachTileXY((tileXY, board) => {
            this.board.removeHighlight(tileXY);
        });
        this.isHighlighted = false;
    }

    public findAvailableMoves(actions: number) : Array<{x: number, y: number}> {
        if (this.turn !== Players.Player) throw new Error("It's not your turn!");

        const availableMoves = new Array<{x: number, y: number}>();
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (this.cells[i][j] === TileState.PlayerBase || this.cells[i][j] === TileState.Player) {
                    for (let neighbour of this.findNeighbours(i, j)) {
                        if (neighbour.state === TileState.Empty ||
                            (neighbour.state === TileState.Opponent && actions >= 3)) {
                            if (!availableMoves.find(move => move.x === neighbour.x && move.y === neighbour.y))
                                availableMoves.push({x: neighbour.x, y: neighbour.y});
                        }
                    }
                }
            }
        }
        return availableMoves;
    }

    private findNeighbours(x: number, y: number): Array<{x: number, y: number, state: TileState}> {
        const neighbours = new Array<{x: number, y: number, state: TileState}>();

        if (x === 0 && y === 0) {
            neighbours.push({x: 0, y: 1, state: this.cells[0][1]});
            neighbours.push({x: 1, y: 0, state: this.cells[1][0]});
            neighbours.push({x: 1, y: 1, state: this.cells[1][1]})
        }
        else if (x === 9 && y === 9) {
            neighbours.push({x: 8, y: 8, state: this.cells[8][8]});
            neighbours.push({x: 8, y: 9, state: this.cells[8][9]});
            neighbours.push({x: 9, y: 8, state: this.cells[9][8]});
        } else if (x === 0 && y === 9) {
            neighbours.push({x: 0, y: 8, state: this.cells[0][8]});
            neighbours.push({x: 1, y: 8, state: this.cells[1][8]});
            neighbours.push({x: 1, y: 9, state: this.cells[1][9]});
        } else if (x === 9 && y === 0) {
            neighbours.push({x: 8, y: 0, state: this.cells[8][0]});
            neighbours.push({x: 8, y: 1, state: this.cells[8][1]});
            neighbours.push({x: 9, y: 1, state: this.cells[9][1]});
        } else if (x === 0) {
            neighbours.push({x: 0, y: y - 1, state: this.cells[0][y - 1]});
            neighbours.push({x: 0, y: y + 1, state: this.cells[0][y + 1]});
            neighbours.push({x: 1, y: y - 1, state: this.cells[1][y - 1]});
            neighbours.push({x: 1, y: y, state: this.cells[1][y]});
            neighbours.push({x: 1, y: y + 1, state: this.cells[1][y + 1]});
        } else if (x === 9) {
            neighbours.push({x: 9, y: y - 1, state: this.cells[9][y - 1]});
            neighbours.push({x: 9, y: y + 1, state: this.cells[9][y + 1]});
            neighbours.push({x: 8, y: y - 1, state: this.cells[8][y - 1]});
            neighbours.push({x: 8, y: y, state: this.cells[8][y]});
            neighbours.push({x: 8, y: y + 1, state: this.cells[8][y + 1]});
        } else if (y === 0) {
            neighbours.push({x: x - 1, y: 0, state: this.cells[x - 1][0]});
            neighbours.push({x: x + 1, y: 0, state: this.cells[x + 1][0]});
            neighbours.push({x: x - 1, y: 1, state: this.cells[x - 1][1]});
            neighbours.push({x: x, y: 1, state: this.cells[x][1]});
            neighbours.push({x: x + 1, y: 1, state: this.cells[x + 1][1]});
        } else if (y === 9) {
            neighbours.push({x: x - 1, y: 9, state: this.cells[x - 1][9]});
            neighbours.push({x: x + 1, y: 9, state: this.cells[x + 1][9]});
            neighbours.push({x: x - 1, y: 8, state: this.cells[x - 1][8]});
            neighbours.push({x: x, y: 8, state: this.cells[x][8]});
            neighbours.push({x: x + 1, y: 8, state: this.cells[x + 1][8]});
        } else {
            neighbours.push({x: x - 1, y: y - 1, state: this.cells[x - 1][y - 1]});
            neighbours.push({x: x - 1, y: y, state: this.cells[x - 1][y]});
            neighbours.push({x: x - 1, y: y + 1, state: this.cells[x - 1][y + 1]});
            neighbours.push({x: x, y: y - 1, state: this.cells[x][y - 1]});
            neighbours.push({x: x, y: y + 1, state: this.cells[x][y + 1]});
            neighbours.push({x: x + 1, y: y - 1, state: this.cells[x + 1][y - 1]});
            neighbours.push({x: x + 1, y: y, state: this.cells[x + 1][y]});
            neighbours.push({x: x + 1, y: y + 1, state: this.cells[x + 1][y + 1]});
        }
        return neighbours;
    }

    public forEachCell(callback: (x: number, y: number, state: number) => void) {
        for (let i = 0; i < 10; i++)
            for (let j = 0; j < 10; j++)
                callback(i, j, this.cells[i][j]);
    }
}