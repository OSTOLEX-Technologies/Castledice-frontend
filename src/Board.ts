import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import Board from "phaser3-rex-plugins/plugins/board/board/Board";
import GameObject = Phaser.GameObjects.GameObject;
import Alpha = Phaser.GameObjects.Components.Alpha;


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
    constructor(scene, rexBoard: BoardPlugin) {
        super(scene, {
            grid: {
                gridType: 'quadGrid',
                x: window.innerWidth / 2,
                y: 100,
                cellWidth: 70,
                cellHeight: 60,
                type: 'isometric'  // 'orthogonal'|'isometric'
            },
            width: 10,
            height: 10
        });
        rexBoard.createTileTexture(this, 'tile', 0xffffff, 0xff0000, 3);
        rexBoard.createTileTexture(this, 'playerBase', 0x0000ff, 0xff0000, 2);
        rexBoard.createTileTexture(this, 'opponentBase', 0xff0000, 0xff0000, 2);
        this.forEachTileXY(function (tileXY, board) {
            if (tileXY.y === 0 && tileXY.x === 0) {
                board.addChess(
                    this.add.image(0, 0, 'opponentBase').setAlpha(0.5),
                    tileXY.x, tileXY.y, 0
                );
            }
            else if (tileXY.y === 9 && tileXY.x === 9) {
                board.addChess(
                    this.add.image(0, 0, 'playerBase').setAlpha(0.5),
                    tileXY.x, tileXY.y, 0
                );
            }
            else {
                board.addChess(
                    this.add.image(0, 0, 'tile').setAlpha(0.5),
                    tileXY.x, tileXY.y, 0
                );
            }
        }, scene).setInteractive()
        this.on('tileover', (pointer, tileXY) => {
            let tile  = this.tileXYZToChess(tileXY.x, tileXY.y, 0);
            if (tile) {
                tile.setAlpha(1)
            }
        })
            .on('tileout', (pointer, tileXY) => {
                var tile = this.tileXYZToChess(tileXY.x, tileXY.y, 0);
                if (tile) {
                    tile.setAlpha(0.5)
                }
            })
        // let points = this.getGridPoints();
    }
}