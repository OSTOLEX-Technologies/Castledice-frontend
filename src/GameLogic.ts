import {CastleDiceBoard} from "./Board.ts";
import {CLASH_ACTIONS, OCCUPY_EMPTY_ACTIONS, Players, TileState} from "./game.config.ts";
import {TileXYType} from "phaser3-rex-plugins/plugins/board/types/Position";


export class GameLogic {
    private cells: Array<Array<TileState>>; // every array is a column, every element is a row
    private isHighlighted = false;
    public actions: number;
    public turn = Players.Player;

    constructor(public board: CastleDiceBoard, setup?: Array<Array<TileState>>) {
        this.cells = new Array<Array<TileState>>(10);
        if (setup) {
            this.cells = setup.map(row => row.map(cell => cell));
        } else {
            this.cells = new Array<Array<TileState>>(10);
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
        this.updateBoard(this.cells.map(row => row.map(cell => cell)));
    }

    public initBoard(setup? : Array<Array<TileState>>) {
        this.board.removeAllChess(true);

        const newSetup = setup !== undefined ? setup : this.cells;

        this.board.forEachTileXY((tileXY, board) => {
            const {x, y} = tileXY;
            const tileState = newSetup[x][y];
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

    public updateBoard(setup: Array<Array<TileState>>) {
        for (let i = 0; i < 10; i++) {
            this.cells[i] = new Array<TileState>(10);
            for (let j = 0; j < 10; j++) {
                this.cells[i][j] = setup[i][j];
            }
        }

        this.initBoard(setup);
    }

    public start(turn: Players, actions: number) {
        this.turn = turn;
        this.actions = actions;
    }

    public switchTurn(actions: number) {
        this.turn = this.turn === Players.Player ? Players.Opponent : Players.Player;
        this.actions = actions;
    }

    public getCell(x: number, y: number): number {
        return this.cells[x][y];
    }

    public isGameFinished(): boolean {
        return this.cells[0][0] !== TileState.OpponentBase || this.cells[9][9] !== TileState.PlayerBase;
    }

    public getWinner(): Players | null {
        if (this.cells[0][0] !== TileState.OpponentBase) return Players.Player;
        if (this.cells[9][9] !== TileState.PlayerBase) return Players.Opponent;
        return null;
    }

    public isMoveAvailable(x: number, y: number): boolean {
        if (this.turn !== Players.Player) return false;

        // Player can only move from his base to an empty tile or to an opponent tile
        // Player can only move to a tile that is adjacent to his base or another tile that he owns
        // Player base is located on (9, 9)

        return (this.cells[x][y] === TileState.Empty && this.actions >= OCCUPY_EMPTY_ACTIONS || ((this.cells[x][y] === TileState.Opponent || this.cells[x][y] === TileState.OpponentBase) && this.actions >= CLASH_ACTIONS)) &&
        this.findNeighbours(x, y).some((tile) => tile.state === TileState.PlayerBase || tile.state === TileState.Player);
    }

    public placeChess(x: number, y: number) {
        if (this.turn !== Players.Player) throw new Error("It's not your turn!");
        if (!this.isMoveAvailable(x, y)) throw new Error("You can't move there!");

        if (this.cells[x][y] === TileState.Opponent || this.cells[x][y] === TileState.OpponentBase) {
            this.board.deleteChess({x, y});
            this.actions -= CLASH_ACTIONS;
        } else {
            this.actions -= OCCUPY_EMPTY_ACTIONS;
        }
        this.cells[x][y] = TileState.Player;
        this.board.addPlayerChess({x, y});
        this.removeOpponentTails();
        window.dispatchEvent(new CustomEvent('placeChess', {detail: {x, y, actions: this.actions}}));
    }

    public isBoardHighlighted(): boolean {
        return this.isHighlighted;
    }

    public highlightAvailableMoves() {
        this.removeHighlightAvailableMoves();
        if (this.turn !== Players.Player) return;

        const availableMoves = this.findAvailableMoves();
        availableMoves.forEach((move) => {
            this.board.highlightTile(move satisfies TileXYType);
        });
        this.isHighlighted = true;
    }

    public removeHighlightAvailableMoves() {
        this.board.forEachTileXY((tileXY, board) => {
            this.board.removeHighlight(tileXY);
        });
        this.isHighlighted = false;
    }

    public removeOpponentTails() {
        const isConnected = (col1: number, row1: number, col2: number, row2: number): boolean => {
            // Check if the fields are adjacent or diagonal
            return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1 &&
                this.cells[col1][row1] === TileState.Opponent || this.cells[col1][row1] === TileState.OpponentBase && this.cells[col2][row2] === TileState.Opponent;

        }

        const connectedFields: boolean[][] = []; // Matrix to store the connected fields

        // Initialize the connectedFields matrix with false
        for (let i = 0; i < 10; i++) {
            connectedFields[i] = [];
            for (let j = 0; j < 10; j++) {
                connectedFields[i][j] = false;
            }
        }

        // Depth-first search to mark connected fields
        const dfs = (col: number, row: number): void => {
            connectedFields[col][row] = true;

            // Check the adjacent fields
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;

                    // Skip out-of-bounds fields and the current field
                    if (
                        newCol >= 0 && newCol < 10 &&
                        newRow >= 0 && newRow < this.cells[newCol].length &&
                        (newCol !== col || newRow !== row) &&
                        !connectedFields[newCol][newRow]
                    ) {
                        // Check if the fields are connected
                        if (isConnected(col, row, newCol, newRow)) {
                            dfs(newCol, newRow);
                        }
                    }
                }
            }
        }

        // Start the depth-first search from the opponent's base
        dfs(0, 0);

        // Remove unconnected branches for the opponent
        for (let col = 0; col < 10; col++) {
            for (let row = 0; row < this.cells[col].length; row++) {
                if (this.cells[col][row] === TileState.Opponent && !connectedFields[col][row]) {
                    this.cells[col][row] = TileState.Empty; // Set the unconnected opponent fields to empty
                    this.board.deleteChess({x: col, y: row});
                }
            }
        }

    }

    public removePlayerTails() {
        const isConnected = (col1: number, row1: number, col2: number, row2: number): boolean => {
            // Check if the fields are adjacent or diagonal
            return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1 &&
                this.cells[col1][row1] === TileState.Player || this.cells[col1][row1] === TileState.PlayerBase && this.cells[col2][row2] === TileState.Player;

        }

        const connectedFields: boolean[][] = []; // Matrix to store the connected fields

        // Initialize the connectedFields matrix with false
        for (let i = 0; i < 10; i++) {
            connectedFields[i] = [];
            for (let j = 0; j < 10; j++) {
                connectedFields[i][j] = false;
            }
        }

        // Depth-first search to mark connected fields
        const dfs = (col: number, row: number): void => {
            connectedFields[col][row] = true;

            // Check the adjacent fields
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row - i;
                    const newCol = col - j;

                    // Skip out-of-bounds fields and the current field
                    if (
                        newCol >= 0 && newCol < 10 &&
                        newRow >= 0 && newRow < this.cells[newCol].length &&
                        (newCol !== col || newRow !== row) &&
                        !connectedFields[newCol][newRow]
                    ) {
                        // Check if the fields are connected
                        if (isConnected(col, row, newCol, newRow)) {
                            dfs(newCol, newRow);
                        }
                    }
                }
            }
        }

        // Start the depth-first search from the opponent's base
        dfs(9, 9);

        // Remove unconnected branches for the opponent
        for (let col = 0; col < 10; col++) {
            for (let row = 0; row < this.cells[col].length; row++) {
                if (this.cells[col][row] === TileState.Player && !connectedFields[col][row]) {
                    this.cells[col][row] = TileState.Empty; // Set the
                    this.board.deleteChess({x: col, y: row});
                }
            }
        }
    }

    public findAvailableMoves() : Array<{x: number, y: number}> {
        if (this.turn !== Players.Player) throw new Error("It's not your turn!");

        const availableMoves = new Array<{x: number, y: number}>();
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (this.cells[i][j] === TileState.PlayerBase || this.cells[i][j] === TileState.Player) {
                    for (let neighbour of this.findNeighbours(i, j)) {
                        if (neighbour.state === TileState.Empty ||
                            (neighbour.state === TileState.Opponent && this.actions >= CLASH_ACTIONS)) {
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

        const dependencies = [
            [x - 1, y - 1],
            [x - 1, y],
            [x - 1, y + 1],
            [x, y - 1],
            [x, y + 1],
            [x + 1, y - 1],
            [x + 1, y],
            [x + 1, y + 1]
        ]

        for (let dependency of dependencies) {
            if (dependency[0] >= 0 && dependency[0] < 10 && dependency[1] >= 0 && dependency[1] < 10) {
                neighbours.push({
                    x: dependency[0],
                    y: dependency[1],
                    state: this.cells[dependency[0]][dependency[1]]
                });
            }
        }
        return neighbours;
    }

    public forEachCell(callback: (x: number, y: number, state: number) => void) {
        for (let i = 0; i < 10; i++)
            for (let j = 0; j < 10; j++)
                callback(i, j, this.cells[i][j]);
    }
}