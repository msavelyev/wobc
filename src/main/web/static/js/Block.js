var Block = (function () {
    function Block(main, type, point, frames, animations) {
        this._main = main;
        this._type = type;
        this._point = point;
        this._frames = frames;
        this._animations = animations;
        
        this._image = new createjs.BitmapAnimation(new createjs.SpriteSheet({
            images: [main._spritesheet],
            frames: frames,
            animations: animations
        }));
        
        this._image.x = point.x;
        this._image.y = point.y;
        this._image.gotoAndPlay('first');
        
        this._main.addChild(this._image);
    };
    
    return Block;
})();

Block.ofType = function(main, point, type) {
    switch(type) {
        case BlockType.BRICK:
            return Block.BRICK(main, point);
        case BlockType.STONE:
            return Block.STONE(main, point);
        case BlockType.WATER:
            return Block.WATER(main, point);
        default:
            return null;
    }
};

Block.BRICK = function(main, point) {
    return new Block(
        main,
        BlockType.BRICK,
        point,
        [
            [16, 192, 16, 16, 0, 0, 0]
        ],
        {
            first: 0
        }
    );
};

Block.STONE = function(main, point) {
    return new Block(
        main,
        BlockType.STONE,
        point,
        [
            [32, 192, 16, 16, 0, 0, 0]
        ],
        {
            first: 0
        }
    );
};

Block.WATER = function(main, point) {
    return new Block(
        main,
        BlockType.WATER,
        point,
        [
            [0, 208, 16, 16, 0, 0, 0],
            [16, 208, 16, 16, 0, 0, 0]
        ],
        {
            first: {
                frames: [0, 1],
                frequency: 32
            }
        }
    );
};
