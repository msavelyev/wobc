import {Direction} from "./Direction";
import {BlockType} from "./BlockType";

export class Bounds {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

export enum BlockSubtype {

    DEFAULT,
    U,
    D,
    L,
    R,
    UL,
    UR,
    DL,
    DR,
    NONE,

}

export class BlockConfiguration {
    frames: Map<BlockSubtype, Array<Array<number>>>;
    animations: {};
    transitions: Map<BlockSubtype, Map<Direction, BlockSubtype>>;
    subtypeBounds: Map<BlockSubtype, Bounds>;

    constructor(
        frames: Map<BlockSubtype, Array<Array<number>>>,
        animations: {},
        transitions: Map<BlockSubtype, Map<Direction, BlockSubtype>>,
        subtypeBounds: Map<BlockSubtype, Bounds>
    ) {
        this.frames = frames;
        this.animations = animations;
        this.transitions = transitions;
        this.subtypeBounds = subtypeBounds;
    }
}

export class BlockHelper {

    public static readonly BRICK = new BlockConfiguration(
        new Map<BlockSubtype, Array<Array<number>>>([
            [BlockSubtype.DEFAULT, [[16, 192, 16, 16, 0,  0,  0]]],
            [BlockSubtype.U,       [[16, 192, 16,  8, 0,  0,  0]]],
            [BlockSubtype.D,       [[16, 200, 16,  8, 0,  0, -8]]],
            [BlockSubtype.L,       [[16, 192,  8, 16, 0,  0,  0]]],
            [BlockSubtype.R,       [[24, 192,  8, 16, 0, -8,  0]]],
            [BlockSubtype.UL,      [[16, 192,  8,  8, 0,  0,  0]]],
            [BlockSubtype.UR,      [[24, 192,  8,  8, 0, -8,  0]]],
            [BlockSubtype.DL,      [[16, 200,  8,  8, 0,  0, -8]]],
            [BlockSubtype.DR,      [[24, 200,  8,  8, 0, -8, -8]]],
            [BlockSubtype.NONE,    [null]]
        ]),
        {first: 0},
        new Map<BlockSubtype, Map<Direction, BlockSubtype>>([
            [BlockSubtype.DEFAULT, new Map<Direction, BlockSubtype>([
                [Direction.LEFT, BlockSubtype.L],
                [Direction.RIGHT, BlockSubtype.R],
                [Direction.UP, BlockSubtype.U],
                [Direction.DOWN, BlockSubtype.D]
            ])],
            [BlockSubtype.U, new Map<Direction, BlockSubtype>([
                [Direction.LEFT, BlockSubtype.UL],
                [Direction.RIGHT, BlockSubtype.UR],
                [Direction.UP, BlockSubtype.NONE],
                [Direction.DOWN, BlockSubtype.NONE]
            ])],
            [BlockSubtype.D, new Map<Direction, BlockSubtype>([
                [Direction.LEFT, BlockSubtype.DL],
                [Direction.RIGHT, BlockSubtype.DR],
                [Direction.UP, BlockSubtype.NONE],
                [Direction.DOWN, BlockSubtype.NONE]
            ])],
            [BlockSubtype.L, new Map<Direction, BlockSubtype>([
                [Direction.LEFT, BlockSubtype.NONE],
                [Direction.RIGHT, BlockSubtype.NONE],
                [Direction.UP, BlockSubtype.UL],
                [Direction.DOWN, BlockSubtype.DL]
            ])],
            [BlockSubtype.R, new Map<Direction, BlockSubtype>([
                [Direction.LEFT, BlockSubtype.NONE],
                [Direction.RIGHT, BlockSubtype.NONE],
                [Direction.UP, BlockSubtype.UR],
                [Direction.DOWN, BlockSubtype.DR]
            ])],
            [BlockSubtype.UL, new Map<Direction, BlockSubtype>([
                [Direction.LEFT, BlockSubtype.NONE],
                [Direction.RIGHT, BlockSubtype.NONE],
                [Direction.UP, BlockSubtype.NONE],
                [Direction.DOWN, BlockSubtype.NONE]
            ])],
            [BlockSubtype.UR, new Map<Direction, BlockSubtype>([
                [Direction.LEFT, BlockSubtype.NONE],
                [Direction.RIGHT, BlockSubtype.NONE],
                [Direction.UP, BlockSubtype.NONE],
                [Direction.DOWN, BlockSubtype.NONE]
            ])],
            [BlockSubtype.DL, new Map<Direction, BlockSubtype>([
                [Direction.LEFT, BlockSubtype.NONE],
                [Direction.RIGHT, BlockSubtype.NONE],
                [Direction.UP, BlockSubtype.NONE],
                [Direction.DOWN, BlockSubtype.NONE]
            ])],
            [BlockSubtype.DR, new Map<Direction, BlockSubtype>([
                [Direction.LEFT, BlockSubtype.NONE],
                [Direction.RIGHT, BlockSubtype.NONE],
                [Direction.UP, BlockSubtype.NONE],
                [Direction.DOWN, BlockSubtype.NONE]
            ])]
        ]),
        new Map<BlockSubtype, Bounds>([
            [BlockSubtype.DEFAULT, new Bounds(0, 0, 16, 16)],
            [BlockSubtype.U, new Bounds(0, 0, 16, 8)],
            [BlockSubtype.D, new Bounds(0, 8, 16, 8)],
            [BlockSubtype.L, new Bounds(0, 0, 8, 16)],
            [BlockSubtype.R, new Bounds(8, 0, 8, 16)],
            [BlockSubtype.UL, new Bounds(0, 0, 8, 8)],
            [BlockSubtype.UR, new Bounds(8, 0, 8, 8)],
            [BlockSubtype.DL, new Bounds(0, 8, 8, 8)],
            [BlockSubtype.DR, new Bounds(8, 8, 8, 8)]
        ])
    );

    public static readonly STONE = new BlockConfiguration(
        new Map<BlockSubtype, Array<Array<number>>>([
            [BlockSubtype.DEFAULT, [[32, 192, 16, 16, 0, 0, 0]]]
        ]),
        {first: 0},
        null,
        null
    );

    public static readonly EMPTY = new BlockConfiguration(
        new Map<BlockSubtype, Array<Array<number>>>([
            [BlockSubtype.DEFAULT, [[0, 192, 16, 16, 0, 0, 0]]]
        ]),
        {first: 0},
        null,
        null
    );

    public static readonly WATER = new BlockConfiguration(
        new Map<BlockSubtype, Array<Array<number>>>([
            [BlockSubtype.DEFAULT, [
                [0, 208, 16, 16, 0, 0, 0],
                [16, 208, 16, 16, 0, 0, 0]
            ]]
        ]),
        {
            first: {
                frames: [0, 1],
                speed: 0.03125
            }
        },
        null,
        null
    );

    public static forType(type: BlockType): BlockConfiguration {
        switch (type) {
            case BlockType.BRICK:
                return this.BRICK;
            case BlockType.EMPTY:
                return this.EMPTY;
            case BlockType.WATER:
                return this.WATER;
            case BlockType.STONE:
                return this.STONE;
            default:
                throw 'Unknown type ' + type;
        }
    }
}
