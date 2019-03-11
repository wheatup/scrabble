/**
 * Game view manager
 * @author wheatup
 */

import Events from '../Misc/Events';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameView extends cc.Component {
	onLoad() {
		whevent.on(Events.GAME_START, this.onGameStart, this);
		whevent.on(Events.LOST_CONNECTION, this.hide, this);
		whevent.on(Events.MAIN_MENU, this.hide, this);
	}

	onDestroy() {
		whevent.off(Events.GAME_START, this.onGameStart, this);
		whevent.off(Events.LOST_CONNECTION, this.hide, this);
		whevent.on(Events.MAIN_MENU, this.hide, this);
	}

	start(){
		this.hide();
	}

	onGameStart() {
		this.node.active = true;
	}

	show(){
		this.node.active = true;
	}

	hide(){
		this.node.active = false;
	}
}
