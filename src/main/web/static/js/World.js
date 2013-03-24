var World = (function () {
    
    function World(main) {
        var level = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0],
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
        
        this._stage = main._stage;
        
        this._level = Array();
        
        var that = this;
        for(var x = 0; x < this._stage.canvas.width / World.HALF_BLOCK_SIZE; x++) {
            this._level[x] = new Array();
            
            for(var y = 0; y < this._stage.canvas.height / World.HALF_BLOCK_SIZE; y++) {
                var lX = Math.floor(x / 2);
                var lY = Math.floor(y / 2);
                if(lX < level.length && lY < level[lX].length && level[lY][lX]) {
                    this._level[lX][lY] = Block.ofType(
                        main,
                        new createjs.Point(x * World.HALF_BLOCK_SIZE, y * World.HALF_BLOCK_SIZE),
                        level[lY][lX]
                    );
                }
            }
        }
    };
    
    return World;
})();

World.BLOCK_SIZE = 32;
World.HALF_BLOCK_SIZE = World.BLOCK_SIZE / 2;
World.Q_BLOCK_SIZE = World.HALF_BLOCK_SIZE / 2;
