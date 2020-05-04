import {Main} from "./Main";

import * as io from 'socket.io';
import {Server} from 'socket.io';
import {Direction} from "../lib/game/Direction";
import {Player} from "../lib/game/Player";

export class Socket {

    private readonly main: Main;
    private socket: Server;
    private pingTime: Date;

    constructor(main: Main) {
        this.main = main;

        const host = window.location.origin;
        console.debug('connecting to ', host);
        this.socket = io();
        this.pingTime = null;

        this.socket.on('start', (me: Player) => {
            console.debug('got playerId', me);
            this.main.createOwnTank(me);
        });

        this.socket.on('connected', (player: Player) => {
            console.debug('connected', player);
            this.main.addPlayer(player);
        });

        this.socket.on('disconnected', (playerId: string) => {
            console.debug('disconnected', playerId);
            this.main.world.removeTank(playerId);
        });

        this.socket.on('players', (players: Array<Player>) => {
            players.forEach(player => {
                this.main.addPlayer(player);
            });
        });

        this.socket.on('sync', (players: Array<Player>) => {
            console.debug('syncing');
            players.forEach(player => {
                this.main.sync(player);
            });
        });

        this.socket.on('shoot', (player: Player) => {
            console.debug('shoot', player);
            this.main.shoot(player);
        });

        this.socket.on('rotate', (player: Player) => {
            this.main.sync(player);
        });

        this.socket.on('stop', (player: Player) => {
            this.main.sync(player);
        });

        this.ping();

        this.socket.on('pong', () => {
            const latency = new Date().getTime() - this.pingTime.getTime();
            this.pingTime = null;

            this.main.updatePing(latency);
            setTimeout(() => {
                this.ping();
            }, 100);
        });
    };

    shoot() {
        console.debug('sending shoot');
        this.socket.emit('shoot', {});
    }

    rotate(direction: Direction) {
        console.debug('sending rotate', direction);
        this.socket.emit('rotate', direction);
    }

    stop() {
        console.debug('sending stop');
        this.socket.emit('stop');
    }

    ping() {
        this.socket.emit('ping');
        this.pingTime = new Date();
    }

}
