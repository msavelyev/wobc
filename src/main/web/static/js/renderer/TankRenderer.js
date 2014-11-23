var TankRenderer = (function () {
    function TankRenderer(main) {
        this._main = main;

        this._image = new createjs.Sprite(new createjs.SpriteSheet({
            images: [this._main.getSpritesheet()],
            frames: [
                [0, 224, 32, 32, 0, 16, 16],
                [32, 224, 32, 32, 0, 16, 16],
                [64, 224, 32, 32, 0, 16, 16],
                [96, 224, 32, 32, 0, 16, 16],
                [128, 224, 32, 32, 0, 16, 16],
                [160, 224, 32, 32, 0, 16, 16],
                [192, 224, 32, 32, 0, 16, 16],
                [224, 224, 32, 32, 0, 16, 16]
            ],
            animations: {
                up: {
                    frames: [0, 1],
                    frequency: 0.25
                },
                right: {
                    frames: [2, 3],
                    frequency: 0.25
                },
                down: {
                    frames: [4, 5],
                    frequency: 0.25
                },
                left: {
                    frames: [6, 7],
                    frequency: 0.25
                }
            }
        }));

        this._image.gotoAndStop('right');
        this._image.filters = [
            new createjs.ColorFilter(.9, .9, 0, 1, 0, 0, 0)
        ];

        this._image.cache(
            -World.HALF_BLOCK_SIZE,
            -World.HALF_BLOCK_SIZE,
            World.BLOCK_SIZE,
            World.BLOCK_SIZE
        );
        this._image.updateCache();

        this._main.addChild(this._image);
        this._main.registerTick(this);

        this._tank = this._main._tank;
        this.updatePos();

        this._main.registerTick(this);
    }

    TankRenderer.prototype.updatePos = function() {
        this._image.x = this._tank.getX();
        this._image.y = this._tank.getY();
    };

    TankRenderer.prototype.tick = function(event) {
        this.updatePos();
        if(this._tank._moving) {
            this._image.updateCache();
            this._image.gotoAndPlay(this._tank._direction.toString());
        } else {
            this._image.stop();
        }
    };

    return TankRenderer;
})();
