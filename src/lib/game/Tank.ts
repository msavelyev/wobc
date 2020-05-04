import {Point} from "./Point";
import {World} from "./World";
import {Direction, DirectionType} from "./Direction";
import {Bullet} from "./Bullet";
import {Tick, TickEvent} from "./Tick";

export class Tank implements Tick {

    readonly id: string;
    private readonly world: World;
    readonly playerId: string;
    private point: Point;
    private moving: boolean;
    private direction: Direction;

    constructor(world: World, point: Point, playerId: string, direction: Direction) {
        this.id = playerId;
        this.world = world;
        this.playerId = playerId;

        this.point = new Point();

        this.setPos(point);
        this.world.registerTick(this);

        this.moving = false;
        this.direction = direction;
    }

    tick(event: TickEvent) {
        if(this.moving) {
            const oldX = this.getX();
            const oldY = this.getY();

            const diff = event.delta / 1000 * 100;
            let newX = oldX;
            let newY = oldY;
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

            if(newX < this.getWidth() / 2) {
                newX = this.getWidth() / 2;
            }
            if(newY < this.getHeight() / 2) {
                newY = this.getHeight() / 2;
            }
            if(newX > this.world.width - World.BLOCK_SIZE / 2) {
                newX = this.world.width - World.BLOCK_SIZE / 2;
            }
            if(newY > this.world.height - World.BLOCK_SIZE / 2) {
                newY = this.world.height - World.BLOCK_SIZE / 2;
            }

            this.setPos(new Point(newX, newY));
            if(this.world.collidesWith(this)) {
                this.setPos(new Point(oldX, oldY));
            }
        }
    }

    isMoving() : boolean {
        return this.moving;
    }

    getPlayerId() : string {
        return this.playerId;
    }

    setX(x: number) {
        this.point.x = x;
    }

    setY(y: number) {
        this.point.y = y;
    }

    getX() : number {
        return this.point.x;
    }

    getY() : number {
        return this.point.y;
    }

    setPos(pos: Point) {
        this.point = pos.copy();
    }

    getWidth() : number {
        return World.BLOCK_SIZE;
    }

    getHeight() : number  {
        return World.BLOCK_SIZE;
    }

    getPos() : Point {
        return new Point(this.getX(), this.getY());
    }

    fixHorizontally() {
        this.setX(World.HALF_BLOCK_SIZE * Math.round(this.getX() / World.HALF_BLOCK_SIZE));
    }

    fixVertically() {
        this.setY(World.HALF_BLOCK_SIZE * Math.round(this.getY() / World.HALF_BLOCK_SIZE));
    }

    stopMoving() {
        this.moving = false;
    }

    rotate(direction: Direction) : boolean {
        let rotated = false;
        if(this.direction != direction || !this.moving) {
            this.direction = direction;

            switch(this.direction.getType()) {
                case DirectionType.VERT:
                    this.fixHorizontally();
                    break;
                case DirectionType.HORI:
                    this.fixVertically();
                    break;
                default:
                    throw 'Unknown direction type ' + this.direction.getType();
            }

            rotated = true;
        }
        this.moving = true;
        return rotated;
    }

    shoot() : Bullet {
        return new Bullet(this.world, this);
    }

    getDirection() : Direction {
        return this.direction;
    }

    remove() {
        this.world.unregisterTick(this);
    }

    setDirection(direction: Direction) {
        this.direction = direction;
    }

    setMoving(moving: boolean) {
        this.moving = moving;
    }
}
