var Tank = (function() {
    
    function Tank(main, point, playerId) {
        this._main = main;
        this._playerId = playerId;

        this._point = new createjs.Point();
        
        this._image = new createjs.BitmapAnimation(new createjs.SpriteSheet({
            images: [main.getSpritesheet()],
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
        this.setPos(point);
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
        
        main.addChild(this._image);
        main.registerTick(this);

        this._moving = false;
        this._direction = Direction.RIGHT;
    };
    
    Tank.prototype.tick = function(event) {
        if(this._moving) {
            var diff = event.delta / 1000 * 100;
            var newY = this.getY();
            var newX = this.getX();
            switch(this._direction) {
                case Direction.DOWN:
                    newY += diff;
                    break;
                case Direction.UP:
                    newY -= diff;
                    break;
                case Direction.RIGHT:
                    newX += diff;
                    break;
                case Direction.LEFT:
                    newX -= diff;
                    break;
            }

            if(newX < 0) {
                newX = 0;
            }
            if(newY < 0) {
                newY = 0;
            }
            if(newX > this._main.getWidth() - World.BLOCK_SIZE) {
                newX = this._main.getWidth() - World.BLOCK_SIZE;
            }
            if(newY > this._main.getHeight() - World.BLOCK_SIZE) {
                newY = this._main.getHeight() - World.BLOCK_SIZE;
            }
            
            this.setPos(new createjs.Point(newX, newY));
            this._image.updateCache();
        }
    };
    
    Tank.prototype.getPlayerId = function() {
        return this._playerId;
    };
    
    Tank.prototype.setX = function(x) {
        this._point.x = x;
        this._image.x = this._point.x + World.HALF_BLOCK_SIZE;
    };
    
    Tank.prototype.setY = function(y) {
        this._point.y = y;
        this._image.y = this._point.y + World.HALF_BLOCK_SIZE;
    };
    
    Tank.prototype.getX = function() {
        return this._point.x;
    };

    Tank.prototype.getY = function() {
        return this._point.y;
    };
    
    Tank.prototype.setPos = function(pos) {
        this.setX(pos.x);
        this.setY(pos.y);
    };
    
    Tank.prototype.getPos = function() {
        return new createjs.Point(this.getX(), this.getY());
    };
    
    Tank.prototype._fixHorizontally = function() {
        this.setX(World.HALF_BLOCK_SIZE * Math.round(this.getX() / World.HALF_BLOCK_SIZE));
    };

    Tank.prototype._fixVertically = function() {
        this.setY(World.HALF_BLOCK_SIZE * Math.round(this.getY() / World.HALF_BLOCK_SIZE));
    };

    Tank.prototype.stopMoving = function() {
        this._moving = false;
//        this._direction = undefined;
        this._image.stop();
    };
    
    Tank.prototype.rotate = function(direction) {
        if(this._direction != direction || !this._moving) {
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
        new Bullet(this._main, this);
    };
    
    Tank.prototype.getDirection = function() {
        return this._direction;
    };
    
    return Tank;
})();