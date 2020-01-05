define(['Block', 'BlockType', 'Tank', 'Point', 'underscore', 'log'], function (Block, BlockType, Tank, Point, _, log) {
    var obj = function(width, height, level) {
        this._level = [];
        this._ticks = [];
        this._bullets = {};
        this._tanks = {};
        this._width = width;
        this._height = height;
        this._initialized = false;

        if (level === null) {
            return;
        }

        for(var y = 0; y < this._height / obj.HALF_BLOCK_SIZE; y++) {
            this._level[y] = [];

            for(var x = 0; x < this._width / obj.HALF_BLOCK_SIZE; x++) {
                var lX = Math.floor(x / 2);
                var lY = Math.floor(y / 2);
                if(lX < level.length && lY < level[lX].length && level[lY][lX]) {
                    this._level[y][x] = Block.ofType(
                      new Point(x * obj.HALF_BLOCK_SIZE, y * obj.HALF_BLOCK_SIZE),
                      level[lY][lX]
                    );
                } else {
                    this._level[y][x] = Block.ofType(
                      new Point(x * obj.HALF_BLOCK_SIZE, y * obj.HALF_BLOCK_SIZE),
                      BlockType.EMPTY
                    );
                }
            }
        }

        this._initialized = true;
    };

    obj.prototype.tick = function(event) {
        this._ticks.forEach(function (tick) {
            tick.tick(event);
        });
    };

    obj.prototype.addTank = function (playerId, x, y, direction) {
        log.debug('adding tank', playerId);
        var tank = new Tank(this, new Point(x, y), playerId, direction);
        this._tanks[playerId] = tank;
        return tank;
    };

    obj.prototype.removeTank = function (playerId) {
        var tank = this._tanks[playerId];
        tank.remove();
        delete this._tanks[playerId];
    };

    obj.prototype.addBullet = function (bullet, playerId) {
        this._bullets[playerId] = bullet;
    };

    obj.prototype.removeBullet = function (playerId) {
        delete this._bullets[playerId];
    };

    obj.prototype.shoot = function(player) {
        if(!this._bullets[player.id]) {
            var tank = this._tanks[player.id];
            tank.shoot();
            return true;
        } else {
            return false;
        }
    };

    obj.prototype.registerTick = function(tick) {
        this._ticks.push(tick);
    };

    obj.prototype.unregisterTick = function (tick) {
        var index = this._ticks.indexOf(tick);
        if (index >= 0) {
            this._ticks.splice(index, 1);
        }
    };
    
    obj.prototype.collidesWith = function(entity) {
        var pointToBlockPos = function(point) {
            return {
                x: Math.floor(point.x / obj.HALF_BLOCK_SIZE),
                y: Math.floor(point.y / obj.HALF_BLOCK_SIZE)
            };
        };
        
        var p = entity.getPos();
        var w = entity.getWidth() - 1;
        var h = entity.getHeight() - 1;
        var topLeft = new Point(p.x - w / 2, p.y - h / 2);
        var topRight = new Point(p.x + w / 2, p.y - h / 2);
        var bottomLeft = new Point(p.x - w / 2, p.y + h / 2);
        var bottomRight = new Point(p.x + w / 2, p.y + h / 2);
        
        var corners = [topLeft, topRight, bottomLeft, bottomRight];

        var tl = pointToBlockPos(topLeft);
        var tr = pointToBlockPos(topRight);
        var bl = pointToBlockPos(bottomLeft);
        var br = pointToBlockPos(bottomRight);

        /*if(!(
                this._level[tl.x]
             && this._level[tr.x]
             && this._level[bl.x]
             && this._level[br.x]
             && this._level[tl.x][tl.y]
             && this._level[tr.x][tr.y]
             && this._level[bl.x][bl.y]
             && this._level[br.x][br.y]
            ) || entity instanceof Bullet) {
            console.log('entity.pos', entity.getPos());
            var cStr = function (c) {
                return '' + c.x + ';' + c.y;
            };
            console.log('corners', _.map([topLeft, topRight, bottomLeft, bottomRight], cStr));
            console.log('crnrs', _.map([tl, tr, bl, br], cStr));
            console.log('bullet', entity instanceof Bullet);
        }*/

        return this._level[tl.y][tl.x].collidesWith(entity, corners)
             | this._level[tr.y][tr.x].collidesWith(entity, corners)
             | this._level[bl.y][bl.x].collidesWith(entity, corners)
             | this._level[br.y][br.x].collidesWith(entity, corners);
    };

    obj.prototype.getTank = function(playerId) {
        return this._tanks[playerId];
    };

    obj.prototype.getPlayer = function(playerId) {
        var tank = this._tanks[playerId];
        return {
            id: playerId,
            moving: tank._moving,
            pos: {
                x: tank.getX(),
                y: tank.getY()
            },
            direction: tank._direction.toString()
        };
    };

    obj.prototype.getPlayers = function() {
        var that = this;
        return _.map(_.keys(this._tanks), function(playerId) {
            return that.getPlayer(playerId);
        });
    };

    obj.BLOCK_SIZE = 32;
    obj.HALF_BLOCK_SIZE = obj.BLOCK_SIZE / 2;
    obj.Q_BLOCK_SIZE = obj.HALF_BLOCK_SIZE / 2;

    obj.prototype.serializeLevel = function() {
        var result = [];

        for (var y = 0; y < this._level.length; y++) {
            result[y] = [];

            for (var x = 0; x < this._level[y].length; x++) {
                var block = this._level[y][x];
                result[y][x] = {
                    type: block._type,
                    subtype: block._subtype
                };
            }
        }

        return result;
    };

    obj.prototype.deserializeLevel = function(level) {
        var newLevel = [];

        for(var y = 0; y < level.length; y++) {
            newLevel[y] = [];

            for(var x = 0; x < level[y].length; x++) {
                newLevel[y][x] = Block.ofType(
                  new Point(x, y),
                  level[y][x].type
                );
                newLevel[y][x]._subtype = level[y][x].subtype;
            }
        }

        this._level = newLevel;

        if (!this._initialized) {
            this._initialized = true;
        }
    };
    
    return obj;
});
