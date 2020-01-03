define(['log'], function(log) {
    var obj = function(main) {
        this._main = main;

        var that = this;
        var host = window.location.origin;
        log.debug('connecting to ', host);
        this._socket = io.connect(host);

        this._socket.on('start', function(me) {
            log.debug('got playerId', me);
            that._main.createOwnTank(me);
        });

        this._socket.on('connected', function(player) {
            log.debug('connected', player);
            that._main.addPlayer(player);
        });

        this._socket.on('disconnected', function(playerId) {
           log.debug('disconnected', playerId);
            that._main._world.removeTank(playerId);
        });

        this._socket.on('players', function(players) {
            _.each(players, function(player) {
                that._main.addPlayer(player);
            });
        });

        this._socket.on('sync', function(players) {
            log.debug('syncing');
            _.each(players, function(player) {
                that._main.sync(player);
            });
        });

        this._socket.on('shoot', function(player) {
            log.debug('shoot', player);
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
        log.debug('sending shoot');
        this._socket.emit('shoot', {});
    };

    obj.prototype.rotate = function(direction) {
        log.debug('sending rotate', direction.toString());
        this._socket.emit('rotate', direction.toString());
    };

    obj.prototype.stop = function() {
        log.debug('sending stop');
        this._socket.emit('stop');
    };

    return obj;
});
