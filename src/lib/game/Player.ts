import {Point} from "./Point";
import {Direction} from "./Direction";
import {Tank} from "./Tank";

export type PlayerId = string;

export class Player {

    id: string;
    moving: boolean;
    pos: Point;
    direction: Direction;

    constructor(id: string, moving: boolean, pos: Point, direction: Direction) {
        this.id = id;
        this.moving = moving;
        this.pos = pos;
        this.direction = direction;
    }

    static fromTank(tank: Tank) : Player {
        return new Player(
            tank.playerId,
            tank.isMoving(),
            tank.getPos(),
            tank.getDirection()
        )
    }

}
