import {TileState} from "./game.config.ts";

export const transpose = matrix => matrix[0].map((col, i) => matrix.map(row => row[i]));


export function invertBoardSetup(boardSetup: TileState[][]) {
    return boardSetup.map(row => row.map(cell => {
        if (cell === TileState.PlayerBase) return TileState.OpponentBase;
        if (cell === TileState.OpponentBase) return TileState.PlayerBase;
        if (cell === TileState.Player) return TileState.Opponent;
        if (cell === TileState.Opponent) return TileState.Player;
        return cell;
    }));
}


export function rotateBoardSetup(boardSetup: TileState[][]) {
    return transpose(transpose(boardSetup).map(row => row.reverse())).map(row => row.reverse());
}


export function getAbsoluteCoords(col, row, playerColor: 'red' | 'blue') {
    if (playerColor === 'blue') {
        return {row: 9 - row, col: 9 - col};
    } else {
        return {row: row, col: col};
    }
}

export function postMessage(message: any) {
    window.parent.postMessage(message, '*')
}
