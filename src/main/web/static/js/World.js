var World = (function () {
    
    function World(main) {
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
        
        this._main = main;
        
        this._level = Array();
        
        for(var x = 0; x < this._main.getWidth() / World.HALF_BLOCK_SIZE; x++) {
            this._level[x] = new Array();
            
            for(var y = 0; y < this._main.getHeight() / World.HALF_BLOCK_SIZE; y++) {
                var lX = Math.floor(x / 2);
                var lY = Math.floor(y / 2);
                if(lX < level.length && lY < level[lX].length && level[lY][lX]) {
                    this._level[lX][lY] = Block.ofType(
                        main,
                        new createjs.Point(x * World.HALF_BLOCK_SIZE, y * World.HALF_BLOCK_SIZE),
                        level[lY][lX]
                    );
                } else {
                    this._level[lX][lY] = {
                        collidesWith: function() {
                            return false;
                        }
                    };
//                    this._level[lX][lY] = Block.EMPTY(
//                        main,
//                        new createjs.Point(x * World.HALF_BLOCK_SIZE, y * World.HALF_BLOCK_SIZE)
//                    );
                }
            }
        }
    };
    
    World.prototype.collidesWith = function(entity) {
        var pointToBlockPos = function(point) {
            return {
                x: Math.floor(point.x / World.BLOCK_SIZE),
                y: Math.floor(point.y / World.BLOCK_SIZE)
            };
        };
        
        var p = entity.getPos();
        var w = entity.getWidth() - 1;
        var h = entity.getHeight() - 1;
        var topLeft = new createjs.Point(p.x - w / 2, p.y - h / 2);
        var topRight = new createjs.Point(p.x + w / 2, p.y - h / 2);
        var bottomLeft = new createjs.Point(p.x - w / 2, p.y + h / 2);
        var bottomRight = new createjs.Point(p.x + w / 2, p.y + h / 2);
        
        var tl = pointToBlockPos(topLeft);
        var tr = pointToBlockPos(topRight);
        var bl = pointToBlockPos(bottomLeft);
        var br = pointToBlockPos(bottomRight);
        
        return this._level[tl.x][tl.y].collidesWith(entity)
            || this._level[tr.x][tr.y].collidesWith(entity)
            || this._level[bl.x][bl.y].collidesWith(entity)
            || this._level[br.x][br.y].collidesWith(entity);
    };
    
    return World;
})();

World.BLOCK_SIZE = 32;
World.HALF_BLOCK_SIZE = World.BLOCK_SIZE / 2;
World.Q_BLOCK_SIZE = World.HALF_BLOCK_SIZE / 2;
