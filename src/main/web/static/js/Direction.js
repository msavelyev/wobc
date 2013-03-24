var Direction = (function() {
    function Direction(degree, keys, str, type) {
        this._degree = degree;
        this._keys = keys;
        this._str = str;
        this._type = type;
        
        var that = this;
        this._keys.forEach(function(key) {
            Direction._keys[key] = that;
        });
    };
    
    Direction.prototype.getDegree = function() {
        return this._degree;
    };
    
    Direction.prototype.toString = function () {
        return this._str;
    };
    
    Direction.prototype.getType = function() {
        return this._type;
    };
    
    Direction.prototype.letter = function() {
        return this._str[0];
    };
    
    return Direction;
})();

Direction._keys = {};
Direction.fromKey = function(keycode) {
    if(Direction._keys[keycode]) {
        return Direction._keys[keycode];
    }
};

Direction.VERT = 'vert';
Direction.HORI = 'hori';

Direction.UP = new Direction(270, [Key.KEYCODE_W, Key.KEYCODE_UP], 'up', Direction.VERT);
Direction.DOWN = new Direction(90, [Key.KEYCODE_S, Key.KEYCODE_DOWN], 'down', Direction.VERT);
Direction.LEFT = new Direction(180, [Key.KEYCODE_A, Key.KEYCODE_LEFT], 'left', Direction.HORI);
Direction.RIGHT = new Direction(0, [Key.KEYCODE_D, Key.KEYCODE_RIGHT], 'right', Direction.HORI);