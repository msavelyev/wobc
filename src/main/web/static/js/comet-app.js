var cometd = $.cometd;

$(document).ready(function()
{
    function _connectionEstablished()
    {
        console.log( 'connected' );
        onConnect();
    }

    function _connectionBroken()
    {
        console.log( 'connection broken' );
    }

    function _connectionClosed()
    {
        console.log( 'disconnected' );
    }

    // Function that manages the connection status with the Bayeux server
    var _connected = false;
    function _metaConnect(message)
    {
        if (cometd.isDisconnected())
        {
            _connected = false;
            _connectionClosed();
            return;
        }

        var wasConnected = _connected;
        _connected = message.successful === true;
        if (!wasConnected && _connected)
        {
            _connectionEstablished();
        }
        else if (wasConnected && !_connected)
        {
            _connectionBroken();
        }
    }

    // Function invoked when first contacting the server and
    // when the server has lost the state of this client
    function _metaHandshake(handshake)
    {
        if (handshake.successful === true)
        {
            console.log('publishing');
            cometd.batch(function()
            {
                cometd.subscribe('/hello', function(message)
                {
                    alert(message.data.msgText);
                });
                // Publish on a service channel since the message is for the server only
                cometd.publish('/service/hello', { msgText: 'Hello!' });
            });
        }
    }

    // Disconnect when the page unloads
    $(window).unload(function()
    {
        cometd.disconnect(true);
    });

    var cometURL = location.protocol + "//localhost:8080/cometd";
    cometd.configure({
        url: cometURL,
        logLevel: 'info'
    });

    cometd.addListener('/meta/handshake', _metaHandshake);
    cometd.addListener('/meta/connect', _metaConnect);

    cometd.handshake();

//    $( '#btn').click( function() {
//        cometd.publish( '/service/hello', { nick: $( '#nick' ).val(), msgText: $( '#msg' ).val() } );
//    } );
});