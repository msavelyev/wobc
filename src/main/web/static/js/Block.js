var Block = (function () {
    function Block(main, type, point, frames, animations, collideFunc) {
        this._main = main;
        this._type = type;
        this._point = point;
        this._frames = frames;
        this._animations = animations;
        this._collideFunc = collideFunc;
        
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
    
    Block.prototype.collidesWith = function(entity) {
        return this._collideFunc(entity);
    };
    
    return Block;
})();

Block.ofType = function(main, point, type) {
    switch(type) {
        case BlockType.EMPTY:
            return Block.EMPTY(main, point);
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

Block.EMPTY = function(main, point) {
    return new Block(
        main,
        BlockType.EMPTY,
        point,
        [[0, 192, 16, 16, 0, 0, 0]],
        {first: 0},
        function() {
            return false;
        }
    );
};

Block.BRICK = function(main, point) {
    return new Block(
        main,
        BlockType.BRICK,
        point,
        [[16, 192, 16, 16, 0, 0, 0]],
        {first: 0},
        function() {
            return true;
        }
    );
};

Block.STONE = function(main, point) {
    return new Block(
        main,
        BlockType.STONE,
        point,
        [[32, 192, 16, 16, 0, 0, 0]],
        {first: 0},
        function() {
            return true;
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
        },
        function(entity) {
            return entity instanceof Tank;
        }
    );
};
