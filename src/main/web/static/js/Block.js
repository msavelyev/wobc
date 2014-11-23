var Block = (function () {
    var Block = function(main, type, point, collideFunc) {
        this._id = guid();
        this._main = main;
        this._type = type;
        this._point = point;
        this._collideFunc = collideFunc;
        this._subtype = 'default';
    };

    Block.prototype.getX = function() {
        return this._point.x;
    };

    Block.prototype.getY = function() {
        return this._point.y;
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
            function (entity, corners) {
                if (this._subtype == 'none') {
                    return false;
                } else if (entity instanceof Tank) {
                    return true;
                }

                var collides = false;

                var bounds = BlockHelper.brick.subtypeBounds[this._subtype];
                var pos = this.getPos();

                var tl = new createjs.Point(pos.x + bounds.x, pos.y + bounds.y);
                var br = new createjs.Point(pos.x + bounds.x + bounds.width, pos.y + bounds.y + bounds.height);
                for (var i = 0; i < corners.length; i++) {
                    var c = corners[i];
                    if (c.x >= tl.x && c.x <= br.x && c.y >= tl.y && c.y <= br.y) {
                        collides = true;
                        break;
                    }
                }

                if (collides && entity instanceof Bullet) {
                    console.log(this._subtype, entity.getDirection().toString());

                    this._subtype = BlockHelper.brick.transitions[this._subtype][entity.getDirection().toString()];
                    return true;
                } else {
                    return false;
                }

            }
        );
    };

    Block.STONE = function(main, point) {
        return new Block(
            main,
            BlockType.STONE,
            point,
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
            function(entity) {
                return entity instanceof Tank;
            }
        );
    };
    
    return Block;
})();

