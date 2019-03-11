/**
 * Hexagon behavior
 * @author wheatup
 */
import PlayerTag from './PlayerTag';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Hexagon extends cc.Component {
	id: number = null;
	content: string = null;
	column: number = null;
	row: number = null;
	
	// Color settings
	color: cc.Color = new cc.Color(233, 233, 233, 255);
	normalColor: cc.Color = new cc.Color(233, 233, 233, 255);
	activateColor: cc.Color = new cc.Color(100, 150, 240, 255);
	incorrectColor: cc.Color = new cc.Color(230, 75, 30, 255);
	correctColor: cc.Color = new cc.Color(100, 255, 0, 255);
	opponentColor: cc.Color = new cc.Color(150, 150, 150, 255);

	textColor: cc.Color = new cc.Color(100, 100, 100, 255);
	textNormalColor: cc.Color = new cc.Color(100, 100, 100, 255);
	textActivateColor: cc.Color = new cc.Color(255, 255, 255, 255);
	textIncorrectColor: cc.Color = new cc.Color(255, 255, 255, 255);
	textCorrectColor: cc.Color = new cc.Color(20, 50, 0, 255);

	brightness: number = 1;

	_updatingColor: boolean = false;

	background: cc.Node = null;

	label: cc.Label = null;
	activated: boolean = false;

	orgPos: cc.Vec2 = null;
	locked: boolean = false;

	onLoad() {
		this.background = this.node.getChildByName('Background');
		this.label = this.node.getChildByName('Label').getComponent(cc.Label);
	}

	start() {
		this.node.scale = 0;
		new Wheen(this.node)
			.wait(300 * Math.random())
			.to({ scale: 1.1 }, 200, Wheen.Easing.Cubic.easeOut)
			.to({ scale: 1 }, 150, Wheen.Easing.Cubic.easeOut)
			.start();
	}

	setPosition(pos: cc.Vec2) {
		this.node.setPosition(pos);
		this.orgPos = new cc.Vec2(this.node.x, this.node.y);
	}

	setId(id: number) {
		this.id = id;
	}

	setColumnAndRow(column: number, row: number) {
		this.column = column;
		this.row = row;
		this.brightness = column % 2 === 0 ? 1 : 0.95;

		this.color = new cc.Color(this.color.getR() * this.brightness, this.color.getG() * this.brightness, this.color.getB() * this.brightness, 255);
		this.normalColor = new cc.Color(this.normalColor.getR() * this.brightness, this.normalColor.getG() * this.brightness, this.normalColor.getB() * this.brightness, 255);
		this.activateColor = new cc.Color(this.activateColor.getR() * this.brightness, this.activateColor.getG() * this.brightness, this.activateColor.getB() * this.brightness, 255);
		this.incorrectColor = new cc.Color(this.incorrectColor.getR() * this.brightness, this.incorrectColor.getG() * this.brightness, this.incorrectColor.getB() * this.brightness, 255);
		this.correctColor = new cc.Color(this.correctColor.getR() * this.brightness, this.correctColor.getG() * this.brightness, this.correctColor.getB() * this.brightness, 255);

		this.textColor = new cc.Color(this.textColor.getR() * this.brightness, this.textColor.getG() * this.brightness, this.textColor.getB() * this.brightness, 255);
		this.textActivateColor = new cc.Color(this.textActivateColor.getR() * this.brightness, this.textActivateColor.getG() * this.brightness, this.textActivateColor.getB() * this.brightness, 255);
		this.textCorrectColor = new cc.Color(this.textCorrectColor.getR() * this.brightness, this.textCorrectColor.getG() * this.brightness, this.textCorrectColor.getB() * this.brightness, 255);
		this.textIncorrectColor = new cc.Color(this.textIncorrectColor.getR() * this.brightness, this.textIncorrectColor.getG() * this.brightness, this.textIncorrectColor.getB() * this.brightness, 255);
		this.textNormalColor = new cc.Color(this.textNormalColor.getR() * this.brightness, this.textNormalColor.getG() * this.brightness, this.textNormalColor.getB() * this.brightness, 255);

		this.background.color = this.color;
		this.label.node.color = this.textColor;
	}

	setContent(content: string) {
		this.content = content;
		this.label.string = content;
	}

	update() {
		if (this._updatingColor && this.background) {
			this.background.color = this.color;
			this.label.node.color = this.textColor;
		}
	}

	activate() {
		if (this.activated || this.locked) return;
		this.activated = true;
		this._updatingColor = true;

		this.node.scale = 1;

		Wheen.stop(this.textColor);
		new Wheen(this.textColor).to(this.textActivateColor, 200).start();

		Wheen.stop(this.color);
		new Wheen(this.color)
			.to(this.activateColor, 200)
			.wait(100)
			.callFunc(() => (this._updatingColor = false))
			.start();

		Wheen.stop(this.node);

		new Wheen(this.node)
			.to({ y: this.orgPos.y + 10 }, 10, Wheen.Easing.Cubic.easeOut)
			.to({ y: this.orgPos.y }, 100, Wheen.Easing.Cubic.easeIn)
			.to({ y: this.orgPos.y + 2 }, 100, Wheen.Easing.Cubic.easeOut)
			.to({ y: this.orgPos.y }, 100, Wheen.Easing.Cubic.easeIn)
			.start();
	}

	deactivate(success?: boolean, replace?: string, me: boolean = true) {
		this.activated = false;
		this._updatingColor = true;

		if (success === undefined) {
			new Wheen(this.node).to({ x: this.orgPos.x }, 50, Wheen.Easing.Cubic.easeOut).start();

			Wheen.stop(this.textColor);
			new Wheen(this.textColor).to(this.textNormalColor, 200).start();

			Wheen.stop(this.color);
			new Wheen(this.color)
				.to(this.normalColor, 200)
				.wait(50)
				.callFunc(() => (this._updatingColor = false))
				.start();
		} else if (!success) {
			new Wheen(this.node)
				.to({ x: this.orgPos.x - 2 }, 30, Wheen.Easing.Cubic.easeOut)
				.to({ x: this.orgPos.x + 2 }, 30, Wheen.Easing.Cubic.easeOut)
				.loop(2)
				.to({ x: this.orgPos.x }, 50, Wheen.Easing.Cubic.easeOut)
				.start();

			Wheen.stop(this.textColor);
			new Wheen(this.textColor)
				.to(this.textIncorrectColor, 10)
				.to(this.textNormalColor, 500)
				.start();

			Wheen.stop(this.color);
			new Wheen(this.color)
				.to(this.incorrectColor, 10)
				.to(this.normalColor, 500)
				.wait(100)
				.callFunc(() => {
					this._updatingColor = false;
				})
				.start();
		} else {
			this.locked = true;
			this.content = replace;
			this.node.x = this.orgPos.x;
			Wheen.stop(this.node);
			let posMe = this.node.parent.convertToNodeSpaceAR(PlayerTag.me.node.parent.convertToWorldSpaceAR(PlayerTag.me.node.getPosition()));
			let posOpponent = this.node.parent.convertToNodeSpaceAR(PlayerTag.opponent.node.parent.convertToWorldSpaceAR(PlayerTag.opponent.node.getPosition()));
			let pos = me ? posMe : posOpponent;
			new Wheen(this.node)
				.wait(Math.random() * 100)
				.to({ x: this.node.x, y: this.node.y + 10 }, 200, Wheen.Easing.Cubic.easeIn)
				.wait(100 + Math.random() * 200)
				.to({ x: pos.x, y: pos.y, scale: 0.5 }, 500, Wheen.Easing.Cubic.easeOut)
				.callFunc(() => {
					this.node.scale = 0;
					this.label.string = this.content;
					this.node.x = this.orgPos.x;
					this.node.y = this.orgPos.y;
				})
				.to({ scale: 1 }, 300, Wheen.Easing.Cubic.easeOut)
				.callFunc(() => {
					this.locked = false;
					if (this.activated) {
						this.color = this.activateColor;
						this.textColor = this.textActivateColor;
						this.background.color = this.color;
						this.label.node.color = this.textColor;
					}
				})
				.start();

			if (me) {
				Wheen.stop(this.textColor);
				new Wheen(this.textColor)
					.to(this.textCorrectColor, 10)
					.to(this.textNormalColor, 500)
					.start();

				Wheen.stop(this.color);
				new Wheen(this.color)
					.to(this.correctColor, 10)
					.to(this.normalColor, 500)
					.wait(100)
					.callFunc(() => (this._updatingColor = false))
					.start();
			} else {
				Wheen.stop(this.color);
				new Wheen(this.color)
					.to(this.opponentColor, 10)
					.to(this.normalColor, 500)
					.wait(100)
					.callFunc(() => (this._updatingColor = false))
					.start();
			}
		}
	}
}
