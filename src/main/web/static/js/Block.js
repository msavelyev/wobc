define(
    ['require', 'BlockType', 'guid', 'Bullet', 'BlockHelper', 'Point'],
    function (require, BlockType, guid, Bullet, BlockHelper, Point) {
        var obj = function (type, point, collideFunc) {
            this._id = guid();
            this._type = type;
            this._point = point;
            this._collideFunc = collideFunc;
            this._subtype = 'default';
        };

        obj.prototype.getX = function () {
            return this._point.x;
        };

        obj.prototype.getY = function () {
            return this._point.y;
        };

        obj.prototype.collidesWith = function (entity, corners) {
            return this._collideFunc.apply(this, [entity, corners]);
        };

        obj.prototype.getPos = function () {
            return new Point(this._point.x, this._point.y);
        };

        obj.ofType = function(point, type) {
            switch (type) {
                case BlockType.EMPTY:
                    return obj.EMPTY(point);
                case BlockType.BRICK:
                    return obj.BRICK(point);
                case BlockType.STONE:
                    return obj.STONE(point);
                case BlockType.WATER:
                    return obj.WATER(point);
                default:
                    throw new Error('Unknown blockType ' + type);
            }
        };

        obj.EMPTY = function (point) {
            return new obj(
                BlockType.EMPTY,
                point,
                function () {
                    return false;
                }
            );
        };

        obj.BRICK = function (point) {
            return new obj(
                BlockType.BRICK,
                point,
                function (entity, corners) {
                    if (this._subtype == 'none') {
                        return false;
                    } else if (entity instanceof require('Tank')) {
                        return true;
                    }

                    var collides = false;

                    var bounds = BlockHelper.brick.subtypeBounds[this._subtype];
                    var pos = this.getPos();

                    var tl = new Point(pos.x + bounds.x, pos.y + bounds.y);
                    var br = new Point(pos.x + bounds.x + bounds.width, pos.y + bounds.y + bounds.height);
                    for (var i = 0; i < corners.length; i++) {
                        var c = corners[i];
                        if (c.x >= tl.x && c.x <= br.x && c.y >= tl.y && c.y <= br.y) {
                            collides = true;
                            break;
                        }
                    }

                    if (collides && entity instanceof Bullet) {
                        this._subtype = BlockHelper.brick.transitions[this._subtype][entity.getDirection().toString()];
                        return true;
                    } else {
                        return false;
                    }

                }
            );
        };

        obj.STONE = function (point) {
            return new obj(
                BlockType.STONE,
                point,
                function () {
                    return true;
                }
            );
        };

        obj.WATER = function (point) {
            return new obj(
                BlockType.WATER,
                point,
                function (entity) {
                    return entity instanceof require('Tank');
                }
            );
        };

        return obj;
    }
);

