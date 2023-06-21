import {Game} from "./game.ts";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import {Preload} from "./Preload.ts";

export const config = {
    type: Phaser.AUTO,
    parent: 'gameRoot',
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Preload, Game],
    plugins: {
        scene: [{
            key: 'rexBoard',
            plugin: BoardPlugin,
            mapping: 'rexBoard'
        }]
    }
};

export const images = {
    "background": import.meta.env.BASE_URL + "assets/terrain.png",
    "test": import.meta.env.BASE_URL + "assets/sprites/test.png",
    "defaultTile": import.meta.env.BASE_URL + "assets/sprites/tiles/Tile.png",
    "redCastle": import.meta.env.BASE_URL + "assets/sprites/tiles/Red castle.png",
    "tree": import.meta.env.BASE_URL + "assets/sprites/tiles/Tree.png",
    "blueCastle": import.meta.env.BASE_URL + "assets/sprites/tiles/Blue castle.png",
    "highlightedTile": import.meta.env.BASE_URL + "assets/sprites/tiles/Highlighted tile.png",
}

export const sounds = {

}

export enum ChessType {
    BoardPart = 0,
    Base = 1,
    Highlight = 2,
    Occupy = 3,
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
