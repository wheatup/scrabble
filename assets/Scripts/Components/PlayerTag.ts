/**
 * Player's tag, name, avartar and score
 * @author wheatup
 */
import Events from "../Misc/Events";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerTag extends cc.Component {
	nameLabel: cc.Label = null;
	scoreLabel: cc.Label = null;

	static me: PlayerTag = null;
	static opponent: PlayerTag = null;

	@property
	me: boolean = false;
	score: number = 0;

	onLoad () {
		whevent.on(Events.GAME_START, this.onGameStart, this)
		whevent.on(Events.CORRECT, this.onCorrect, this)
		this.nameLabel = this.node.getChildByName('Username').getComponent(cc.Label);
		this.scoreLabel = this.node.getChildByName('Score').getComponent(cc.Label);
		if(this.me){
			PlayerTag.me = this;
		}else{
			PlayerTag.opponent = this;
		}
	}

	onDestroy(){
		whevent.off(Events.GAME_START, this.onGameStart, this)
		whevent.off(Events.CORRECT, this.onCorrect, this)
	}

	onGameStart({online}){
		this.score = 0;
		if(!this.me && !online){
			this.node.active = false;
		}else{
			this.node.active = true;
		}
		this.updateScore();
	}

	onCorrect({me, score}) {
		if(me === this.me){
			this.score += score;
			this.updateScore();
		}
	}

	updateScore () {
		this.scoreLabel.string = this.score + '';
	}
}
