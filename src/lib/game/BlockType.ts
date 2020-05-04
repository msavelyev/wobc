export enum BlockType {

    EMPTY,
    BRICK,
    STONE,
    WATER,

}


export namespace BlockType {

    export function toString(blockType: BlockType) : string {
        switch (blockType) {
            case BlockType.EMPTY:
                return 'empty';
            case BlockType.BRICK:
                return 'brick';
            case BlockType.STONE:
                return 'stone';
            case BlockType.WATER:
                return 'water';
        }
    }

}
