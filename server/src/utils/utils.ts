/**
 * Utils
 * @author wheatup
 */

import Server from '../server';

let lettersChart = null;
let lettersChartConsonant = null;
let lettersChartVowel = null;

export default {
	generateLetters(length: number = 1) {
		let letters = '';

		if (!lettersChart) {
			lettersChart = '';
			for (let letter in Server.$.config.frequency) {
				for (let i = 0; i < Server.$.config.frequency[letter]; i++) {
					lettersChart += letter;
				}
			}
		}

		for (let i = 0; i < length; i++) {
			letters += lettersChart[Math.floor(lettersChart.length * Math.random())];
		}
		return letters;
	},

	generateLetters2(ids: number[]) {
		let letters = '';

		if (!lettersChartVowel) {
			lettersChartVowel = '';
			for (let letter in Server.$.config.frequency) {
				for (let i = 0; i < Server.$.config.frequency[letter]; i++) {
					if ('AEIOU'.indexOf(letter) >= 0) lettersChartVowel += letter;
				}
			}
		}

		if (!lettersChartConsonant) {
			lettersChartConsonant = '';
			for (let letter in Server.$.config.frequency) {
				for (let i = 0; i < Server.$.config.frequency[letter]; i++) {
					if ('AEIOU'.indexOf(letter) < 0) lettersChartConsonant += letter;
				}
			}
		}

		let consonants = [0, 1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17, 26, 27, 28, 29, 30, 31, 32, 33, 34, 43, 44, 45, 46, 47, 48, 49, 56, 57, 58, 59, 60];

		for (let id of ids) {
			let dict =
				Math.random() < 0.9
					? consonants.indexOf(id) >= 0
						? lettersChartConsonant
						: lettersChartVowel
					: consonants.indexOf(id) >= 0
					? lettersChartVowel
					: lettersChartConsonant;
			letters += dict[Math.floor(dict.length * Math.random())];
		}
		return letters;
	},

	isWord(text: string) {
		return Server.$.words.indexOf(text) >= 0;
	}
};
