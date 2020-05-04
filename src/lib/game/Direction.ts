import {Key} from './Key';

export enum DirectionType {

    VERT,
    HORI,

}

export class Direction {

    private readonly degree: number;
    private readonly keys: Array<Key>;
    private readonly str: string;
    private readonly type: DirectionType;

    private static readonly KEYS: Map<Key, Direction> = new Map<Key, Direction>();

    constructor(degree: number, keys: Array<Key>, str: string, type: DirectionType) {
        this.degree = degree;
        this.keys = keys;
        this.str = str;
        this.type = type;

        for (let key of this.keys) {
            Direction.KEYS.set(key, this);
        }
    }

    getDegree() : number {
        return this.degree;
    }

    toString() : string {
        return this.str;
    }

    getType() : DirectionType {
        return this.type;
    }

    letter() : string {
        return this.str.charAt(0);
    }

    static fromKey(keycode: Key): Direction {
        if(Direction.KEYS.has(keycode)) {
            return Direction.KEYS.get(keycode);
        }
    }

    static fromStr(str: string) : Direction {
        switch(str) {
            case 'up':
                return Direction.UP;
            case 'down':
                return Direction.DOWN;
            case 'left':
                return Direction.LEFT;
            case 'right':
                return Direction.RIGHT;
            default:
                throw new Error("Unknown direction " + str);
        }
    }

    static readonly UP: Direction = new Direction(
        270, [Key.KEYCODE_W, Key.KEYCODE_UP], 'up', DirectionType.VERT
    );
    static readonly DOWN: Direction = new Direction(
        90, [Key.KEYCODE_S, Key.KEYCODE_DOWN], 'down', DirectionType.VERT
    );
    static readonly LEFT: Direction = new Direction(
        180, [Key.KEYCODE_A, Key.KEYCODE_LEFT], 'left', DirectionType.HORI
    );
    static readonly RIGHT: Direction = new Direction(
        0, [Key.KEYCODE_D, Key.KEYCODE_RIGHT], 'right', DirectionType.HORI
    );

}
