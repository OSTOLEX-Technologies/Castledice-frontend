import {Game} from "./game.ts";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import {Preload} from "./Preload.ts";
import defaultSetup from './assets/defaultSetup.json';
import {EndScreen} from "./EndScreen.ts";

export const config = {
    type: Phaser.AUTO,
    parent: 'gameRoot',
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Preload, Game, EndScreen],
    plugins: {
        scene: [{
            key: 'rexBoard',
            plugin: BoardPlugin,
            mapping: 'rexBoard'
        }]
    },
    playerColor: 'red',
    currentPlayerColor: 'red',
    boardSetup: defaultSetup,
    actionsCount: 0,
    tiles: []
};

export const images = {
    "background": import.meta.env.BASE_URL + "assets/terrain.png",
    "test": import.meta.env.BASE_URL + "assets/sprites/test.png",
    "defaultTile": import.meta.env.BASE_URL + "assets/sprites/tiles/Tile.png",
    "tile1": import.meta.env.BASE_URL + "assets/sprites/tiles/Tile1.png",
    "tile2": import.meta.env.BASE_URL + "assets/sprites/tiles/Tile2.png",
    "tile3": import.meta.env.BASE_URL + "assets/sprites/tiles/Tile3.png",
    "tile4": import.meta.env.BASE_URL + "assets/sprites/tiles/Tile4.png",
    "tile5": import.meta.env.BASE_URL + "assets/sprites/tiles/Tile5.png",
    "redCastle": import.meta.env.BASE_URL + "assets/sprites/tiles/Red castle.png",
    "tree": import.meta.env.BASE_URL + "assets/sprites/tiles/Tree.png",
    "blueCastle": import.meta.env.BASE_URL + "assets/sprites/tiles/Blue castle.png",
    "highlightedTile": import.meta.env.BASE_URL + "assets/sprites/tiles/Highlighted tile.png",
    "clashHighlighted": import.meta.env.BASE_URL + "assets/sprites/tiles/Clash.png",
    "knightRed": import.meta.env.BASE_URL + "assets/sprites/units/Knight red.png",
    "knightBlue": import.meta.env.BASE_URL + "assets/sprites/units/Knight blue.png",
    "menuBackground": import.meta.env.BASE_URL + "assets/Menu and loading screen background.png",
    "rules": import.meta.env.BASE_URL + "assets/Rules.png",
}

export const sounds = {

}

export enum ChessType {
    BoardPart = 0,
    Base = 1,
    Highlight = 2,
    Occupy = 3,
    Tree = 4,
}

export enum TileState {
    Empty = 0,
    Player = 1, // red player
    Opponent = 2, // blue player
    Tree = 3,
    PlayerBase = 4,
    OpponentBase = 5,
}

export enum Players {
    Player = 0,
    Opponent = 1,
}


export const CLASH_ACTIONS = 3;
export const OCCUPY_EMPTY_ACTIONS = 1;


const tiles_types = ['defaultTile', 'tile1', 'tile2', 'tile3', 'tile4', 'tile5'];
for (let i = 0; i < 10; i++) {
    let row = []
    for (let j = 0; j < 10; j++) {
        row.push(tiles_types[Math.floor(Math.random() * tiles_types.length)]);
    }
    config.tiles.push(row);
}