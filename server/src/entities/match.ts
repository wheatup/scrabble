/**
 * Match entity
 * @author wheatup
 */

import Player from './player';
import signal from '../enums/signal';
import Utils from '../utils/utils';
import Server from '../server';

let MIID = 0;
export default class Match {
	static pendingMatches: Match[] = [];

	static getMatch(): Match {
		if (Match.pendingMatches.length > 0) {
			return Match.pendingMatches.pop();
		} else {
			let match = new Match(1);
			Match.pendingMatches.push(match);
			return match;
		}
	}

	level: number = 0;
	players: Player[] = [];
	time: number = 120;
	letters: string = null;
	running: boolean = false;

	score = {};

	constructor(level: number) {
		this.level = level;
		let counts = [39, 61];
		let ids = [];
		for(let i = 0; i < counts[level]; i++){
			ids.push(i);
		}
		this.letters = Utils.generateLetters2(ids);
	}

	broadcast(signal: string, data?: any) {
		let totalPlayers = this.players.length;
		for (let i = totalPlayers - 1; i >= 0; i--) {
			let player = this.players[i];
			if (player) {
				player.send(signal, data);
			}
		}
	}

	broadcastExept(excludedPlayer: Player, signal: string, data?: any) {
		let totalPlayers = this.players.length;
		for (let i = totalPlayers - 1; i >= 0; i--) {
			let player = this.players[i];
			if (player !== excludedPlayer) {
				player.send(signal, data);
			}
		}
	}

	start() {
		this.running = true;
		this.broadcast(signal.MATCH, { level: this.level, text: this.letters, time: this.time });
		setTimeout(() => {
			this.timeup();
		}, this.time * 1000);
		this.close();
	}

	stop() {
		this.running = false;
		this.broadcast(signal.RESULT, { interrupted: this.players.length < 2, score: this.score });
		this.close();
		this.players.forEach(player => {
			this.leave(player, true);
		});
	}

	timeup() {
		if (this.running) {
			this.stop();
		}
	}

	join(player: Player) {
		if (this.players.length >= 2 || this.players.indexOf(player) >= 0) {
			return;
		}

		this.players.push(player);
		player.match = this;
		this.broadcast(signal.JOIN, { uuid: player.uuid });
		this.score[player.uuid] = {
			score: 0
		};

		if (this.players.length >= 2) {
			this.start();
		}
	}

	validate(player: Player, ids: number[]) {
		let text = '';
		ids.forEach(id => {
			text += this.letters[id];
		});
		if (Utils.isWord(text.toLowerCase())) {
			let letters = Utils.generateLetters2(ids);
			let lettersArr = this.letters.split('');
			let score = Server.$.config.scoreMap[text.length < Server.$.config.scoreMap.length ? text.length : Server.$.config.scoreMap.length - 1];
			ids.forEach((id, index) => {
				lettersArr[id] = letters[index];
			});
			this.letters = lettersArr.join('');
			this.score[player.uuid].score += score;
			this.broadcast(signal.CORRECT, { uuid: player.uuid, ids, word: text, letters, score });
		} else {
			this.broadcast(signal.WRONG, { uuid: player.uuid, ids });
		}
	}

	leave(player: Player, silence?: boolean) {
		if (this.players.indexOf(player) < 0) {
			return;
		}
		player.match = null;
		this.players.splice(this.players.indexOf(player), 1);
		if (!silence) {
			this.broadcast(signal.LEAVE, { uuid: player.uuid });
		}
		if (this.running) {
			this.stop();
		}
		this.close();
	}

	close() {
		if (Match.pendingMatches.indexOf(this) >= 0) {
			Match.pendingMatches.splice(Match.pendingMatches.indexOf(this), 1);
		}
	}
}
