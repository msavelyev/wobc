var Tank = (function() {
    
    function Tank(main) {
        this._stage = main._stage;
        
        this._image = new createjs.BitmapAnimation(new createjs.SpriteSheet({
            images: [main._spritesheet],
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
                    frequency: 4
                },
                right: {
                    frames: [2, 3],
                    frequency: 4
                },
                down: {
                    frames: [4, 5],
                    frequency: 4
                },
                left: {
                    frames: [6, 7],
                    frequency: 4
                }
            }
        }));
        this._image.x = World.HALF_BLOCK_SIZE;
        this._image.y = World.HALF_BLOCK_SIZE;
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
        
        this._stage.addChild(this._image);

        this._moving = false;
        this._direction = undefined;
    };
    
    Tank.prototype.tick = function(event) {
        if(this._moving) {
            var diff = event.delta / 1000 * 100;
            switch(this._direction) {
                case Direction.DOWN:
                    this._image.y += diff;
                    break;
                case Direction.UP:
                    this._image.y -= diff;
                    break;
                case Direction.RIGHT:
                    this._image.x += diff;
                    break;
                case Direction.LEFT:
                    this._image.x -= diff;
                    break;
            }

            this._image.updateCache();
            if(this._image.x < World.HALF_BLOCK_SIZE) {
                this._image.x = World.HALF_BLOCK_SIZE;
            }
            if(this._image.y < World.HALF_BLOCK_SIZE) {
                this._image.y = World.HALF_BLOCK_SIZE;
            }
            if(this._image.x > this._stage.canvas.width - World.HALF_BLOCK_SIZE) {
                this._image.x = this._stage.canvas.width - World.HALF_BLOCK_SIZE;
            }
            if(this._image.y > this._stage.canvas.height - World.HALF_BLOCK_SIZE) {
                this._image.y = this._stage.canvas.height - World.HALF_BLOCK_SIZE;
            }
        }
    };
    
    Tank.prototype._fixHorizontally = function() {
        this._image.x = World.HALF_BLOCK_SIZE * Math.round(this._image.x / World.HALF_BLOCK_SIZE);
    };

    Tank.prototype._fixVertically = function() {
        this._image.y = World.HALF_BLOCK_SIZE * Math.round(this._image.y / World.HALF_BLOCK_SIZE);
    };

    Tank.prototype.stopMoving = function() {
        this._moving = false;
        this._direction = undefined;
        this._image.stop();
    };
    
    Tank.prototype.rotate = function(direction) {
        if(this._direction != direction) {
            console.log('rotate to ' + direction.toString());
            this._direction = direction;
            
            switch(this._direction.getType()) {
                case Direction.VERT:
                    this._fixHorizontally();
                    break;
                case Direction.HORI:
                    this._fixVertically();
                    break;
            }
            
            this._image.gotoAndPlay(direction.toString());
        }
        this._moving = true;
    };
    
    Tank.prototype.shoot = function() {
        
    };
    
    Tank.prototype.getDirection = function() {
        return this._direction;
    };
    
    return Tank;
})();