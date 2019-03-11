/**
 * Display a timer when game is started
 */
import Events from '../Misc/Events';
import HexagonManager from '../Managers/HexagonManager';
import Signal from '../Misc/Signal';
import PlayerTag from './PlayerTag';
import Server from '../Managers/Server';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Timer extends cc.Component {
	label: cc.Label = null;

	time: number = 0;
	timer: any = null;

	onLoad() {
		this.label = this.node.getComponent(cc.Label);
		whevent.on(Events.GAME_START, this.onGameStart, this);
	}

	onDestroy() {
		whevent.off(Events.GAME_START, this.onGameStart, this);
	}

	onGameStart({ time }) {
		this.time = time;
		if (this.timer) {
			clearInterval(this.timer);
		}
		this.timer = setInterval(() => {
			this.time--;
			if (this.time < 0) {
				this.time = 0;
				clearInterval(this.timer);
				this.timer = null;
				if(!HexagonManager.$.online){
					let result = {interrupted: false, score: {}};
					result.score[Server.$.pid] = {};
					result.score[Server.$.pid + 1] = {};
					result.score[Server.$.pid].score = PlayerTag.me.score;
					result.score[Server.$.pid + 1].score = 0;
					whevent.emit(Signal.RESULT, result);
				}
			}
			this.label.string = this.time + '';
		}, 1000);
	}
}
