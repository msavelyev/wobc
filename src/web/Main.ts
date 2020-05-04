import {World} from "../lib/game/World";
import {DebugGrid} from "./renderer/DebugGrid";
import {Socket} from "./Socket";
import {Tank} from "../lib/game/Tank";
import {Tick, TickEvent} from "../lib/game/Tick";
import {Direction} from "../lib/game/Direction";
import {TankRenderer} from "./renderer/TankRenderer";
import {BulletRenderer} from "./renderer/BulletRenderer";
import {BlockRenderer} from "./renderer/BlockRenderer";
import 'createjs';
import {Key} from "../lib/game/Key";
import {Player} from "../lib/game/Player";

export class  Main {

    world: World;

    private readonly fps: createjs.Text;
    private readonly stage: createjs.Stage;
    private readonly ping: createjs.Text;
    private readonly ticks: Array<Tick> = [];

    private readonly tankRenderer: TankRenderer
    private readonly bulletRenderer: BulletRenderer;
    private readonly blockRenderer: BlockRenderer;

    private readonly grid: DebugGrid;
    private readonly spritesheet: Element;
    private readonly border: createjs.Shape;

    private tank: Tank;
    private playerId: string;

    private socket: Socket;
    private canvas: HTMLCanvasElement;

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.stage = new createjs.Stage(this.canvas);

        this.spritesheet = document.getElementById('spritesheet');

        this.world = new World(800, 576);
        this.registerTick(this.world);

        this.border = new createjs.Shape();
        this.border.graphics.beginStroke('white');
        this.border.graphics.drawRect(0, 0, 800, 576);
        this.stage.addChild(this.border);

        this.grid = new DebugGrid(this);

        this.fps = this.stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
        this.fps.lineHeight = 15;
        this.fps.x = this.canvas.width - 80;
        this.fps.y = 10;

        this.ping = this.stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
        this.ping.lineHeight = 15;
        this.ping.x = this.canvas.width - 80;
        this.ping.y = 25;

        this.tank = null;
        this.playerId = null;

        this.tankRenderer = new TankRenderer(this);
        this.bulletRenderer = new BulletRenderer(this);
        this.blockRenderer = new BlockRenderer(this);

        this.socket = new Socket(this);

        createjs.Ticker.addEventListener(
            'tick',
            event => {
                this.tick(event);
                this.ticks.forEach(tick => {
                    tick.tick(event);
                });
            }
        );
        createjs.Ticker.framerate = 60;

        document.onkeydown = e => {
            this._handleKeyDown(e);
        };
        document.onkeyup = e => {
            this._handleKeyUp(e);
        };
    }

    tick(event: TickEvent) {
        this.fps.text = '' + (Math.round(createjs.Ticker.getMeasuredFPS() * 100) / 100) + ' FPS';

        this.stage.update();
    }

    updatePing(latency: number) {
        this.ping.text = 'ping ' + latency + 'ms';
        this.stage.update();
    }

    addPlayer(player: Player) {
        if(player.id != this.playerId) {
            this.world.addTank(player.id, player.pos.x, player.pos.y, player.direction);
        }
    }

    sync(player: Player) {
        const tank = this.world.tanks.get(player.id);
        tank.setPos(player.pos);
        tank.setDirection(player.direction);
        tank.setMoving(player.moving);
    }

    createOwnTank(player: Player) {
        this.playerId = player.id;
        this.tank = this.world.addTank(
            player.id,
            player.pos.x,
            player.pos.y,
            player.direction
        );
    }

    stop() {
        //this.comet.disconnect(this.tank.getPlayerId());
    }

    collidesWith(entity: any): boolean {
        return this.world.collidesWith(entity);
    }

    getSpritesheet(): Element {
        return this.spritesheet;
    }

    getWidth(): number {
        return this.canvas.width;
    }

    getHeight(): number {
        return this.canvas.height;
    }

    addChild(child: createjs.DisplayObject) {
        this.stage.addChild(child);
    }

    addChildAt(child: createjs.DisplayObject, index: number) {
        this.stage.addChildAt(child, index);
    }

    removeChild(child: createjs.DisplayObject) {
        this.stage.removeChild(child);
    }

    removeChildAt(index: number) {
        this.stage.removeChildAt(index);
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

    _handleKeyDown(e: KeyboardEvent) {
        const playerId = this.tank.getPlayerId();

        switch (e.keyCode) {
            case Key.KEYCODE_SPACE:
                if(this.world.shoot(playerId)) {
                    this.socket.shoot();
                }
                e.preventDefault();
                return false;
            case Key.KEYCODE_A:
            case Key.KEYCODE_LEFT:
            case Key.KEYCODE_D:
            case Key.KEYCODE_RIGHT:
            case Key.KEYCODE_W:
            case Key.KEYCODE_UP:
            case Key.KEYCODE_S:
            case Key.KEYCODE_DOWN:
                const direction = Direction.fromKey(e.keyCode);
                if(this.tank.rotate(direction)) {
                    this.socket.rotate(direction);
                }
                e.preventDefault();
                return false;
        }
    }

    _handleKeyUp(e: KeyboardEvent) {
        //e = e || event;

        switch (e.keyCode) {
            case Key.KEYCODE_A:
            case Key.KEYCODE_LEFT:
            case Key.KEYCODE_D:
            case Key.KEYCODE_RIGHT:
            case Key.KEYCODE_W:
            case Key.KEYCODE_UP:
            case Key.KEYCODE_S:
            case Key.KEYCODE_DOWN:
                if (this.tank.getDirection() == Direction.fromKey(e.keyCode)) {
                    this.tank.stopMoving();
                    this.socket.stop();
                }
            case Key.KEYCODE_SPACE:
                e.preventDefault();
                return false;
        }
    }

    shoot(player: Player) {
        this.sync(player);
        this.world.shoot(player.id);
    }
}
