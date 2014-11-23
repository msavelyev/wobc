var Block = (function () {
    function Block(main, type, point, frames, animations, collideFunc) {
        this._main = main;
        this._type = type;
        this._point = point;
        this._frames = frames;
        this._animations = animations;
        this._collideFunc = collideFunc;
        
        this._image = new createjs.Sprite(new createjs.SpriteSheet({
            images: [main.getSpritesheet()],
            frames: frames,
            animations: animations
        }));
        
        this._image.x = point.x;
        this._image.y = point.y;
        this._image.gotoAndPlay('first');

        this._main.addChild(this._image);

    }

    Block.prototype.tick = function(event) {
        this._image.updateCache();
    };
    
    Block.prototype._updateFrames = function(frames) {
        this._image = new createjs.Sprite(new createjs.SpriteSheet({
            images: [this._main.getSpritesheet()],
            frames: frames,
            animations: this._animations
        }));

        this._image.x = this._point.x;
        this._image.y = this._point.y;
        this._image.gotoAndPlay('first');

        this._main.addChild(this._image);
    };
    
    Block.prototype.collidesWith = function(entity, corners) {
        return this._collideFunc.apply(this, [entity, corners]);
    };
    
    Block.prototype.getPos = function() {
        return new createjs.Point(this._point.x, this._point.y);
    };

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
    
    var helper = {
        full: [16, 192, 16, 16, 0,  0,  0],
        u:    [16, 192, 16,  8, 0,  0,  0],
        d:    [16, 200, 16,  8, 0,  0, -8],
        l:    [16, 192,  8, 16, 0,  0,  0],
        r:    [24, 192,  8, 16, 0, -8,  0],
        ul:   [16, 192,  8,  8, 0,  0,  0],
        ur:   [24, 192,  8,  8, 0, -8,  0],
        dl:   [16, 200,  8,  8, 0,  0, -8],
        dr:   [24, 200,  8,  8, 0, -8, -8],
        none: null
    };
    
    // Я знаю, это все можно сделать компактнее.
    // Но пусть останется так, во имя читабельности.
    var transitions = {
        full: {
            left:   'l',
            right:  'r',
            up:     'u',
            down:   'd'
        },
        u: {
            left:   'ul',
            right:  'ur',
            up:     'none',
            down:   'none'
        },
        d: {
            left:   'dl',
            right:  'dr',
            up:     'none',
            down:   'none'
        },
        l: {
            left:   'none',
            right:  'none',
            up:     'ul',
            down:   'dl'
        },
        r: {
            left:   'none',
            right:  'none',
            up:     'ur',
            down:   'dr'
        },
        ul: { left: 'none', right: 'none', up: 'none', down: 'none' },
        ur: { left: 'none', right: 'none', up: 'none', down: 'none' },
        dl: { left: 'none', right: 'none', up: 'none', down: 'none' },
        dr: { left: 'none', right: 'none', up: 'none', down: 'none' }
    };

    Block.BRICK = function(main, point) {
        var block = new Block(
            main,
            BlockType.BRICK,
            point,
            [helper.full],
            {first: 0},
            function (entity, corners) {
                if(this._type == 'none') {
                    return false;
                } else if(entity instanceof Tank) {
                    return true;
                }
                
                var collides = false;

                var bounds = this._image.spriteSheet.getFrameBounds(this._image.currentFrame);
                var pos = this.getPos();

                var tl = new createjs.Point(pos.x + bounds.x, pos.y + bounds.y);
                var br = new createjs.Point(pos.x + bounds.x + bounds.width, pos.y + bounds.y + bounds.height);
                for(var i = 0; i < corners.length; i++) {
                    var c = corners[i];
                    if(c.x >= tl.x && c.x <= br.x && c.y >= tl.y && c.y <= br.y) {
                        collides = true;
                        break;
                    }
                }
                
                if(collides && entity instanceof Bullet) {
                    this._image.stop();
                    this._main.removeChild(this._image);
                    console.log(this._type, entity.getDirection().toString());

                    var newType = transitions[this._type][entity.getDirection().toString()];
                    this._type = newType;
                    if(newType != 'none') {
                        this._updateFrames([helper[newType]]);
                    }
                    
                    return true;
                } else {
                    return false;
                }
                
            }
        );
        block._type = 'full';
        
        return block;
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
                    speed: 0.03125
                }
            },
            function(entity) {
                return entity instanceof Tank;
            }
        );
    };
    
    return Block;
})();

