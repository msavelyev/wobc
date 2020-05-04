import {Point} from "../../lib/game/Point";
import {Main} from "../Main";
import 'createjs';
import {Tick, TickEvent} from "../../lib/game/Tick";

export class Explode implements Tick {

    private readonly main: Main;
    private readonly image: createjs.Sprite;

    constructor(main: Main, point: Point) {
        this.main = main;
        this.image = new createjs.Sprite(new createjs.SpriteSheet({
            images: [main.getSpritesheet()],
            frames: [
                [256, 192, 32, 32, 0, 16, 16],
                [288, 192, 32, 32, 0, 16, 16],
                [320, 192, 32, 32, 0, 16, 16],
                [320, 224, 32, 32, 0, 16, 16]
            ],
            animations: {
                first: {
                    frames: [0, 1, 2, 3],
                    speed: 0.33
                }
            }
        }));

        this.image.x = point.x;
        this.image.y = point.y;
        this.image.gotoAndPlay('first');

        this.main.addChild(this.image);
        this.main.registerTick(this);
    }

    tick(event: TickEvent) {
        if(this.image.currentFrame == 3) {
            this.main.removeChild(this.image);
            this.main.unregisterTick(this);
            this.image.stop();
        }
    }

}
