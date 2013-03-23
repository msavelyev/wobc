var Direction = new((function() {
    function Direction() {
        this.up = 270;
        this.down = 90;
        this.left = 180;
        this.right = 0;
    };
    
    Direction.prototype.fromKey = function (keycode) {
        switch(keycode) {
            case Key.KEYCODE_A:
            case Key.KEYCODE_LEFT:
                return this.left;
            case Key.KEYCODE_D:
            case Key.KEYCODE_RIGHT:
                return this.right;
            case Key.KEYCODE_W:
            case Key.KEYCODE_UP:
                return this.up;
            case Key.KEYCODE_S:
            case Key.KEYCODE_DOWN:
                return this.down;
            default:
                return undefined;
        }
    };
    
    Direction.prototype.toString = function (direction) {
        switch(direction) {
            case this.up:
                return 'up';
            case this.down:
                return 'down';
            case this.left:
                return 'left';
            case this.right:
                return 'right';
        }
    };
    
    return Direction;
})());