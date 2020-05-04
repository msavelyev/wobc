import {Main} from "../Main";
import {BlockType} from "../../lib/game/BlockType";
import {BlockHelper, BlockSubtype} from "../../lib/game/BlockHelper";
import {Tick, TickEvent} from "../../lib/game/Tick";
import {Block} from "../../lib/game/Block";
import 'createjs';

export class BlockRenderer implements Tick {

    private main: Main;
    private readonly blocks: Map<string, Block>;
    private initialized: boolean;
    private readonly images: Map<string, createjs.Sprite>;
    private readonly bricksSubtypes: Map<string, BlockSubtype>;

    constructor(main: Main) {
        this.main = main;
        this.main.registerTick(this);

        this.blocks = new Map<string, Block>();
        this.initialized = false;
        this.images = new Map<string, createjs.Sprite>();
        this.bricksSubtypes = new Map<string, BlockSubtype>();
    }

    private createNewBlockImage(block: Block) {
        const configuration = BlockHelper.forType(block.type);
        const frames = configuration.frames.get(block.subtype);
        const animations = configuration.animations;
        const image = new createjs.Sprite(new createjs.SpriteSheet({
            images: [this.main.getSpritesheet()],
            frames: frames,
            animations: animations
        }));

        image.x = block.getX();
        image.y = block.getY();
        image.gotoAndPlay('first');

        this.main.addChild(image);
        this.images.set(block.id, image);
    }

    private initBlock(block: Block) {
        const id = block.id;
        this.blocks.set(id, block);

        const blockType = block.type;
        if(blockType != BlockType.EMPTY) {
            this.createNewBlockImage(block);
        }

        if(blockType == BlockType.BRICK) {
            this.bricksSubtypes.set(id, block.subtype);
        }
    }

    private removeBlockImage(block: Block) {
        const id = block.id;
        const image = this.images.get(id);
        image.stop();
        this.main.removeChild(image);
        this.images.delete(id);
    }

    private changeBlock(block: Block) {
        const id = block.id;
        const subtype = block.subtype;
        if(block.type == BlockType.BRICK && this.bricksSubtypes.get(id) != subtype) {
            this.bricksSubtypes.set(id, subtype);
            this.removeBlockImage(block);

            if (subtype != BlockSubtype.NONE) {
                this.createNewBlockImage(block);
            }
        }
    }

    tick(event: TickEvent) {
        const world = this.main.world;

        world.level.forEach(x => {
            x.forEach(block => {
                if(!this.initialized) {
                    this.initBlock(block);
                } else {
                    this.changeBlock(block);
                }
            });
        })

        if(!this.initialized) {
            this.initialized = true;
        }
    }
}
