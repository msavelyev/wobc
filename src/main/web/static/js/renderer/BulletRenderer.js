define(['Explode', 'Direction'], function(Explode, Direction) {
    var obj = function(main) {
        this._main = main;
        this._main.registerTick(this);

        this._bullets = {};

        this._images = {};
    };

    var createBullet = function(that, id, bullet) {
        var image = new createjs.Bitmap(that._main.getSpritesheet());

        var x, y, width, height, regX, regY;
        switch(bullet._direction) {
            case Direction.UP:
                x = 96; y = 192; width = 6; height = 8; regX = 3; regY = 4;
                break;
            case Direction.DOWN:
                x = 96; y = 208; width = 6; height = 8; regX = 3; regY = 4;
                break;
            case Direction.LEFT:
                x = 112; y = 192; width = 8; height = 6; regX = 4; regY = 3;
                break;
            case Direction.RIGHT:
                x = 112; y = 208; width = 8; height = 6; regX = 4; regY = 3;
                break;
        }
        image.sourceRect = new createjs.Rectangle(x, y, width, height);

        image.regX = regX;
        image.regY = regY;

        that._main.addChild(image);
        that._images[id] = image;
        that._bullets[id] = bullet;
    };

    var removeBullet = function(that, id) {
        var bullet = that._bullets[id];
        var image = that._images[id];

        delete that._bullets[id];
        delete that._images[id];

        that._main.removeChild(image);
        new Explode(that._main, bullet.getPos());
    };

    obj.prototype.tick = function(event) {
        var that = this;
        var mainBullets = this._main._bullets;
        var mainBulletsIds = _.map(_.values(this._main._bullets), function(bullet) {
            return bullet._id;
        });
        var newBullets = _.filter(mainBulletsIds, function(id) {
            return !_.has(that._bullets, id);
        });
        var oldBullets = _.filter(_.keys(this._bullets), function(id) {
            return !_.contains(mainBulletsIds, id);
        });

        _.each(newBullets, function(id) {
            createBullet(that, id, _.find(_.values(mainBullets), function(bullet) {
                return bullet._id == id;
            }));
        });

        _.each(oldBullets, function(id) {
            removeBullet(that, id);
        });

        _.each(_.keys(this._images), function(id) {
            var image = that._images[id];
            var bullet = that._bullets[id];

            image.x = bullet.getX();
            image.y = bullet.getY();
        });
    };

    return obj;
});
