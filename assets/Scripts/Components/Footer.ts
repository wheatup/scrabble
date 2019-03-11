/**
 * Control the footer of the game
 * Display the realtime word, and the words both players got
 * @author wheatup
 */

import Hexagon from "./Hexagon";
import Events from "../Misc/Events";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Footer extends cc.Component {
	label: cc.Label = null;
	leftLabel: cc.Label = null;
	rightLabel: cc.Label = null;

	onLoad() {
		this.label = this.node.getChildByName('Label').getComponent(cc.Label);
		this.leftLabel = this.node.getChildByName('LeftLabel').getComponent(cc.Label);
		this.rightLabel = this.node.getChildByName('RightLabel').getComponent(cc.Label);
		whevent.on(Events.GAME_START, this.onGameStart, this);
		whevent.on(Events.CHAIN, this.onChain, this);
		whevent.on(Events.CORRECT, this.onCorrect, this);
	}

	onDestroy(){
		whevent.off(Events.GAME_START, this.onGameStart, this);
		whevent.off(Events.CHAIN, this.onChain, this);
		whevent.off(Events.CORRECT, this.onCorrect, this);
	}

	onCorrect({me, word}){
		let label = me ? this.leftLabel : this.rightLabel;
		label.string = word + '\n' + label.string;
	}

	onGameStart(){
		let text = '';
		this.label.string = text;
		this.leftLabel.string = '';
		this.rightLabel.string = '';
	}

	onChain(chain: cc.Node[]) {
		let text = '';
		chain.forEach(hexagon => text += hexagon.getComponent(Hexagon).content);
		this.label.string = text;
	}
}
