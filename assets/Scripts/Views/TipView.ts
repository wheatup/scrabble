/**
 * Tip view manager
 * @author wheatup
 */

import Events from '../Misc/Events';

const { ccclass, property } = cc._decorator;

@ccclass
export default class TipView extends cc.Component {
	background: cc.Node = null;
	label: cc.Label = null;

	showing: boolean = false;
	timer = null;

	onLoad() {
		this.background = this.node.getChildByName('BG');
		this.label = this.node.getChildByName('Label').getComponent(cc.Label);
		whevent.on(Events.TIP, this.onTip, this);
		this.node.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
		this.node.active = false;
	}

	onDestroy() {
		whevent.off(Events.TIP, this.onTip, this);
		this.node.off(cc.Node.EventType.TOUCH_START, this.onTouch, this);
	}

	onTouch(){

	}

	onTip(data) {
		if (!data || !data.message) {
			this.hide();
		} else {
			let time = 2000;
			if (data.time !== undefined) {
				time = data.time;
			}
			this.show(data.message, time);
		}
	}

	show(message, time) {
		this.showing = true;
		this.node.active = true;
		this.label.string = message;
		Wheen.stop(this.background);
		new Wheen(this.background).to({ opacity: 180 }, 200).start();

		Wheen.stop(this.label.node);
		new Wheen(this.label.node).to({ opacity: 255 }, 200).start();

		if (this.timer) {
			clearTimeout(this.timer);
		}
		if (time > 0) {
			this.timer = setTimeout(this.hide.bind(this), time);
		}
	}

	hide() {
		this.showing = false;
		Wheen.stop(this.background);
		new Wheen(this.background).to({ opacity: 0 }, 200).start();

		Wheen.stop(this.label.node);
		new Wheen(this.label.node)
			.to({ opacity: 0 }, 200)
			.callFunc(() => {
				this.node.active = false;
			})
			.start();
	}
}
