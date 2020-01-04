define(
    [
        'World', 'DebugGrid', 'renderer/TankRenderer', 'renderer/BulletRenderer', 'renderer/BlockRenderer', 'Socket',
        'Tank', 'Key', 'Direction'
    ],
    function (World, DebugGrid, TankRenderer, BulletRenderer, BlockRenderer, Socket, Tank, Key, Direction) {
        var obj = function () {
        };

        obj.prototype._tick = function (event) {
            this._fps.text = '' + (Math.round(createjs.Ticker.getMeasuredFPS() * 100) / 100) + ' FPS';

            this._stage.update();
        };

        obj.prototype.ping = function(latency) {
            this._ping.text = 'ping ' + latency + 'ms';
            this._stage.update();
        };

        obj.prototype.init = function () {
            this._stage = new createjs.Stage('canvas');

            this._ticks = [];

            this._spritesheet = document.getElementById('spritesheet');

            this._world = new World(800, 576);
            this.registerTick(this._world);

            this._border = new createjs.Shape();
            this._border.graphics.beginStroke('white');
            this._border.graphics.drawRect(0, 0, 800, 576);
            this._stage.addChild(this._border);

            this._grid = new DebugGrid(this);

            this._fps = this._stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
            this._fps.lineHeight = 15;
            this._fps.x = this._stage.canvas.width - 80;
            this._fps.y = 10;

            this._ping = this._stage.addChild(new createjs.Text("", "14px monospace", "#fff"));
            this._ping.lineHeight = 15;
            this._ping.x = this._stage.canvas.width - 80;
            this._ping.y = 25;

            this._tank = null;
            this._playerId = null;

            this._tankRenderer = new TankRenderer(this);
            this._bulletRenderer = new BulletRenderer(this);
            this._blockRenderer = new BlockRenderer(this);

            this._socket = new Socket(this);

            var that = this;
            createjs.Ticker.addEventListener(
                'tick',
                function (event) {
                    that._tick(event);
                    that._ticks.forEach(function (tick) {
                        tick.tick(event);
                    });
                }
            );
            createjs.Ticker.setFPS(60);

            document.onkeydown = function (e) {
                that._handleKeyDown(e);
            };
            document.onkeyup = function (e) {
                that._handleKeyUp(e);
            };
        };

        obj.prototype.getTank = function () {
            return this._tank;
        };

        obj.prototype.addPlayer = function(player) {
            if(player.id != this._playerId) {
                this._world.addTank(player.id, player.pos.x, player.pos.y, Direction.fromStr(player.direction));
            }
        };

        obj.prototype.sync = function(player) {
            var tank = this._world._tanks[player.id];
            tank.setPos(player.pos);
            tank._direction = Direction.fromStr(player.direction);
            tank._moving = player.moving;
        };

        obj.prototype.createOwnTank = function (data) {
            this._playerId = data.id;
            this._tank = this._world.addTank(data.id, data.pos.x, data.pos.y, Direction.fromStr(data.direction));
        };

        obj.prototype.stop = function () {
            //this._comet.disconnect(this._tank.getPlayerId());
        };

        obj.prototype.collidesWith = function (entity) {
            return this._world.collidesWith(entity);
        };

        obj.prototype.getSpritesheet = function () {
            return this._spritesheet;
        };

        obj.prototype.getWidth = function () {
            return this._stage.canvas.width;
        };

        obj.prototype.getHeight = function () {
            return this._stage.canvas.height;
        };

        obj.prototype.addChild = function (child) {
            this._stage.addChild(child);
        };

        obj.prototype.addChildAt = function (child, index) {
            this._stage.addChildAt(child, index);
        };

        obj.prototype.removeChild = function (child) {
            this._stage.removeChild(child);
        };

        obj.prototype.removeChildAt = function (index) {
            this._stage.removeChildAt(index);
        };

        obj.prototype.registerTick = function (tick) {
            this._ticks.push(tick);
        };

        obj.prototype.unregisterTick = function (tick) {
            var index = this._ticks.indexOf(tick);
            if (index >= 0) {
                this._ticks.splice(index, 1);
            }
        };

        obj.prototype._handleKeyDown = function (e) {
            //e = e || event;

            var playerId = this._tank.getPlayerId();

            switch (e.keyCode) {
                case Key.KEYCODE_SPACE:
                    if(this._world.shoot({id: playerId})) {
                        this._socket.shoot();
                    }
                    e.preventDefault();
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
                    if(this._tank.rotate(direction)) {
                        this._socket.rotate(direction);
                    }
                    e.preventDefault();
                    return false;
            }
        };

        obj.prototype._handleKeyUp = function (e) {
            //e = e || event;

            switch (e.keyCode) {
                case Key.KEYCODE_A:
                case Key.KEYCODE_LEFT:
                case Key.KEYCODE_D:
                case Key.KEYCODE_RIGHT:
                case Key.KEYCODE_W:
                case Key.KEYCODE_UP:
                case Key.KEYCODE_S:
                case Key.KEYCODE_DOWN:
                    if (this._tank.getDirection() == Direction.fromKey(e.keyCode)) {
                        this._tank.stopMoving();
                        this._socket.stop();
                    }
                case Key.KEYCODE_SPACE:
                    e.preventDefault();
                    return false;
            }
        };

        obj.prototype.shoot = function(player) {
            this.sync(player);
            this._world.shoot(player);
        };

        return new obj();
    }
);
