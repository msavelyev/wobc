define(['guid', 'Direction', 'Point'], function (guid, Direction, Point) {
    var obj = function(world, tank) {
        this._id = guid();
        this._world = world;
        this._tank = tank;
        this._direction = tank.getDirection();
        this._point = new Point();

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
            new Point(
                tank.getPos().x,
                tank.getPos().y
            )
        );
        
        this._world.registerTick(this);
        this._world.addBullet(this, this._tank.getPlayerId());
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
        return new Point(this.getX(), this.getY());
    };
    
    obj.prototype.tick = function(event) {
        var diff = event.delta / 1000 * 400;

        var x = this.getX();
        var y = this.getY();
        var newY = y;
        var newX = x;
        var w = this._width;
        var h = this._height;

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
        
        if(y - h / 2 < 0
            || x - w / 2 < 0
            || x + w / 2 > this._world._width
            || y + h / 2 > this._world._height
            || this._world.collidesWith(this)
        ) {
            this._world.unregisterTick(this);
            this._world.removeBullet(this._tank.getPlayerId());
        } else {
            this.setPos(new Point(newX, newY));
        }
    };
    
    obj.prototype.getDirection = function() {
        return this._direction;
    };
    
    return obj;
});
