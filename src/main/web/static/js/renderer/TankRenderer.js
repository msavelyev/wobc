define(['World'], function (World) {
    var obj = function (main) {
        this._main = main;

        this._tanks = {};
        this._images = {};
        this._tanksDirections = {};

        this._main.registerTick(this);
    };

    var updatePos = function(that, tank) {
        this._image.x = this._tank.getX();
        this._image.y = this._tank.getY();
    };

    var createTank = function(that, tank) {
        var id = tank._id;

        var image = new createjs.Sprite(new createjs.SpriteSheet({
            images: [that._main.getSpritesheet()],
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
                    frequency: 0.25
                },
                right: {
                    frames: [2, 3],
                    frequency: 0.25
                },
                down: {
                    frames: [4, 5],
                    frequency: 0.25
                },
                left: {
                    frames: [6, 7],
                    frequency: 0.25
                }
            }
        }));

        image.gotoAndStop('right');
        image.filters = [
            new createjs.ColorFilter(.9, .9, 0, 1, 0, 0, 0)
        ];

        image.cache(
            -World.HALF_BLOCK_SIZE,
            -World.HALF_BLOCK_SIZE,
            World.BLOCK_SIZE,
            World.BLOCK_SIZE
        );
        image.updateCache();

        that._main.addChild(image);

        that._images[id] = image;
        that._tanks[id] = tank;
        that._tanksDirections[id] = tank._direction;
    };

    var removeTank = function(that, id) {
        var image = that._images[id];
        image.stop();
        that._main.removeChild(image);

        delete that._tanks[id];
        delete that._images[id];
    };

    obj.prototype.tick = function(event) {
        var that = this;
        var mainTanks = this._main._tanks;
        var mainTanksIds = _.map(_.values(mainTanks), function(tank) {
            return tank._id;
        });
        var newTanks = _.filter(mainTanksIds, function(id) {
            return !_.has(that._tanks, id);
        });
        var oldTanks = _.filter(_.keys(this._tanks), function(id) {
            return !_.contains(mainTanksIds, id);
        });

        _.each(newTanks, function(id) {
            createTank(that, mainTanks[id]);
        });

        _.each(oldTanks, function(id) {
            removeTank(that, id);
        });

        _.each(_.keys(mainTanks), function(id) {
            var image = that._images[id];
            var tank = mainTanks[id];
            var direction = that._tanksDirections[id];

            image.x = tank.getX();
            image.y = tank.getY();

            if(tank._moving) {
                image.updateCache();
                if(image.paused || direction != tank._direction) {
                    console.log('new direction ', tank._direction);
                    that._tanksDirections[id] = tank._direction;
                    image.gotoAndPlay(tank._direction.toString());
                }
            } else {
                image.stop();
            }
        });

    };

    return obj;
});
