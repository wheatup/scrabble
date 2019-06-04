/**
 * Server
 * @author wheatup
 */

import WebSocket, { Server as WebSocketServer } from 'ws';
import * as express from 'express';
import * as http from 'http';
import Player from './entities/player';
import Signal from './enums/signal';
import * as whevent from 'whevent';
import * as fs from 'fs';
import signal from './enums/signal';
import Match from './entities/match';
declare const Buffer;

export default class Server {
	static $: Server = null;

	httpServer: http.Server = null;
	wss: WebSocketServer = null;
	config: any = null;
	words: string[] = [];

	constructor() {
		Server.$ = this;
	}

	async init() {
		console.log('Loading config...');
		this.config = await this.loadConfig();
		console.log('Loading dictionary...');
		this.words = await this.loadWords();
		console.log('Creating http server...');
		let app = express();
		this.httpServer = http.createServer(app);
		this.httpServer.listen(process.env.PORT || this.config.port);
		console.log('Setting up ws server...');
		this.setupWebSocket();
		this.bindEvents();
	}

	bindEvents() {
		whevent.on(signal.MATCH, this.onRequestMatch, this);
		whevent.on(signal.VALIDATE, this.onValidate, this);
	}

	onRequestMatch({ player, data }) {
		let match = Match.getMatch();
		match.join(player);
	}

	onValidate({player, data}){
		let match: Match = player.match;
		if(match && match.running){
			match.validate(player, data.data);
		}
	}

	setupWebSocket() {
		//@ts-ignore
		this.wss = new WebSocketServer({server: this.httpServer}, () => {
			console.log('\x1b[33m%s\x1b[0m', `Websocket server listening on port ${this.config.port}...`);
			this.wss.on('connection', ws => {
				let player = Player.getPlayer(ws);
				this.onConnection(player);
				ws.on('message', (message: string) => {
					this.onMessage(player, message);
				});
				ws.on('close', (ws: WebSocket) => {
					this.onClose(player);
				});
			});
		});
	}

	loadConfig(): Promise<any> {
		return new Promise((resolve, reject) => {
			fs.readFile('./resources/config.json', (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(JSON.parse(data.toString()));
				}
			});
		});
	}

	loadWords(): Promise<any> {
		return new Promise((resolve, reject) => {
			fs.readFile('./resources/words.json', (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(JSON.parse(data.toString()));
				}
			});
		});
	}

	onConnection(player: Player) {
		console.log(`Player ${player.uuid} has connected!`);
		player.send(Signal.UUID, player.uuid);
	}

	onClose(player: Player) {
		player.remove();
		console.log(`Player ${player.uuid} has disconnected!`);
	}

	onError(player: Player, err) {
		console.log(`Player ${player.uuid} has encountered an error!`, err);
	}

	onMessage(player: Player, message: string) {
		try {
			let data = JSON.parse(Buffer.from(message, 'base64').toString());
			console.log(`Player ${player.uuid}: `, data);
			whevent.emit(data.signal, { player, data });
		} catch (ex) {
			console.error(ex);
			console.error(`Player ${player.uuid} unknown package: `, message);
		}
	}

	send(player: Player, signal: string, message: object) {
		player.send(signal, message);
	}
}
