define(['Block', 'BlockType', 'Tank'], function (Block, BlockType, Tank) {
    var obj = function(width, height) {
        var level = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 2, 2, 2, 0, 3, 3, 3, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            [0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        
        this._level = [];
        this._ticks = [];
        this._bullets = {};
        this._tanks = {};
        this._width = width;
        this._height = height;

        // чтоб не забыть потом опять: эта хуйня рисует по четыре блока на один физический
        for(var x = 0; x < this._width / obj.HALF_BLOCK_SIZE; x++) {
            this._level[x] = [];
            
            for(var y = 0; y < this._height / obj.HALF_BLOCK_SIZE; y++) {
                var lX = Math.floor(x / 2);
                var lY = Math.floor(y / 2);
                if(lX < level.length && lY < level[lX].length && level[lY][lX]) {
                    this._level[x][y] = Block.ofType(
                        new createjs.Point(x * obj.HALF_BLOCK_SIZE, y * obj.HALF_BLOCK_SIZE),
                        level[lY][lX]
                    );
                } else {
                    this._level[x][y] = Block.ofType(
                        new createjs.Point(x * obj.HALF_BLOCK_SIZE, y * obj.HALF_BLOCK_SIZE),
                        BlockType.EMPTY
                    );
                }
            }
        }
    };

    obj.prototype.tick = function(event) {
        this._ticks.forEach(function (tick) {
            tick.tick(event);
        });
    };

    obj.prototype.addTank = function (playerId, x, y, direction) {
        console.log('adding tank', playerId);
        var tank = new Tank(this, new createjs.Point(x, y), playerId, direction);
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
        var topLeft = new createjs.Point(p.x - w / 2, p.y - h / 2);
        var topRight = new createjs.Point(p.x + w / 2, p.y - h / 2);
        var bottomLeft = new createjs.Point(p.x - w / 2, p.y + h / 2);
        var bottomRight = new createjs.Point(p.x + w / 2, p.y + h / 2);
        
        var corners = [topLeft, topRight, bottomLeft, bottomRight];
//        console.log('corners', corners);
        
        var tl = pointToBlockPos(topLeft);
        var tr = pointToBlockPos(topRight);
        var bl = pointToBlockPos(bottomLeft);
        var br = pointToBlockPos(bottomRight);
        
        var crnrs = [tl, tr, bl, br];
//        console.log('crnrs', crnrs);
//        console.log('colliding ', entity);
        
        return this._level[tl.x][tl.y].collidesWith(entity, corners)
             | this._level[tr.x][tr.y].collidesWith(entity, corners)
             | this._level[bl.x][bl.y].collidesWith(entity, corners)
             | this._level[br.x][br.y].collidesWith(entity, corners);
    };

    obj.BLOCK_SIZE = 32;
    obj.HALF_BLOCK_SIZE = obj.BLOCK_SIZE / 2;
    obj.Q_BLOCK_SIZE = obj.HALF_BLOCK_SIZE / 2;
    
    return obj;
});
