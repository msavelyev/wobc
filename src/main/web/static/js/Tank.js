var Tank = (function() {
    
    function Tank(main, point, playerId) {
        this._main = main;
        this._playerId = playerId;

        this._point = new createjs.Point();
        
        this.setPos(point);
        this._main.registerTick(this);

        this._moving = false;
        this._direction = Direction.RIGHT;
    }
    
    Tank.prototype.tick = function(event) {
        if(this._moving) {
            var oldX = this.getX();
            var oldY = this.getY();
            
            var diff = event.delta / 1000 * 100;
            var newX = oldX;
            var newY = oldY;
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

            if(newX < this.getWidth() / 2) {
                newX = this.getWidth() / 2;
            }
            if(newY < this.getHeight() / 2) {
                newY = this.getHeight() / 2;
            }
            if(newX > this._main.getWidth() - World.BLOCK_SIZE / 2) {
                newX = this._main.getWidth() - World.BLOCK_SIZE / 2;
            }
            if(newY > this._main.getHeight() - World.BLOCK_SIZE / 2) {
                newY = this._main.getHeight() - World.BLOCK_SIZE / 2;
            }

            this.setPos(new createjs.Point(newX, newY));
            if(this._main.collidesWith(this)) {
                this.setPos(new createjs.Point(oldX, oldY));
            }
        }
    };
    
    Tank.prototype.getPlayerId = function() {
        return this._playerId;
    };
    
    Tank.prototype.setX = function(x) {
        this._point.x = x;
    };
    
    Tank.prototype.setY = function(y) {
        this._point.y = y;
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
    
    Tank.prototype.getWidth = function() {
        return World.BLOCK_SIZE;
    };

    Tank.prototype.getHeight = function() {
        return World.BLOCK_SIZE;
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
    };
    
    Tank.prototype.rotate = function(direction) {
        var rotated = false;
        if(this._direction != direction || !this._moving) {
            this._direction = direction;
            
            switch(this._direction.getType()) {
                case Direction.VERT:
                    this._fixHorizontally();
                    break;
                case Direction.HORI:
                    this._fixVertically();
                    break;
            }
            
            rotated = true;
        }
        this._moving = true;
        return rotated;
    };
    
    Tank.prototype.shoot = function() {
        new Bullet(this._main, this);
    };
    
    Tank.prototype.getDirection = function() {
        return this._direction;
    };
    
    Tank.prototype.remove = function() {
        this._main.unregisterTick(this);
        this._main.removeChild(this._image);
    };
    
    return Tank;
})();
