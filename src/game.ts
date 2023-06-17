export class PlayGame extends Phaser.Scene {
    image: Phaser.GameObjects.Image | null;
    constructor() {
        super("PlayGame");
        this.image = null;
    }
    preload() {
        this.load.image('logo', import.meta.env.BASE_URL + 'assets/sprites/phaser3-logo.png');
    }
    create() {
        this.image = this.add.image(400, 300, 'logo');
    }
    update() {
        this.image!.rotation += 0.01;
    }
}
