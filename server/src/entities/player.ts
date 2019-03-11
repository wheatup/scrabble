/**
 * Player entity
 * @author wheatup
 */

import WebSocket from 'ws';
import Match from './match';
declare const Buffer;

export default class Player {
	static players = {};
	static UUID: number = 0;

	static getPlayer(ws: WebSocket) {
		//@ts-ignore
		let uuid = ws.uuid;
		if (!uuid) {
			uuid = ++Player.UUID;
			let player = new Player(ws, uuid);
			Player.players[uuid] = player;
			return player;
		} else {
			let player = Player.players[uuid];
			player.ws = ws;
			return Player.players[uuid];
		}
	}

	ws: WebSocket = null;
	uuid: number = null;
	match: Match = null;

	constructor(ws: WebSocket, uuid: number) {
		this.ws = ws;
		this.uuid = uuid;
	}

	send(signal: string, data: any) {
		let pack = { signal, data };
		try {
			this.ws.send(Buffer.from(JSON.stringify(pack)).toString('base64'));
		} catch (ex) {
			// console.error(ex);
		}
	}

	remove() {
		if(this.match){
			this.match.leave(this);
			this.match = null;
		}
		delete Player.players[this.uuid];
	}
}
