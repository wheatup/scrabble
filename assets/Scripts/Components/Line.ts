/**
 * Draw lines while player connecting hexagons
 * @author wheatup
 */

import Events from '../Misc/Events';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Line extends cc.Component {
	graphics: cc.Graphics = null;

	onLoad() {
		whevent.on(Events.CHAIN, this.onChain, this);
		whevent.on(Events.GAME_START, this.onGameStart, this);
		this.graphics = this.node.getComponent(cc.Graphics);
	}

	onDestroy() {
		whevent.off(Events.CHAIN, this.onChain, this);
		whevent.off(Events.GAME_START, this.onGameStart, this);
	}

	onGameStart(){
		this.graphics.clear();
	}

	onChain(chain: cc.Node[]) {
		this.graphics.clear();
		for (let i = 0; i < chain.length; i++) {
			let hex = chain[i];
			if (i === 0) {
				this.graphics.moveTo(hex.x, hex.y);
			} else {
				this.graphics.lineTo(hex.x, hex.y);
			}
		}
		this.graphics.stroke();
	}
}
