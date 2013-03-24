var Bullet = (function () {
    function Bullet(main, tank) {
        this._main = main;
        this._tank = tank;
        this._direction = tank.getDirection();
        this._point = new createjs.Point();
        
        this._image = new createjs.Bitmap(this._main.getSpritesheet());
        
        var x, y, width, height, regX, regY;
        switch(this._direction) {
            case Direction.UP:
                x = 96;
                y = 192;
                width = 6;
                height = 8;
                regX = 3;
                regY = 4;
                break;
            case Direction.DOWN:
                x = 96;
                y = 208;
                width = 6;
                height = 8;
                regX = 3;
                regY = 4;
                break;
            case Direction.LEFT:
                x = 112;
                y = 192;
                width = 8;
                height = 6;
                regX = 4;
                regY = 3;
                break;
            case Direction.RIGHT:
                x = 112;
                y = 208;
                width = 8;
                height = 6;
                regX = 4;
                regY = 3;
                break;
        }
        this._image.sourceRect = new createjs.Rectangle(x, y, width, height);
        
        this._width = width;
        this._height = height;
        
        this._image.regX = regX;
        this._image.regY = regY;
        
        this.setPos(
            new createjs.Point(
                tank.getPos().x,
                tank.getPos().y
            )
        );
        
        this._main.addChild(this._image);
        this._main.registerTick(this);
        this._main.addBullet(this, tank.getPlayerId());
//        console.log('created bullet');
        
    };
    
    Bullet.prototype.getWidth = function() {
        return this._width;
    };

    Bullet.prototype.getHeight = function() {
        return this._height;
    };

    Bullet.prototype.setX = function(x) {
        this._point.x = x;
        this._image.x = this._point.x;
    };

    Bullet.prototype.setY = function(y) {
        this._point.y = y;
        this._image.y = this._point.y;
    };

    Bullet.prototype.getX = function() {
        return this._point.x;
    };

    Bullet.prototype.getY = function() {
        return this._point.y;
    };

    Bullet.prototype.setPos = function(pos) {
//        console.log('newPos ' + pos.x + ';' + pos.y);
        this.setX(pos.x);
        this.setY(pos.y);
    };

    Bullet.prototype.getPos = function() {
        return new createjs.Point(this.getX(), this.getY());
    };
    
    Bullet.prototype.tick = function(event) {
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
//            console.log('removing bullet');
            
            this._main.removeChild(this._image);
            this._main.unregisterTick(this);
            this._main.removeBullet(this._tank.getPlayerId());
            
            new Explode(this._main, this.getPos());
        } else {
            this.setPos(new createjs.Point(newX, newY));
        }
    };
    
    Bullet.prototype.getDirection = function() {
        return this._direction;
    };
    
    return Bullet;
})();