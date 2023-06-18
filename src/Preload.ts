import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import {CastleDiceBoard} from "./Board.ts";
import {config, images} from "./game.config.ts";

export class Preload extends Phaser.Scene {
    constructor() {
        super({
            key: 'preloadScene'
        })
    }

    preload() {
        for (let key in images) {
            this.load.image(key, images[key]);
        }
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();


        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const progressBoxWidth = 320;
        const progressBoxHeight = 50;
        const progressBarWidth = 300;
        const progressBarHeight = 30;

        const loadingText = this.make.text({
            x: screenWidth / 2,
            y: screenHeight / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                color: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: screenWidth / 2,
            y: screenHeight / 2 + 50,
            text: '0%',
            style: {
                font: '18px monospace',
                color: '#ffffff'
            }
        });

        percentText.setOrigin(0.5, 0.5);

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect((screenWidth - progressBoxWidth) / 2, (screenHeight - progressBoxHeight) / 2,
            progressBoxWidth, progressBoxHeight);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(String(value * 100)) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect((screenWidth - progressBarWidth) / 2, (screenHeight - progressBarHeight) / 2,
                progressBarWidth * value, progressBarHeight);
        });

        this.load.on('fileprogress', function (file) {
            loadingText.text = 'Loading ' + file.key + '...';
        });
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }

    create() {
        this.scene.start('mainScreen');
    }

    update(time: number, delta: number) { }

}
