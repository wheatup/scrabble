/**
 * Game manager, controls major behaviours of the game.
 * @author wheatup
 */
import Events from '../Misc/Events';
import WordManager from './WordManager';
import HexagonManager from './HexagonManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
	static $: GameManager = null;

	checks = {
		config: false,
		resource: false
	};

	onLoad() {
		GameManager.$ = this;
		whevent.on(Events.LOADED_CONFIG, this.onLoadedConfig, this);
		whevent.on(Events.LOADED_RESOURCE, this.onLoadedResource, this);
	}

	onLoadedConfig() {
		this.checks.config = true;
		this.checkReady();
	}

	onLoadedResource() {
		this.checks.resource = true;
		this.checkReady();
	}

	checkReady() {
		let ready = true;
		for (let check in this.checks) {
			if (!this.checks[check]) {
				ready = false;
				break;
			}
		}
		if (ready) {
			whevent.emit(Events.GAME_READY);
		}
	}

	playOffline() {
		let text = '';
		let ids = [];
		for (let i = 0; i < HexagonManager.layerTotals[1 + 4]; i++) {
			ids.push(i);
		}
		text = WordManager.$.generateRandomLetters2(ids);
		whevent.emit(Events.GAME_START, { online: false, level: 1, time: 120, text });
	}

	playOnline() {
		whevent.emit(Events.MULTIPLAYER);
	}
}
