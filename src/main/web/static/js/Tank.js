var Tank = (function() {
    
    function Tank(main) {
        this._stage = main._stage;
        
        this._image = new createjs.BitmapAnimation(new createjs.SpriteSheet({
            images: [main._spritesheet],
            frames: [
                [0, 160, 32, 32, 0, 16, 16],
                [32, 160, 32, 32, 0, 16, 16]
            ],
            animations: {
                first: {
                    frames: [0, 1],
                    frequency: 4
                }
            }
        }));
        this._image.x = 16;
        this._image.y = 16;
        this._image.gotoAndStop('first');
        
        this._stage.addChild(this._image);
        
        this._moving = false;
    };
    
    Tank.prototype.tick = function(event) {
        if(this._moving) {
            var diff = event.delta / 1000 * 100;
            switch(this._image.rotation) {
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
        }
    };

    Tank.prototype.stopMoving = function(event) {
        this._moving = false;
        this._image.stop();
    };
    
    Tank.prototype.rotate = function(direction) {
        if(this._image.rotation != direction) {
            console.log('rotated to ' + direction);
            this._image.rotation = direction;
        }
        this._moving = true;
        this._image.gotoAndPlay('first');
    };
    
    Tank.prototype.shoot = function() {
        
    };
    
    Tank.prototype.getDirection = function() {
        return this._image.rotation;
    };
    
    return Tank;
})();