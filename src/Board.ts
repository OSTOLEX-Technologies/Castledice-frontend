import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import Board from "phaser3-rex-plugins/plugins/board/board/Board";
import GameObject = Phaser.GameObjects.GameObject;
import Alpha = Phaser.GameObjects.Components.Alpha;
import Pointer = Phaser.Input.Pointer;
import {TileXYType} from "phaser3-rex-plugins/plugins/board/types/Position";
import destroy = Phaser.Loader.FileTypesManager.destroy;

enum TileZIndex {
    BoardPart = 0,
    Occupy = 1,
    Highlight = 2,
}

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

    constructor(scene, rexBoard: BoardPlugin) {
        super(scene, {
            grid: {
                gridType: 'quadGrid',
                x: window.innerWidth / 2,
                y: window.innerHeight / 5,
                cellWidth: 105,
                cellHeight: 60,
                type: 'isometric'  // 'orthogonal'|'isometric'
            },
            width: 10,
            height: 10
        });
        this.rexBoard = rexBoard;
        rexBoard.createTileTexture(this, 'tile', 0xffffff00, 0xff0000, 3);
        rexBoard.createTileTexture(this, 'playerBase', 0x0000ff, 0xff0000, 2);
        rexBoard.createTileTexture(this, 'opponentBase', 0xff0000, 0xff0000, 2);
        this.forEachTileXY((tileXY, board) => {
            if (tileXY.y === 0 && tileXY.x === 0) {
                board.addChess(
                    this.scene.add.image(0, 0, 'redCastle').setAlpha(1).setScale(0.18).setDepth(this.calculateDepth(tileXY)),
                    tileXY.x, tileXY.y, TileZIndex.BoardPart
                );
            }
            else if (tileXY.y === 9 && tileXY.x === 9) {
                board.addChess(
                    this.scene.add.image(0, 0, 'blueCastle').setAlpha(1).setScale(0.18).setDepth(this.calculateDepth(tileXY)),
                    tileXY.x, tileXY.y, TileZIndex.BoardPart
                );
            }
            else {
                board.addChess(
                    this.scene.add.image(0, 0, 'defaultTile').setAlpha(1).setScale(0.18).setDepth(this.calculateDepth(tileXY)),
                    tileXY.x, tileXY.y, TileZIndex.BoardPart
                );
            }
        }, scene).setInteractive()
        this.on('tileover', (pointer: Pointer, tileXY) => {
            pointer.manager.setDefaultCursor('pointer');
            // const tile  = this.tileXYZToChess(tileXY.x, tileXY.y, 0);
            // if (tile) {
            //     tile.setAlpha(1)
            // }
        })
            .on('tileout', (pointer, tileXY) => {
                pointer.manager.setDefaultCursor('default');
                // const tile = this.tileXYZToChess(tileXY.x, tileXY.y, 0);
                // if (tile) {
                //     tile.setAlpha(0.5)
                // }
            })
            .on('tileup', (pointer, tileXY) => {
                if (this.isBase(tileXY)) {
                    return;
                }
                // this.placeChess(tileXY, 'red');
                if (this.isHighlighted(tileXY)) {
                    this.removeHighlight(tileXY);
                } else {
                    this.highlightTile(tileXY);
                }
            })
    }

    isBase(tileXY: TileXYType): boolean {
        return tileXY.x === 0 && tileXY.y === 0 || tileXY.x === 9 && tileXY.y === 9;
    }

    isOccupied(tileXY: TileXYType): boolean {
        return this.tileXYZToChess(tileXY.x, tileXY.y, TileZIndex.Occupy) !== null;
    }

    isTree(tileXY: TileXYType): boolean {
        // @ts-ignore
        return this.tileXYToChessArray(tileXY.x, tileXY.y).map((chess) => chess.texture.key === 'tree').includes(true);
    }

    calculateDepth(tileXY: TileXYType): number {
        return tileXY.x > 1 && tileXY.y > 1 ? tileXY.x * tileXY.y : tileXY.x + tileXY.y;
    }

    placeChess(tileXY: TileXYType, color: 'red' | 'blue'): this {
        // TODO: add chess of specific color to the board
        const chip = this.scene.add.image(0, 0, 'tree')
            .setAlpha(1).setDepth(this.calculateDepth(tileXY));
        chip.scale = 0.18;
        this.addChess(chip, tileXY.x, tileXY.y, TileZIndex.Occupy, true);
        return this;
    }

    highlightTile(tileXY: TileXYType): this {
        const texture = this.scene.add.image(0, 0, 'highlightedTile')
            .setAlpha(0.4).setScale(0.18).setDepth(this.calculateDepth(tileXY));
        this.addChess(texture, tileXY.x, tileXY.y, 2, true);
        return this;
    }

    removeHighlight(tileXY: TileXYType): this {
        const chess = this.tileXYZToChess(tileXY.x, tileXY.y, 2);
        // @ts-ignore
        this.removeChess(chess, tileXY.x, tileXY.y, 2, true);
        return this;
    }

    isHighlighted(tileXY: TileXYType): boolean {
        return this.tileXYZToChess(tileXY.x, tileXY.y, 2) !== null;
    }
}