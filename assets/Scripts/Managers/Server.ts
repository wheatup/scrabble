/**
 * Communicate with server.
 * @author wheatup
 */
import Events from '../Misc/Events';
import Config from './Config';
import Signal from '../Misc/Signal';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Server extends cc.Component {
	static $: Server = null;

	ws: WebSocket = null;
	pid: number = 0;

	onLoad() {
		Server.$ = this;
		whevent.on(Events.MULTIPLAYER, this.connect, this);

		whevent.on(Signal.UUID, this.onUUID, this);
		whevent.on(Signal.JOIN, this.onJoin, this);
		whevent.on(Signal.MATCH, this.onMatch, this);
		whevent.on(Signal.LEAVE, this.onLeave, this);
		whevent.on(Signal.CORRECT, this.onCorrect, this);
		whevent.on(Signal.WRONG, this.onWrong, this);
		whevent.on(Signal.RESULT, this.onResult, this);
	}

	onDestroy() {
		whevent.off(Events.MULTIPLAYER, this.connect, this);
		whevent.off(Signal.JOIN, this.onJoin, this);
		whevent.off(Signal.MATCH, this.onMatch, this);
		whevent.off(Signal.LEAVE, this.onLeave, this);
		whevent.off(Signal.CORRECT, this.onCorrect, this);
		whevent.off(Signal.WRONG, this.onWrong, this);
		whevent.off(Signal.RESULT, this.onResult, this);
	}

	connect() {
		whevent.emit(Events.TIP, {message: 'Connecting...', time: 0});
		this.ws = new WebSocket(Config.server);

		this.ws.addEventListener('open', this.onOpen.bind(this));
		this.ws.addEventListener('message', this.onMessage.bind(this));
		this.ws.addEventListener('close', this.onClose.bind(this));
	}

	onOpen() {
		whevent.emit(Events.TIP);
		cc.log('Connected to the server!');
		this.send(Signal.MATCH, { level: 0 });
	}

	onClose() {
		whevent.emit(Events.TIP, { message: 'Disconnected from server!' });
		cc.log('Disconnected from the server!');
		this.ws.removeEventListener('open', this.onOpen.bind(this));
		this.ws.removeEventListener('message', this.onMessage.bind(this));
		this.ws.removeEventListener('close', this.onClose.bind(this));
		whevent.emit(Events.LOST_CONNECTION);
	}

	onMessage({ data }) {
		let pack = JSON.parse(atob(data));
		whevent.emit(pack.signal, pack.data);
		cc.log('%cRECEIVE:', 'color:#4A3;', pack.signal, pack.data);
	}

	send(signal: string, data?: any) {
		cc.log('%cSENDING:', 'color:#36F;', signal, data);
		this.ws.send(btoa(JSON.stringify({ signal, data })));
	}

	onUUID(uuid: number) {
		this.pid = uuid;
		whevent.emit(Events.TIP, { message: 'Connected to server!' });
	}

	onJoin(uuid: number) {
		whevent.emit(Events.TIP, { message: 'Searching for opponents...', time: 0 });
	}

	onMatch({ level, text, time }) {
		whevent.emit(Events.GAME_START, { online: true, level, text, time });
		whevent.emit(Events.TIP);
	}

	onLeave(uuid: number) {
		whevent.emit(Events.TIP, { message: 'Your Opponent has left!' });
	}

	onCorrect({ uuid, ids, word, letters, score }) {
		whevent.emit(Events.CORRECT, { me: this.pid === uuid, ids, word, letters, score });
	}

	onWrong({ uuid, ids, word }) {
		if (uuid !== this.pid) return;
		whevent.emit(Events.WRONG, { ids, word });
	}

	onResult({ interrupted, score }) {
		let myScore = 0;
		let theirScore = 0;
		for (let id in score) {
			if (parseInt(id) === this.pid) {
				myScore = score[id].score;
			} else {
				theirScore = score[id].score;
			}
		}
		if (!interrupted) {
			if (myScore > theirScore) {
				whevent.emit(Events.TIP, { message: 'Winner!' });
			} else if (myScore < theirScore) {
				whevent.emit(Events.TIP, { message: 'Good effort!' });
			} else {
				whevent.emit(Events.TIP, { message: 'Draw!' });
			}
		}

		setTimeout(() => {
			whevent.emit(Events.MAIN_MENU);
		}, 2000);
	}
}
