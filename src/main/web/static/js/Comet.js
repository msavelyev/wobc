var Comet = (function () {
    function Comet(main) {
        this._main = main;
        this._cometd = $.cometd;

        this._cometd.configure({
            url: "http://54.225.155.22:8080/cometd",
            logLevel: 'info'
        });
        
        this._connected = false;

        var that = this;
        this._cometd.addListener('/meta/handshake', function(handshake) {
            that._metaHandshake.apply(that, [handshake]);
        });
        this._cometd.addListener('/meta/connect', function(message) {
            that._metaConnect.apply(that, [message]);
        });

        this._cometd.handshake();
    };
    
    Comet.prototype.disconnect = function() {
        this._cometd.disconnect(true);
    };

    Comet.prototype._connectionEstablished = function() {
        console.log( 'connected' );
//        this._onConnect();
    };

    Comet.prototype._connectionBroken = function() {
        console.log( 'connection broken' );
    };

    Comet.prototype._connectionClosed = function() {
        console.log( 'disconnected' );
    };

    Comet.prototype._metaConnect = function(message) {
        if(this._cometd.isDisconnected()) {
            this._connected = false;
            this._connectionClosed();
            return;
        }

        var wasConnected = this._connected;
        this._connected = message.successful === true;
        if(!wasConnected && this._connected) {
            this._connectionEstablished();
        } else if(wasConnected && !this._connected) {
            this._connectionBroken();
        }
    }
    
    Comet.prototype.send = function(data) {
        this._cometd.publish('/service/action', data);
    };

    // Function invoked when first contacting the server and
    // when the server has lost the state of this client
    Comet.prototype._metaHandshake = function(handshake) {
        if(handshake.successful === true) {
            console.log('publishing');
            var that = this;
            this._cometd.batch(function() {
                that._cometd.addListener('/service/sendPlayerId', function(message) {
                    var data = message.data;
                    that._main.createTank(data.playerId, data.x, data.y);
                });
                that._cometd.subscribe('/game/connected', function(message) {
                    var data = message.data;
                    that._main.addTank(data.playerId, data.x, data.y);
                });
                that._cometd.subscribe('/game/disconnected', function(message) {
                    that._main.removeTank(message.data.playerId);
                });
                that._cometd.subscribe('/game/action', function(message) {
                    that._main.performAction(message.data);
                });
                // Publish on a service channel since the message is for the server only
                that._cometd.publish('/service/requestPlayerId', {});
            });
        }
    }
    
    return Comet;
})();