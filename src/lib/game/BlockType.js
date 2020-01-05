define(function() {
    var BlockType = {
        EMPTY: 0,
        BRICK: 1,
        STONE: 2,
        WATER: 3,

        toString: function (blockType) {
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
    };
    return BlockType
});
