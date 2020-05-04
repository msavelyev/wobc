import './BlockHelper';

import {Bullet} from './Bullet';
import {Tank} from './Tank';
import {BlockType} from './BlockType';
import {Point} from "./Point";
import guid from "../guid";
import {BlockHelper, BlockSubtype} from "./BlockHelper";


type CollideFunc = (block: Block, entity: any, corners: any) => boolean;

export class Block {

    readonly id: string;
    readonly type: BlockType;
    private readonly point: Point;
    private readonly collideFunc: CollideFunc;
    subtype: BlockSubtype;

    constructor(type: BlockType, point: Point, collideFunc: CollideFunc) {
        this.id = guid();
        this.type = type;
        this.point = point;
        this.collideFunc = collideFunc;
        this.subtype = BlockSubtype.DEFAULT;
    }

    getX() : number {
        return this.point.x;
    }

    getY() : number {
        return this.point.y;
    }

    collidesWith(entity: any, corners: any) : boolean {
        return this.collideFunc(this, entity, corners);
    }

    getPos() : Point {
        return new Point(this.point.x, this.point.y);
    }

    static ofType(point: Point, type: any) {
        switch (type) {
            case BlockType.EMPTY:
                return Block.EMPTY(point);
            case BlockType.BRICK:
                return Block.BRICK(point);
            case BlockType.STONE:
                return Block.STONE(point);
            case BlockType.WATER:
                return Block.WATER(point);
            default:
                throw "Unknown type " + type;
        }
    }

    static EMPTY(point: Point) : Block {
        return new Block(
            BlockType.EMPTY,
            point,
            () => false
        );
    }

    static BRICK(point: Point) : Block {
        return new Block(
            BlockType.BRICK,
            point,
            (block, entity, corners) => {
                if (block.subtype == BlockSubtype.NONE) {
                    return false;
                } else if (entity instanceof Tank) {
                    return true;
                }

                let collides = false;

                const bounds = BlockHelper.BRICK.subtypeBounds.get(block.subtype);
                const pos = block.getPos();

                const tl = new Point(pos.x + bounds.x, pos.y + bounds.y);
                const br = new Point(pos.x + bounds.x + bounds.width, pos.y + bounds.y + bounds.height);
                for (let i = 0; i < corners.length; i++) {
                    const c = corners[i];
                    if (c.x >= tl.x && c.x <= br.x && c.y >= tl.y && c.y <= br.y) {
                        collides = true;
                        break;
                    }
                }

                if (collides && entity instanceof Bullet) {
                    block.subtype = BlockHelper.BRICK.transitions.get(block.subtype)
                        .get(entity.getDirection());
                    return true;
                } else {
                    return false;
                }

            }
        );
    }

    static STONE(point: Point) : Block {
        return new Block(
            BlockType.STONE,
            point,
            () => true
        );
    }

    static WATER(point: Point) : Block {
        return new Block(
            BlockType.WATER,
            point,
            (entity) => entity instanceof Tank
        );
    }

}
