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
        this._image.x = 16;
        this._image.y = 16;
        this._image.gotoAndStop('right');
        this._image.filters = [
            new createjs.ColorFilter(.9, .9, 0, 1, 0, 0, 0)
        ];
        this._image.cache(-16, -16, 32, 32);
        this._image.updateCache();
        
        this._stage.addChild(this._image);

        this._moving = false;
        this._direction = undefined;
    };
    
    Tank.prototype.tick = function(event) {
        if(this._moving) {
            var diff = event.delta / 1000 * 100;
            switch(this._direction  ) {
                case Direction.down:
                    this._image.y += diff;
                    break;
                case Direction.up:
                    this._image.y -= diff;
                    break;
                case Direction.right:
                    this._image.x += diff;
                    break;
                case Direction.left:
                    this._image.x -= diff;
                    break;
            }

            this._image.updateCache();
        }
    };

    Tank.prototype.stopMoving = function(event) {
        this._moving = false;
        this._direction = undefined;
        this._image.stop();
    };
    
    Tank.prototype.rotate = function(direction) {
        if(this._direction != direction) {
            console.log('rotated to ' + direction);
            this._direction = direction;
            
            this._image.gotoAndPlay(Direction.toString(direction));
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