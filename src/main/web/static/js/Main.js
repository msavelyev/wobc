var Main = new ((function() {
    Main.prototype._tick = function(event) {
        this._fps.text = '' + (Math.round(createjs.Ticker.getMeasuredFPS() * 100) / 100) + ' FPS';

        this._stage.update();
    };
    
    Main.prototype.init = function() {
        this._stage = new createjs.Stage('canvas');

        this._border = new createjs.Shape();
        this._border.graphics.beginStroke('white');
        this._border.graphics.drawRect(0, 0, 800, 576);
        this._stage.addChild(this._border);

        this._grid = new createjs.Shape();
        var graph = this._grid.graphics;
        graph.beginStroke('rgba(255, 255, 255, 0.3)');
        for(var x = 0; x < this._stage.canvas.width; x += World.HALF_BLOCK_SIZE) {
            graph.moveTo(x, 0);
            graph.lineTo(x, this._stage.canvas.height);
        }
        for(var y = 0; y < this._stage.canvas.height; y += World.HALF_BLOCK_SIZE) {
            graph.moveTo(0, y);
            graph.lineTo(this._stage.canvas.width, y);
        }

        this._stage.addChild(this._grid);

        this._fps = this._stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
        this._fps.lineHeight = 15;
        this._fps.x = this._stage.canvas.width - 80;
        this._fps.y = 10;
        
        this._spritesheet = new Image();
        this._spritesheet.src = "static/images/true_sprites.png";
        
        this._tank = new Tank(this);
        
        var that = this;
        createjs.Ticker.addEventListener(
            'tick',
            function (event) {
                that._tick(event);
                that._tank.tick(event);
            }
        );
        createjs.Ticker.setFPS(60);

        document.onkeydown = function() {
            that._handleKeyDown();
        };
        document.onkeyup = function() {
            that._handleKeyUp();
        };
    };

    Main.prototype._handleKeyDown = function(e) {
        if(!e){ e = window.event; }
        
        switch(e.keyCode) {
            case Key.KEYCODE_SPACE:
                this._tank.shoot();
                return false;
            case Key.KEYCODE_A:
            case Key.KEYCODE_LEFT:
            case Key.KEYCODE_D:
            case Key.KEYCODE_RIGHT:
            case Key.KEYCODE_W:
            case Key.KEYCODE_UP:
            case Key.KEYCODE_S:
            case Key.KEYCODE_DOWN:
                var direction = Direction.fromKey(e.keyCode);
                this._tank.rotate(direction);
                e.preventDefault();
                return false;
        }
    }

    Main.prototype._handleKeyUp = function(e) {
        if(!e){ e = window.event; }
        
        switch(e.keyCode) {
            case Key.KEYCODE_A:
            case Key.KEYCODE_LEFT:
            case Key.KEYCODE_D:
            case Key.KEYCODE_RIGHT:
            case Key.KEYCODE_W:
            case Key.KEYCODE_UP:
            case Key.KEYCODE_S:
            case Key.KEYCODE_DOWN:
                if(this._tank.getDirection() == Direction.fromKey(e.keyCode)) {
                    this._tank.stopMoving();
                }
                e.preventDefault();
                return false;
        }
    }
    
    function Main() { };
    
    return Main;
})());
