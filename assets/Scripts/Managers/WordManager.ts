/**
 * Manage all the valid words.
 * @author wheatup
 */
import Events from '../Misc/Events';
import Config from './Config';

const { ccclass, property } = cc._decorator;

@ccclass
export default class WordManager extends cc.Component {
	static $: WordManager = null;

	words: string[] = [];
	loaded: boolean = false;

	lettersChart: string = null;

	lettersChartVowel: string = null;
	lettersChartConsonant: string = null;

	solvedWords: string[] = [];

	onLoad() {
		WordManager.$ = this;
		cc.log('Loading word list');

		whevent.emit(Events.LOAD_RESOURCE, { name: 'words' });
		cc.loader.loadRes('words.json', (err, json: cc.JsonAsset) => {
			this.words = json.json;
			whevent.emit(Events.LOADED_RESOURCE, { name: 'words', data: json.json });
			this.loaded = true;
			cc.log(`Loaded ${this.words.length} words.`);
		});
	}

	onDestroy() {}

	isWord(word: string) {
		return this.words.indexOf(word) >= 0;
	}

	generateRandomLetters(length: number = 1) {
		let letters = '';

		if (!this.lettersChart) {
			this.lettersChart = '';
			for (let letter in Config.frequency) {
				for (let i = 0; i < Config.frequency[letter]; i++) {
					this.lettersChart += letter;
				}
			}
		}

		for (let i = 0; i < length; i++) {
			letters += this.lettersChart[Math.floor(this.lettersChart.length * Math.random())];
		}
		return letters;
	}

	generateRandomLetters2(ids: number[]) {
		let letters = '';

		if (!this.lettersChartVowel) {
			this.lettersChartVowel = '';
			for (let letter in Config.frequency) {
				for (let i = 0; i < Config.frequency[letter]; i++) {
					if ('AEIOU'.indexOf(letter) >= 0) this.lettersChartVowel += letter;
				}
			}
		}

		if (!this.lettersChartConsonant) {
			this.lettersChartConsonant = '';
			for (let letter in Config.frequency) {
				for (let i = 0; i < Config.frequency[letter]; i++) {
					if ('AEIOU'.indexOf(letter) < 0) this.lettersChartConsonant += letter;
				}
			}
		}

		let consonants = [0, 1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17, 26, 27, 28, 29, 30, 31, 32, 33, 34, 43, 44, 45, 46, 47, 48, 49, 56, 57, 58, 59, 60];

		for (let id of ids) {
			let dict =
				Math.random() < 0.9
					? consonants.indexOf(id) >= 0
						? this.lettersChartConsonant
						: this.lettersChartVowel
					: consonants.indexOf(id) >= 0
					? this.lettersChartVowel
					: this.lettersChartConsonant;
			letters += dict[Math.floor(dict.length * Math.random())];
		}
		return letters;
	}
}
