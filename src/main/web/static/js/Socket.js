define(function() {
    var obj = function(main) {
        this._main = main;

        var that = this;
        console.log('connecting');
        this._socket = io.connect('http://' + config.host);

        this._socket.on('start', function(me) {
            console.log('got playerId', me);
            that._main.createOwnTank(me);
        });

        this._socket.on('connected', function(player) {
            console.log('connected', player);
            that._main.addPlayer(player);
        });

        this._socket.on('disconnected', function(playerId) {
           console.log('disconnected', playerId);
            that._main._world.removeTank(playerId);
        });

        this._socket.on('players', function(players) {
            _.each(players, function(player) {
                that._main.addPlayer(player);
            });
        });

        this._socket.on('sync', function(players) {
            console.log('syncing');
            _.each(players, function(player) {
                that._main.sync(player);
            });
        });

        this._socket.on('shoot', function(player) {
            console.log('shoot', player);
            that._main.shoot(player);
        });

        this._socket.on('rotate', function(player) {
            that._main.sync(player);
        });

        this._socket.on('stop', function(player) {
            that._main.sync(player);
        });
    };

    obj.prototype.shoot = function() {
        console.log('sending shoot');
        this._socket.emit('shoot', {});
    };

    obj.prototype.rotate = function(direction) {
        console.log('sending rotate', direction.toString());
        this._socket.emit('rotate', direction.toString());
    };

    obj.prototype.stop = function() {
        console.log('sending stop');
        this._socket.emit('stop');
    };

    return obj;
});
