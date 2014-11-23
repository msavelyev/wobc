define(function() {
    var bounds = function(x, y, w, h) {
        return {
            x: x,
            y: y,
            width: w,
            height: h
        }
    };

    return {
        brick: {
            frames: {
                default: [[16, 192, 16, 16, 0,  0,  0]],
                u:       [[16, 192, 16,  8, 0,  0,  0]],
                d:       [[16, 200, 16,  8, 0,  0, -8]],
                l:       [[16, 192,  8, 16, 0,  0,  0]],
                r:       [[24, 192,  8, 16, 0, -8,  0]],
                ul:      [[16, 192,  8,  8, 0,  0,  0]],
                ur:      [[24, 192,  8,  8, 0, -8,  0]],
                dl:      [[16, 200,  8,  8, 0,  0, -8]],
                dr:      [[24, 200,  8,  8, 0, -8, -8]],
                none:    [null]
            },
            animations: {first: 0},
            transitions: {
                default: {
                    left:   'l',
                    right:  'r',
                    up:     'u',
                    down:   'd'
                },
                u: {
                    left:   'ul',
                    right:  'ur',
                    up:     'none',
                    down:   'none'
                },
                d: {
                    left:   'dl',
                    right:  'dr',
                    up:     'none',
                    down:   'none'
                },
                l: {
                    left:   'none',
                    right:  'none',
                    up:     'ul',
                    down:   'dl'
                },
                r: {
                    left:   'none',
                    right:  'none',
                    up:     'ur',
                    down:   'dr'
                },
                ul: { left: 'none', right: 'none', up: 'none', down: 'none' },
                ur: { left: 'none', right: 'none', up: 'none', down: 'none' },
                dl: { left: 'none', right: 'none', up: 'none', down: 'none' },
                dr: { left: 'none', right: 'none', up: 'none', down: 'none' }
            },
            subtypeBounds: {
                default: bounds(0, 0, 16, 16),
                u:       bounds(0, 0, 16, 8),
                d:       bounds(0, 8, 16, 8),
                l:       bounds(0, 0, 8, 16),
                r:       bounds(8, 0, 8, 16),
                ul:      bounds(0, 0, 8, 8),
                ur:      bounds(8, 0, 8, 8),
                dl:      bounds(0, 8, 8, 8),
                dr:      bounds(8, 8, 8, 8)
            }
        },

        stone: {
            frames: {
                default: [[32, 192, 16, 16, 0, 0, 0]]
            },
            animations: {first: 0}
        },

        empty: {
            frames: {
                default: [[0, 192, 16, 16, 0, 0, 0]]
            },
            animations: {first: 0}
        },

        water: {
            frames: {
                default: [
                    [0, 208, 16, 16, 0, 0, 0],
                    [16, 208, 16, 16, 0, 0, 0]
                ]
            },
            animations: {
                first: {
                    frames: [0, 1],
                    speed: 0.03125
                }
            }
        }
    };
});
