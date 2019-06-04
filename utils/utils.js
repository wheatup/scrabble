"use strict";
/**
 * Utils
 * @author wheatup
 */
exports.__esModule = true;
var server_1 = require("../server");
var lettersChart = null;
var lettersChartConsonant = null;
var lettersChartVowel = null;
exports["default"] = {
    generateLetters: function (length) {
        if (length === void 0) { length = 1; }
        var letters = '';
        if (!lettersChart) {
            lettersChart = '';
            for (var letter in server_1["default"].$.config.frequency) {
                for (var i = 0; i < server_1["default"].$.config.frequency[letter]; i++) {
                    lettersChart += letter;
                }
            }
        }
        for (var i = 0; i < length; i++) {
            letters += lettersChart[Math.floor(lettersChart.length * Math.random())];
        }
        return letters;
    },
    generateLetters2: function (ids) {
        var letters = '';
        if (!lettersChartVowel) {
            lettersChartVowel = '';
            for (var letter in server_1["default"].$.config.frequency) {
                for (var i = 0; i < server_1["default"].$.config.frequency[letter]; i++) {
                    if ('AEIOU'.indexOf(letter) >= 0)
                        lettersChartVowel += letter;
                }
            }
        }
        if (!lettersChartConsonant) {
            lettersChartConsonant = '';
            for (var letter in server_1["default"].$.config.frequency) {
                for (var i = 0; i < server_1["default"].$.config.frequency[letter]; i++) {
                    if ('AEIOU'.indexOf(letter) < 0)
                        lettersChartConsonant += letter;
                }
            }
        }
        var consonants = [0, 1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17, 26, 27, 28, 29, 30, 31, 32, 33, 34, 43, 44, 45, 46, 47, 48, 49, 56, 57, 58, 59, 60];
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            var dict = Math.random() < 0.9
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
    isWord: function (text) {
        return server_1["default"].$.words.indexOf(text) >= 0;
    }
};
