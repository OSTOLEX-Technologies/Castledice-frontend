import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import Board from "phaser3-rex-plugins/plugins/board/board/Board";
import GameObject = Phaser.GameObjects.GameObject;
import Alpha = Phaser.GameObjects.Components.Alpha;
import Pointer = Phaser.Input.Pointer;
import {TileXYType} from "phaser3-rex-plugins/plugins/board/types/Position";
import destroy = Phaser.Loader.FileTypesManager.destroy;
import {ChessType, Players} from "./game.config.ts";


class AlphaGameObject extends GameObject implements Alpha {
    alpha: number;
    alphaBottomLeft: number;
    alphaBottomRight: number;
    alphaTopLeft: number;
    alphaTopRight: number;

    clearAlpha(): this {
        return undefined;
    }

    setAlpha(topLeft?: number, topRight?: number, bottomLeft?: number, bottomRight?: number): this {
        return undefined;
    }
}

export class CastleDiceBoard extends Board<AlphaGameObject> {
    rexBoard: BoardPlugin;
    scale: number;

    constructor(scene, rexBoard: BoardPlugin) {
        const cellWidth = window.innerHeight * 0.13341804;
        const cellHeight = window.innerHeight * 0.07623888;
        super(scene, {
            grid: {
                gridType: 'quadGrid',
                x: window.innerWidth / 2,
                y: window.innerHeight / 4.5,
                cellWidth: cellWidth,
                cellHeight: cellHeight,
                type: 'isometric'  // 'orthogonal'|'isometric'
            },
            width: 10,
            height: 10
        });
        this.rexBoard = rexBoard;
        this.scale = 0.00171429 * cellWidth;
        this.setInteractive()
        this.on('tileover', (pointer: Pointer, tileXY) => {
            pointer.manager.setDefaultCursor('pointer');
        })
            .on('tileout', (pointer, tileXY) => {
                pointer.manager.setDefaultCursor('default');
            })
            .on('tileup', (pointer, tileXY) => {
                if (this.isBase(tileXY)) {
                    return;
                }
            })
    }

    public addPlayerBase(tileXY) {
        this.addChess(
            this.scene.add.image(0, 0, 'blueCastle').setAlpha(1).setScale(this.scale).setDepth(this.calculateDepth(tileXY)),
            tileXY.x, tileXY.y, ChessType.Base
        );
    }

    public addOpponentBase(tileXY) {
        this.addChess(
            this.scene.add.image(0, 0, 'redCastle').setAlpha(1).setScale(this.scale).setDepth(this.calculateDepth(tileXY)),
            tileXY.x, tileXY.y, ChessType.Base
        );
    }

    public addPlayerChess(tileXY) {
        this.addChess(
            this.scene.add.image(0, 0, 'knightBlue').setAlpha(1).setScale(this.scale).setDepth(this.calculateDepth(tileXY) + 1),
            tileXY.x, tileXY.y, ChessType.Occupy
        );
    }

    public addOpponentChess(tileXY) {
        this.addChess(
            this.scene.add.image(0, 0, 'knightRed').setAlpha(1).setScale(this.scale).setDepth(this.calculateDepth(tileXY) + 1),
            tileXY.x, tileXY.y, ChessType.Occupy
        );
    }

    public deleteChess(tileXY) {
        const chess = this.tileXYZToChess(tileXY.x, tileXY.y, ChessType.Occupy);
        if (chess) {
            // @ts-ignore
            this.removeChess(chess, tileXY.x, tileXY.y, ChessType.Occupy, true);
        }
    }

    public addTile(tileXY) {
        this.addChess(
            this.scene.add.image(0, 0, 'defaultTile').setAlpha(1).setScale(this.scale).setDepth(this.calculateDepth(tileXY)),
            tileXY.x, tileXY.y, ChessType.BoardPart
        );
    }

    public addTree(tileXY) {
        this.addChess(
            this.scene.add.image(0, 0, 'tree').setAlpha(1).setScale(this.scale).setDepth(this.calculateDepth(tileXY)),
            tileXY.x, tileXY.y, ChessType.Tree
        );
    }

    isBase(tileXY: TileXYType): boolean {
        return tileXY.x === 0 && tileXY.y === 0 || tileXY.x === 9 && tileXY.y === 9;
    }

    isOccupied(tileXY: TileXYType): boolean {
        return this.tileXYZToChess(tileXY.x, tileXY.y, ChessType.Occupy) !== null || this.isTree(tileXY);
    }

    isTree(tileXY: TileXYType): boolean {
        // @ts-ignore
        return this.tileXYZToChess(tileXY.x, tileXY.y, ChessType.Tree) !== null;
    }

    calculateDepth(tileXY: TileXYType): number {
        return tileXY.x > 1 && tileXY.y > 1 ? tileXY.x * tileXY.y : tileXY.x + tileXY.y;
    }

    highlightTile(tileXY: TileXYType): this {
        const textureName = this.isOccupied(tileXY) ? 'clashHighlighted' : 'highlightedTile';
        const texture = this.scene.add.image(0, 0, textureName)
            .setAlpha(0.4).setScale(this.scale).setDepth(this.calculateDepth(tileXY));
        this.addChess(texture, tileXY.x, tileXY.y, ChessType.Highlight, true);
        return this;
    }

    removeHighlight(tileXY: TileXYType): this {
        const chess = this.tileXYZToChess(tileXY.x, tileXY.y, 2);
        // @ts-ignore
        this.removeChess(chess, tileXY.x, tileXY.y, ChessType.Highlight, true);
        return this;
    }

    isHighlighted(tileXY: TileXYType): boolean {
        return this.tileXYZToChess(tileXY.x, tileXY.y, ChessType.Highlight) !== null;
    }
}