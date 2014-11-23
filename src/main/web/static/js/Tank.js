define(['Direction', 'World', 'Bullet'], function(Direction, World, Bullet) {
    var obj = function(main, point, playerId) {
        this._main = main;
        this._playerId = playerId;

        this._point = new createjs.Point();
        
        this.setPos(point);
        this._main.registerTick(this);

        this._moving = false;
        this._direction = Direction.RIGHT;
    };
    
    obj.prototype.tick = function(event) {
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
    
    obj.prototype.getPlayerId = function() {
        return this._playerId;
    };
    
    obj.prototype.setX = function(x) {
        this._point.x = x;
    };
    
    obj.prototype.setY = function(y) {
        this._point.y = y;
    };
    
    obj.prototype.getX = function() {
        return this._point.x;
    };

    obj.prototype.getY = function() {
        return this._point.y;
    };
    
    obj.prototype.setPos = function(pos) {
        this.setX(pos.x);
        this.setY(pos.y);
    };
    
    obj.prototype.getWidth = function() {
        return World.BLOCK_SIZE;
    };

    obj.prototype.getHeight = function() {
        return World.BLOCK_SIZE;
    };
    
    obj.prototype.getPos = function() {
        return new createjs.Point(this.getX(), this.getY());
    };
    
    obj.prototype._fixHorizontally = function() {
        this.setX(World.HALF_BLOCK_SIZE * Math.round(this.getX() / World.HALF_BLOCK_SIZE));
    };

    obj.prototype._fixVertically = function() {
        this.setY(World.HALF_BLOCK_SIZE * Math.round(this.getY() / World.HALF_BLOCK_SIZE));
    };

    obj.prototype.stopMoving = function() {
        this._moving = false;
    };
    
    obj.prototype.rotate = function(direction) {
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
    
    obj.prototype.shoot = function() {
        new Bullet(this._main, this);
    };
    
    obj.prototype.getDirection = function() {
        return this._direction;
    };
    
    obj.prototype.remove = function() {
        this._main.unregisterTick(this);
        this._main.removeChild(this._image);
    };
    
    return obj;
});
