
export class EndScreen extends Phaser.Scene {
    constructor() {
        super({
            key: 'endScreen'
        })
    }

    init(data: any) {
        this.data.set('message', data.message);
    }

    create() {
        const background = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'menuBackground');
        background.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
        // @ts-ignore
        this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.data.get('message'), {
            fontSize: '100px',
            color: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.4);
    }
}
