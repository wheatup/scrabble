/**
 * Hexagon manager
 * @wheatup
 */
import Hexagon from '../Components/Hexagon';
import Events from '../Misc/Events';
import WordManager from './WordManager';
import Config from './Config';
import Server from './Server';
import Signal from '../Misc/Signal';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HexagonManager extends cc.Component {
	@property(cc.Prefab)
	hexagonPrefab: cc.Prefab = null;

	@property(cc.Node)
	hexagonContainer: cc.Node = null;

	static $: HexagonManager = null;

	hexagons: cc.Node[] = [];
	hexagonMap: cc.Node[][] = [];
	letters: string = '';

	gap: number = 0;
	layers: number = 5;

	_totalColumns: number = 0;
	_hexagonWidth: number = 0;
	_hexagonHeight: number = 0;
	_distX: number = 0;
	_distY: number = 0;

	hexagonChain: cc.Node[] = [];

	online: boolean = false;

	static layerTotals = [0, 1, 7, 19, 37, 61, 91];

	controllable: boolean = false;

	onLoad() {
		HexagonManager.$ = this;
		this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
		this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
		this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
		whevent.on(Events.GAME_START, this.onGameStart, this);
		whevent.on(Events.WRONG, this.onWrong, this);
		whevent.on(Events.CORRECT, this.onCorrect, this);

		if (!this.hexagonContainer) {
			this.hexagonContainer = this.node;
		}
	}

	onDestroy() {
		this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
		this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
		this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
		whevent.off(Events.GAME_START, this.onGameStart, this);
		whevent.off(Events.WRONG, this.onWrong, this);
		whevent.off(Events.CORRECT, this.onCorrect, this);
	}

	onLayerChange(layer: number) {
		if (layer === this.layers) return;
		this.layers = layer;
		this.buildHexagons();
	}

	onGapChange(gap: number) {
		if (gap === this.gap) return;
		this.gap = gap;
		this.buildHexagons();
	}

	onWrong({ ids, word }) {
		this.controllable = true;
		ids.forEach(id => {
			let hexagon = this.getHexagonById(id);
			if (hexagon) {
				hexagon.getComponent(Hexagon).deactivate(false);
			}
		});
		this.hexagonChain.length = 0;
		this.chainUpdated();
	}

	onCorrect({ me, ids, word, letters }) {
		this.controllable = true;
		let arr = this.letters.split('');
		ids.forEach((id, index) => {
			arr[id] = letters[index];
			let hex = this.getHexagonById(id);
			if (hex) {
				hex.getComponent(Hexagon).deactivate(true, letters[index], me);
			}
		});
		this.letters = arr.join('');
		if (me) {
			this.hexagonChain.length = 0;
			this.chainUpdated();
		} else {
			let collided = false;
			let myIds = [];
			this.hexagonChain.forEach(hexagon => {
				myIds.push(hexagon.getComponent(Hexagon).id);
			});
			for (let id of ids) {
				if (myIds.indexOf(id) >= 0) {
					collided = true;
					break;
				}
			}
			if(collided){
				this.clearChain(true);
			}
		}
	}

	onTouchStart(e: cc.Event.EventTouch) {
		if (!this.controllable) return;
		let pos = this.node.convertToNodeSpaceAR(e.touch.getLocation());
		let hexagon = this.getHexagonByPosition(pos);
		this.addToChain(hexagon);
	}

	onTouchMove(e) {
		if (!this.controllable) return;
		let pos = this.node.convertToNodeSpaceAR(e.touch.getLocation());
		let hexagon = this.getHexagonByPosition(pos);
		this.addToChain(hexagon);
	}

	onTouchEnd(e) {
		if (!this.controllable) return;
		this.clearChain();
	}

	clearChain(force?: boolean) {
		if (force || this.hexagonChain.length <= 2) {
			this.hexagonChain.forEach(hexagon => {
				hexagon.getComponent(Hexagon).deactivate();
			});
			this.hexagonChain.length = 0;
			this.chainUpdated();
		} else {
			this.controllable = false;
			if (!this.online) {
				let text = '';
				this.hexagonChain.forEach(hexagon => {
					text += hexagon.getComponent(Hexagon).content;
				});

				let isWord = WordManager.$.isWord(text.toLowerCase());
				let ids = [];
				this.hexagonChain.forEach(hexagon => {
					ids.push(hexagon.getComponent(Hexagon).id);
				});
				if (isWord) {
					let letters = WordManager.$.generateRandomLetters2(ids);
					let score = Config.scoreMap[text.length < Config.scoreMap.length ? text.length : Config.scoreMap.length - 1];
					whevent.emit(Events.CORRECT, { me: true, ids, word: text, letters, score });
				} else {
					let word = '';
					ids.forEach(id => {
						word += this.letters[id];
					});
					whevent.emit(Events.WRONG, { ids, word });
				}
				this.hexagonChain.length = 0;
				this.chainUpdated();
			} else {
				let ids = [];
				this.hexagonChain.forEach(hexagon => {
					ids.push(hexagon.getComponent(Hexagon).id);
				});

				Server.$.send(Signal.VALIDATE, ids);
			}
		}
	}

	onGameStart({ online, text, level }) {
		this.online = online;
		this.letters = text;
		this.layers = level + 4;
		this.buildHexagons();
		whevent.emit(Events.TIP, { message: 'Game Start!', time: 1000 });
		this.controllable = true;
		this.clearChain();
	}

	buildHexagons() {
		this.hexagonContainer.destroyAllChildren();
		this.hexagons = [];
		this.hexagonMap = [];

		this._hexagonWidth = 0;
		this._hexagonHeight = 0;
		this._distX = 0;
		this._distY = 0;
		this._totalColumns = (this.layers - 1) * 2 + 1;

		let id = 0;
		for (let column = 0; column < this._totalColumns; column++) {
			this.hexagonMap[column] = [];
			let columnTotal = this.layers + (column < this.layers - 1 ? column : (this.layers - 1) * 2 - column);
			for (let row = 0; row < columnTotal; row++) {
				let hexagon = cc.instantiate(this.hexagonPrefab);
				hexagon.parent = this.hexagonContainer;
				hexagon.width = 70 + 24 * (5 - this.layers);
				hexagon.height = 70 + 24 * (5 - this.layers);
				hexagon.getChildByName('Label').getComponent(cc.Label).fontSize = 45 + 15 * (5 - this.layers);
				this.hexagons.push(hexagon);
				this.hexagonMap[column].push(hexagon);
				if (!this._hexagonWidth) {
					this._hexagonWidth = hexagon.width;
					this._hexagonHeight = Math.sqrt(Math.pow(0.5 * this._hexagonWidth, 2) - Math.pow(0.5 * 0.5 * this._hexagonWidth, 2)) * 2;
					this._distX = 0.75 * this._hexagonWidth + this.gap;
					this._distY = this._hexagonHeight + this.gap;
				}
				let x = -(this._distX * (this._totalColumns - 1)) * 0.5 + this._distX * column;
				let y = -(this._distY * (columnTotal - 1)) * 0.5 + this._distY * row;
				hexagon.zIndex = -y;
				hexagon.getComponent(Hexagon).setPosition(new cc.Vec2(x, y));
				this.initHexagon(hexagon, id, this.letters[id], column, row);
				id++;
			}
		}
	}

	chainUpdated() {
		whevent.emit(Events.CHAIN, this.hexagonChain);
	}

	initHexagon(hexagon: cc.Node, id: number, letter: string, column: number, row: number) {
		hexagon.getComponent(Hexagon).setId(id);
		hexagon.getComponent(Hexagon).setColumnAndRow(column, row);
		hexagon.getComponent(Hexagon).setContent(letter);
	}

	addToChain(hexagon: cc.Node) {
		if (!hexagon) return;
		let index = this.hexagonChain.indexOf(hexagon);

		if (index < 0) {
			if (this.hexagonChain.length === 0 || this.isAdjacent(hexagon, this.hexagonChain[this.hexagonChain.length - 1])) {
				this.hexagonChain.push(hexagon);
				hexagon.getComponent(Hexagon).activate();
			}
		} else if (index < this.hexagonChain.length - 1) {
			for (let i = index + 1; i < this.hexagonChain.length; i++) {
				this.hexagonChain[i].getComponent(Hexagon).deactivate();
			}
			this.hexagonChain.splice(index + 1);
		} else {
			return;
		}
		this.chainUpdated();
	}

	getHexagonById(id: number) {
		return this.hexagons[id];
	}

	getHexagonByCell(column: number, row: number) {
		if (this.hexagonMap[column]) {
			return this.hexagonMap[column][row];
		} else {
			return null;
		}
	}

	getHexagonByPosition(pos: cc.Vec2) {
		return this.hexagons.find(hexagon => Math.sqrt(Math.pow(hexagon.x - pos.x, 2) + Math.pow(hexagon.y - pos.y, 2)) <= this._distY * 0.5);
	}

	isAdjacent(hex1: cc.Node, hex2: cc.Node) {
		let dist = Utils.distance(hex1.getPosition(), hex2.getPosition());
		return dist <= this._distY * 1.5;
	}
}
