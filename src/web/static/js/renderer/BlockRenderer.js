define(['BlockType', 'BlockHelper'], function(BlockType, BlockHelper) {
    var obj = function(main) {
        this._main = main;
        this._main.registerTick(this);

        this._blocks = {};
        this._initialized = false;
        this._images = {};
        this._bricksSubtypes = {};
    };

    var createNewBlockImage = function(that, block) {
        var type = BlockType.toString(block._type);
        var subType = block._subtype;
        var id = block._id;

        var frames = BlockHelper[type].frames[subType];
        var animations = BlockHelper[type].animations;
        var image = new createjs.Sprite(new createjs.SpriteSheet({
            images: [that._main.getSpritesheet()],
            frames: frames,
            animations: animations
        }));

        image.x = block.getX();
        image.y = block.getY();
        image.gotoAndPlay('first');

        that._main.addChild(image);
        that._images[id] = image;
    };

    var initBlock = function(that, block) {
        var id = block._id;
        that._blocks[id] = block;

        var blockType = block._type;
        if(blockType != BlockType.EMPTY) {
            createNewBlockImage(that, block);
        }

        if(blockType == BlockType.BRICK) {
            that._bricksSubtypes[id] = block._subtype;
        }
    };

    var removeBlockImage = function(that, block) {
        var id = block._id;
        var image = that._images[id];
        image.stop();
        that._main.removeChild(image);
        delete that._images[id];
    };


    var changeBlock = function(that, block) {
        var id = block._id;
        var subtype = block._subtype;
        if(block._type == BlockType.BRICK && that._bricksSubtypes[id] != subtype) {
            that._bricksSubtypes[id] = subtype;
            removeBlockImage(that, block);

            if (subtype != 'none') {
                createNewBlockImage(that, block);
            }
        }
    };

    obj.prototype.tick = function(event) {
        var world = this._main._world;
        var that = this;
        _.each(world._level, function (x) {
            _.each(x, function (block) {
                if(!that._initialized) {
                    initBlock(that, block);
                } else {
                    changeBlock(that, block);
                }
            });
        });

        if(!this._initialized) {
            this._initialized = true;
        }
    };

    return obj;
});
