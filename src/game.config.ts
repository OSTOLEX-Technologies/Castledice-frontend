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
}

export const sounds = {

}
