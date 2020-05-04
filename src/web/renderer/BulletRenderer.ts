import {Main} from "../Main";
import {Direction} from "../../lib/game/Direction";
import {Tick, TickEvent} from "../../lib/game/Tick";
import {Explode} from "./Explode";
import 'createjs';
import {Bullet} from "../../lib/game/Bullet";

export class BulletRenderer implements Tick {

    private readonly main: Main;
    private readonly bullets: Map<string, Bullet>;
    private readonly images: Map<string, createjs.Bitmap>;

    constructor(main: Main) {
        this.main = main;
        this.main.registerTick(this);

        this.bullets = new Map<string, Bullet>();
        this.images = new Map<string, createjs.Bitmap>();
    };

    private createBullet(id: string, bullet: Bullet) {
        const image = new createjs.Bitmap(this.main.getSpritesheet());

        let x, y, width, height, regX, regY;
        switch(bullet.getDirection()) {
            case Direction.UP:
                x = 96; y = 192; width = 6; height = 8; regX = 3; regY = 4;
                break;
            case Direction.DOWN:
                x = 96; y = 208; width = 6; height = 8; regX = 3; regY = 4;
                break;
            case Direction.LEFT:
                x = 112; y = 192; width = 8; height = 6; regX = 4; regY = 3;
                break;
            case Direction.RIGHT:
                x = 112; y = 208; width = 8; height = 6; regX = 4; regY = 3;
                break;
        }
        image.sourceRect = new createjs.Rectangle(x, y, width, height);

        image.regX = regX;
        image.regY = regY;

        this.main.addChild(image);
        this.images.set(id, image);
        this.bullets.set(id, bullet);
    }

    private removeBullet(id: string) {
        const bullet = this.bullets.get(id);
        const image = this.images.get(id);

        this.bullets.delete(id);
        this.images.delete(id);

        this.main.removeChild(image);
        new Explode(this.main, bullet.getPos());
    }

    tick(event: TickEvent) {
        const mainBullets = this.main.world.bullets;
        const mainBulletsIds = Array.from(mainBullets.values()).map(bullet => {
            return bullet.id;
        });

        const newBullets = mainBulletsIds.filter(id => {
            return !this.bullets.has(id);
        });
        const oldBullets = Array.from(this.bullets.keys()).filter(id => {
            return mainBulletsIds.indexOf(id) < 0;
        });

        newBullets.forEach(id => {
            this.createBullet(id, Array.from(mainBullets.values()).find(bullet => {
                return bullet.id == id;
            }));
        });

        oldBullets.forEach(id => {
            this.removeBullet(id);
        });


        Array.from(this.images.keys()).forEach(id => {
            const image = this.images.get(id);
            const bullet = this.bullets.get(id);

            image.x = bullet.getX();
            image.y = bullet.getY();
        });
    }

}
