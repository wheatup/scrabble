/**
 * Configuration loader.
 * @author wheatup
 */
import Events from "../Misc/Events";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Config extends cc.Component {
	static frequency: any = null;
	static scoreMap: any = null;
	static server: any = null;

	loadConfig() {
		return new Promise((resolve, reject) => {
			cc.loader.loadRes('config.json', (err, data: cc.JsonAsset) => {
				if (err) {
					reject(err);
				} else {
					resolve(data.json);
				}
			});
		});
	}

	async start() {
		whevent.emit(Events.LOAD_CONFIG);
		let config: any = await this.loadConfig();
		Config.frequency = config.frequency;
		Config.scoreMap = config.scoreMap;
		Config.server = config.server;
		whevent.emit(Events.LOADED_CONFIG, config);
	}
}
