define(['src/lib/game/Key', 'src/lib/log'], function(Key, log) {
    var obj = function(degree, keys, str, type) {
        this._degree = degree;
        this._keys = keys;
        this._str = str;
        this._type = type;
        
        var that = this;
        this._keys.forEach(function(key) {
            obj._keys[key] = that;
        });
    };
    
    obj.prototype.getDegree = function() {
        return this._degree;
    };
    
    obj.prototype.toString = function () {
        return this._str;
    };
    
    obj.prototype.getType = function() {
        return this._type;
    };
    
    obj.prototype.letter = function() {
        return this._str[0];
    };

    obj._keys = {};
    obj.fromKey = function(keycode) {
        if(obj._keys[keycode]) {
            return obj._keys[keycode];
        }
    };

    obj.VERT = 'vert';
    obj.HORI = 'hori';

    obj.UP = new obj(270, [Key.KEYCODE_W, Key.KEYCODE_UP], 'up', obj.VERT);
    obj.DOWN = new obj(90, [Key.KEYCODE_S, Key.KEYCODE_DOWN], 'down', obj.VERT);
    obj.LEFT = new obj(180, [Key.KEYCODE_A, Key.KEYCODE_LEFT], 'left', obj.HORI);
    obj.RIGHT = new obj(0, [Key.KEYCODE_D, Key.KEYCODE_RIGHT], 'right', obj.HORI);

    obj.fromStr = function(str) {
        switch(str) {
            case 'up':
                return obj.UP;
            case 'down':
                return obj.DOWN;
            case 'left':
                return obj.LEFT;
            case 'right':
                return obj.RIGHT;
            default:
                log.error('wrong direction', str);
        }
    };

    return obj;
});
