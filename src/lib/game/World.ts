import {Bullet} from "./Bullet";
import {Block} from "./Block";
import {Point} from "./Point";
import {BlockType} from "./BlockType";
import {Tick, TickEvent} from "./Tick";
import {Tank} from "./Tank";
import {Direction} from "./Direction";
import {Player} from "./Player";

import * as _ from 'lodash';

export class World implements Tick {

    width: number;
    height: number;

    level: Array<Array<Block>> = [];
    private ticks: Array<Tick> = [];
    readonly bullets: Map<string, Bullet> = new Map<string, Bullet>();
    readonly tanks: Map<string, Tank> = new Map<string, Tank>();

    static readonly BLOCK_SIZE = 32;
    static readonly HALF_BLOCK_SIZE = World.BLOCK_SIZE / 2;
    static readonly Q_BLOCK_SIZE = World.HALF_BLOCK_SIZE / 2;

    constructor(width: number, height: number) {
        const level = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 2, 2, 2, 0, 3, 3, 3, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            [0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        this.width = width;
        this.height = height;

        // чтоб не забыть потом опять: эта хуйня рисует по четыре блока на один физический
        for(let x = 0; x < this.width / World.HALF_BLOCK_SIZE; x++) {
            this.level[x] = [];

            for(let y = 0; y < this.height / World.HALF_BLOCK_SIZE; y++) {
                const lX = Math.floor(x / 2);
                const lY = Math.floor(y / 2);
                if (lX < level.length && lY < level[lX].length && level[lY][lX]) {
                    this.level[x][y] = Block.ofType(
                        new Point(x * World.HALF_BLOCK_SIZE, y * World.HALF_BLOCK_SIZE),
                        level[lY][lX]
                    );
                } else {
                    this.level[x][y] = Block.ofType(
                        new Point(x * World.HALF_BLOCK_SIZE, y * World.HALF_BLOCK_SIZE),
                        BlockType.EMPTY
                    );
                }
            }
        }
    }

    tick(event: TickEvent) {
        this.ticks.forEach(function (tick) {
            tick.tick(event);
        });
    }

    addTank(playerId: string, x: number, y: number, direction: Direction) : Tank {
        console.debug('adding tank', playerId);
        const tank = new Tank(this, new Point(x, y), playerId, direction);
        this.tanks.set(playerId, tank);
        return tank;
    }

    removeTank (playerId: string) {
        const tank = this.tanks.get(playerId);
        tank.remove();
        this.tanks.delete(playerId);
    }

    addBullet(bullet: Bullet, playerId: string) {
        this.bullets.set(playerId, bullet);
    }

    removeBullet(playerId: string) {
        this.bullets.delete(playerId);
    }

    shoot(playerId: string) : boolean {
        if(!this.bullets.has(playerId)) {
            const tank = this.tanks.get(playerId);
            tank.shoot();
            return true;
        } else {
            return false;
        }
    }

    registerTick(tick: Tick) {
        this.ticks.push(tick);
    }

    unregisterTick(tick: Tick) {
        const index = this.ticks.indexOf(tick);
        if (index >= 0) {
            this.ticks.splice(index, 1);
        }
    }

    collidesWith(entity: any): boolean {
        const pointToBlockPos = function(point: any) {
            return {
                x: Math.floor(point.x / World.HALF_BLOCK_SIZE),
                y: Math.floor(point.y / World.HALF_BLOCK_SIZE)
            }
        }

        const p = entity.getPos();
        const w = entity.getWidth() - 1;
        const h = entity.getHeight() - 1;
        const topLeft = new Point(p.x - w / 2, p.y - h / 2);
        const topRight = new Point(p.x + w / 2, p.y - h / 2);
        const bottomLeft = new Point(p.x - w / 2, p.y + h / 2);
        const bottomRight = new Point(p.x + w / 2, p.y + h / 2);

        const corners = [topLeft, topRight, bottomLeft, bottomRight];

        const tl = pointToBlockPos(topLeft);
        const tr = pointToBlockPos(topRight);
        const bl = pointToBlockPos(bottomLeft);
        const br = pointToBlockPos(bottomRight);

        /*if(!(
                this._level[tl.x]
             && this._level[tr.x]
             && this._level[bl.x]
             && this._level[br.x]
             && this._level[tl.x][tl.y]
             && this._level[tr.x][tr.y]
             && this._level[bl.x][bl.y]
             && this._level[br.x][br.y]
            ) || entity instanceof Bullet) {
            console.log('entity.pos', entity.getPos());
            var cStr = function (c) {
                return '' + c.x + ';' + c.y;
            }
            console.log('corners', _.map([topLeft, topRight, bottomLeft, bottomRight], cStr));
            console.log('crnrs', _.map([tl, tr, bl, br], cStr));
            console.log('bullet', entity instanceof Bullet);
        }*/

        return this.level[tl.x][tl.y].collidesWith(entity, corners)
            || this.level[tr.x][tr.y].collidesWith(entity, corners)
            || this.level[bl.x][bl.y].collidesWith(entity, corners)
            || this.level[br.x][br.y].collidesWith(entity, corners);
    }

    getTank(playerId: string) {
        return this.tanks.get(playerId);
    }

    getPlayer(playerId: string) {
        const tank = this.tanks.get(playerId);
        return Player.fromTank(tank);
    }

    getPlayers() {
        return _.map(_.keys(this.tanks), playerId => {
            return this.getPlayer(playerId);
        });
    }

}

