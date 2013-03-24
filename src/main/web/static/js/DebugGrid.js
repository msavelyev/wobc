var DebugGrid = (function () {
    function DebugGrid(main) {
        this._grid = new createjs.Shape();
        var graph = this._grid.graphics;
        graph.beginStroke('rgba(255, 255, 255, 0.3)');
        for(var x = 0; x < main.getWidth(); x += World.HALF_BLOCK_SIZE) {
            graph.moveTo(x, 0);
            graph.lineTo(x, main.getHeight());
        }
        for(var y = 0; y < main.getHeight(); y += World.HALF_BLOCK_SIZE) {
            graph.moveTo(0, y);
            graph.lineTo(main.getWidth(), y);
        }

        main.addChild(this._grid);
    };
    
    return DebugGrid;
})();