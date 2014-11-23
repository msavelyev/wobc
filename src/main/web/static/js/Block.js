define(
    ['require', 'BlockType', 'guid', 'Bullet', 'BlockHelper'],
    function (require, BlockType, guid, Bullet, BlockHelper) {
        var obj = function (main, type, point, collideFunc) {
            this._id = guid();
            this._main = main;
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
            return new createjs.Point(this._point.x, this._point.y);
        };

        obj.ofType = function (main, point, type) {
            switch (type) {
                case BlockType.EMPTY:
                    return obj.EMPTY(main, point);
                case BlockType.BRICK:
                    return obj.BRICK(main, point);
                case BlockType.STONE:
                    return obj.STONE(main, point);
                case BlockType.WATER:
                    return obj.WATER(main, point);
                default:
                    return null;
            }
        };

        obj.EMPTY = function (main, point) {
            return new obj(
                main,
                BlockType.EMPTY,
                point,
                function () {
                    return false;
                }
            );
        };

        obj.BRICK = function (main, point) {
            return new obj(
                main,
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

        obj.STONE = function (main, point) {
            return new obj(
                main,
                BlockType.STONE,
                point,
                function () {
                    return true;
                }
            );
        };

        obj.WATER = function (main, point) {
            return new obj(
                main,
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

