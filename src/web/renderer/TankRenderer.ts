import {Main} from "../Main";
import {World} from "../../lib/game/World";
import {Tank} from "../../lib/game/Tank";
import 'createjs';
import {Tick, TickEvent} from "../../lib/game/Tick";
import {Direction} from "../../lib/game/Direction";

export class TankRenderer implements Tick{

    private readonly main: Main;
    private readonly tanks: Map<string, Tank> = new Map<string, Tank>();
    private readonly images: Map<string, createjs.Sprite> = new Map<string, createjs.Sprite>();
    private readonly tanksDirections: Map<string, Direction> = new Map<string, Direction>();

    constructor(main: Main) {
        this.main = main;

        this.main.registerTick(this);
    }

    private createTank(tank: Tank) {
        const id = tank.id;

        const image = new createjs.Sprite(new createjs.SpriteSheet({
            images: [this.main.getSpritesheet()],
            frames: [
                [0, 224, 32, 32, 0, 16, 16],
                [32, 224, 32, 32, 0, 16, 16],
                [64, 224, 32, 32, 0, 16, 16],
                [96, 224, 32, 32, 0, 16, 16],
                [128, 224, 32, 32, 0, 16, 16],
                [160, 224, 32, 32, 0, 16, 16],
                [192, 224, 32, 32, 0, 16, 16],
                [224, 224, 32, 32, 0, 16, 16]
            ],
            animations: {
                up: {
                    frames: [0, 1],
                    frequency: 0.25
                },
                right: {
                    frames: [2, 3],
                    frequency: 0.25
                },
                down: {
                    frames: [4, 5],
                    frequency: 0.25
                },
                left: {
                    frames: [6, 7],
                    frequency: 0.25
                }
            }
        }));

        image.gotoAndStop('right');
        image.filters = [
            new createjs.ColorFilter(.9, .9, 0, 1, 0, 0, 0)
        ];

        image.cache(
            -World.HALF_BLOCK_SIZE,
            -World.HALF_BLOCK_SIZE,
            World.BLOCK_SIZE,
            World.BLOCK_SIZE
        );
        image.updateCache();

        this.main.addChild(image);

        this.images.set(id, image);
        this.tanks.set(id, tank);
        this.tanksDirections.set(id, tank.getDirection());
    }

    private removeTank(id: string) {
        const image = this.images.get(id);
        image.stop();
        this.main.removeChild(image);

        this.tanks.delete(id);
        this.images.delete(id);
    }

    tick(event: TickEvent) {
        const mainTanks = this.main.world.tanks;
        const mainTanksIds = Array.from(mainTanks.values()).map(tank => {
            return tank.id;
        });
        const newTanks = mainTanksIds.filter(id => {
            return !this.tanks.has(id);
        });
        const oldTanks = Array.from(this.tanks.keys()).filter(id => {
            return mainTanksIds.indexOf(id) < 0;
        });

        newTanks.forEach(id => {
            this.createTank(mainTanks.get(id));
        });

        oldTanks.forEach(id => {
            this.removeTank(id);
        });

        Array.from(mainTanks.keys()).forEach(id => {
            const image = this.images.get(id);
            const tank = mainTanks.get(id);
            const direction = this.tanksDirections.get(id);

            image.x = tank.getX();
            image.y = tank.getY();

            if(tank.isMoving()) {
                image.updateCache();
                if(image.paused || direction != tank.getDirection()) {
                    this.tanksDirections.set(id, tank.getDirection());
                    image.gotoAndPlay(tank.getDirection().toString());
                }
            } else {
                image.stop();
            }
        });
    }
}
