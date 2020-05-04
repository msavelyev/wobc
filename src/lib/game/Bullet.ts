import {Direction} from './Direction';
import {Point} from './Point';
import {Tank} from './Tank';
import {World} from './World';

import guid from '../guid';
import {Tick, TickEvent} from "./Tick";

export class Bullet implements Tick {

    readonly id: string;
    private readonly world: World;
    private readonly tank: Tank;
    private readonly direction: Direction;
    private point: Point;

    private readonly width: number;
    private readonly height: number;

    constructor(world: World, tank: Tank) {
        this.id = guid();
        this.world = world;
        this.tank = tank;
        this.direction = tank.getDirection();

        let width, height;
        switch(this.direction) {
            case Direction.UP:
            case Direction.DOWN:
                width = 6; height = 8;
                break;
            case Direction.LEFT:
            case Direction.RIGHT:
                width = 8; height = 6;
                break;
        }

        this.width = width;
        this.height = height;

        this.point = tank.getPos().copy();

        this.world.registerTick(this);
        this.world.addBullet(this, this.tank.getPlayerId());
    }

    getWidth() : number {
        return this.width;
    }

    getHeight() : number {
        return this.height;
    }

    setX(x: number) {
        this.point.x = x;
    }

    setY(y: number) {
        this.point.y = y;
    }

    getX() {
        return this.point.x;
    }

    getY() {
        return this.point.y;
    }

    setPos(point: Point) {
        this.point = point.copy();
    }

    getPos() : Point {
        return this.point.copy();
    }

    tick(event: TickEvent) {
        const diff = event.delta / 1000 * 400;

        const x = this.getX();
        const y = this.getY();
        let newY = y;
        let newX = x;
        const w = this.width;
        const h = this.height;

        switch(this.direction) {
            case Direction.DOWN:
                newY += diff;
                break;
            case Direction.UP:
                newY -= diff;
                break;
            case Direction.RIGHT:
                newX += diff;
                break;
            case Direction.LEFT:
                newX -= diff;
                break;
        }

        if(y - h / 2 < 0
            || x - w / 2 < 0
            || x + w / 2 > this.world.width
            || y + h / 2 > this.world.height
            || this.world.collidesWith(this)
        ) {
            this.world.unregisterTick(this);
            this.world.removeBullet(this.tank.getPlayerId());
        } else {
            this.setPos(new Point(newX, newY));
        }
    }

    getDirection() : Direction {
        return this.direction;
    }
}
