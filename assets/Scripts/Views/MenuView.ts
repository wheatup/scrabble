/**
 * Menu view manager
 * @author wheatup
 */

import Events from '../Misc/Events';
import GameManager from '../Managers/GameManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuView extends cc.Component {
	@property(cc.Node)
	btnOffline: cc.Node = null;

	@property(cc.Node)
	btnOnline: cc.Node = null;

	onLoad() {
		this.btnOffline.on(cc.Node.EventType.TOUCH_END, this.onClickPlayOffline, this);
		this.btnOnline.on(cc.Node.EventType.TOUCH_END, this.onClickPlayOnline, this);
		whevent.on(Events.GAME_READY, this.onGameReady, this);
		whevent.on(Events.GAME_START, this.hide, this);
		whevent.on(Events.LOST_CONNECTION, this.show, this);
		whevent.on(Events.MAIN_MENU, this.show, this);
	}

	onDestroy() {
		this.btnOffline.off(cc.Node.EventType.TOUCH_END, this.onClickPlayOffline, this);
		this.btnOnline.off(cc.Node.EventType.TOUCH_END, this.onClickPlayOnline, this);
		whevent.off(Events.GAME_READY, this.onGameReady, this);
		whevent.off(Events.GAME_START, this.hide, this);
		whevent.off(Events.LOST_CONNECTION, this.show, this);
		whevent.off(Events.MAIN_MENU, this.show, this);
	}

	start() {
		this.node.active = true;
		this.btnOffline.getComponent(cc.Button).interactable = false;
		this.btnOnline.getComponent(cc.Button).interactable = false;
	}

	onClickPlayOffline() {
		if(!this.btnOffline.getComponent(cc.Button).interactable) return;
		GameManager.$.playOffline();
	}

	onClickPlayOnline() {
		if(!this.btnOnline.getComponent(cc.Button).interactable) return;
		GameManager.$.playOnline();
	}

	onGameStart() {
		this.hide();
	}

	onGameReady() {
		this.btnOffline.getComponent(cc.Button).interactable = true;
		this.btnOnline.getComponent(cc.Button).interactable = true;
	}

	show(){
		this.node.active = true;
	}

	hide(){
		this.node.active = false;
	}
}
