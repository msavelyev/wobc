import {Main} from "../Main";
import 'createjs';
import {World} from "../../lib/game/World";

export class DebugGrid {

    private readonly grid: createjs.Shape;

    constructor(main: Main) {
        this.grid = new createjs.Shape();

        const graph = this.grid.graphics;
        graph.beginStroke('rgba(255, 255, 255, 0.3)');
        for(let x = 0; x < main.getWidth(); x += World.HALF_BLOCK_SIZE) {
            graph.moveTo(x, 0);
            graph.lineTo(x, main.getHeight());
        }
        for(let y = 0; y < main.getHeight(); y += World.HALF_BLOCK_SIZE) {
            graph.moveTo(0, y);
            graph.lineTo(main.getWidth(), y);
        }

        main.addChild(this.grid);
    }

}
