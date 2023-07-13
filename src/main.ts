import 'phaser';
import "./style.css";
import { config } from './game.config';
import {getAbsoluteCoords, postMessage} from "./utils.ts";


const setupGame = (data: {type: string, playerColor: 'red' | 'blue', boardSetup: Array<number>, actionsCount: number, currentPlayer: 'red' | 'blue'}) => {
    config.playerColor = data.playerColor;
    config.boardSetup = data.boardSetup;
    config.actionsCount = data.actionsCount;
    config.currentPlayerColor = data.currentPlayer;
    new Phaser.Game(config);
    postMessage({ type: 'gameLoaded' })
}


window.addEventListener('message', (e) => {
    console.log(e.data)
    switch (e.data.type) {
        case 'setupGame':
            setupGame(e.data);
            break;
        case 'reinitBoard':
            window.dispatchEvent(new CustomEvent('reinitBoardInternal', { detail: e.data }));
            break;
        case 'updateActionsCount':
            window.dispatchEvent(new CustomEvent('updateActionsCountInternal', { detail: e.data }));
            break;
        case 'switchTurn':
            window.dispatchEvent(new CustomEvent('switchTurnInternal', { detail: e.data }));
            break;
        case 'moveFinished':
            window.dispatchEvent(new CustomEvent('moveFinishedInternal', { detail: e.data }));
    }
})

window.addEventListener('placeChessBatch', (e: CustomEvent) => {
    const lastMoves: Array<[number, number]> = e.detail.movesBatch;
    postMessage({
        type: 'makeMove',
        payload: lastMoves.map(([col, row]) => {
            // @ts-ignore
            const coords = getAbsoluteCoords(col, row, config.playerColor);
            return [coords.row, coords.col];
        }).flat(),
        actions: e.detail.actions
    });
})
