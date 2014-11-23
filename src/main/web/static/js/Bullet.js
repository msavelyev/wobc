define(['guid', 'Direction'], function (guid, Direction) {
    var obj = function(main, tank) {
        this._id = guid();
        this._main = main;
        this._tank = tank;
        this._direction = tank.getDirection();
        this._point = new createjs.Point();

        var width, height;
        switch(this._direction) {
            case Direction.UP:
            case Direction.DOWN:
                width = 6; height = 8;
                break;
            case Direction.LEFT:
            case Direction.RIGHT:
                width = 8; height = 6;
                break;
        }

        this._width = width;
        this._height = height;
        
        this.setPos(
            new createjs.Point(
                tank.getPos().x,
                tank.getPos().y
            )
        );
        
        this._main.registerTick(this);
        this._main.addBullet(this, this._tank.getPlayerId());
    };
    
    obj.prototype.getWidth = function() {
        return this._width;
    };

    obj.prototype.getHeight = function() {
        return this._height;
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
//        console.log('newPos ' + pos.x + ';' + pos.y);
        this.setX(pos.x);
        this.setY(pos.y);
    };

    obj.prototype.getPos = function() {
        return new createjs.Point(this.getX(), this.getY());
    };
    
    obj.prototype.tick = function(event) {
        var diff = event.delta / 1000 * 400;

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
        
        if(newY < 0
            || newX < 0
            || newX > this._main.getWidth()
            || newY > this._main.getHeight()
            || this._main.collidesWith(this)
        ) {
            this._main.unregisterTick(this);
            this._main.removeBullet(this._tank.getPlayerId());
        } else {
            this.setPos(new createjs.Point(newX, newY));
        }
    };
    
    obj.prototype.getDirection = function() {
        return this._direction;
    };
    
    return obj;
});
