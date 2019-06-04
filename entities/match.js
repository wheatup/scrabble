"use strict";
/**
 * Match entity
 * @author wheatup
 */
exports.__esModule = true;
var signal_1 = require("../enums/signal");
var utils_1 = require("../utils/utils");
var server_1 = require("../server");
var MIID = 0;
var Match = /** @class */ (function () {
    function Match(level) {
        this.level = 0;
        this.players = [];
        this.time = 120;
        this.letters = null;
        this.running = false;
        this.score = {};
        this.level = level;
        var counts = [39, 61];
        var ids = [];
        for (var i = 0; i < counts[level]; i++) {
            ids.push(i);
        }
        this.letters = utils_1["default"].generateLetters2(ids);
    }
    Match.getMatch = function () {
        if (Match.pendingMatches.length > 0) {
            return Match.pendingMatches.pop();
        }
        else {
            var match = new Match(1);
            Match.pendingMatches.push(match);
            return match;
        }
    };
    Match.prototype.broadcast = function (signal, data) {
        var totalPlayers = this.players.length;
        for (var i = totalPlayers - 1; i >= 0; i--) {
            var player = this.players[i];
            if (player) {
                player.send(signal, data);
            }
        }
    };
    Match.prototype.broadcastExept = function (excludedPlayer, signal, data) {
        var totalPlayers = this.players.length;
        for (var i = totalPlayers - 1; i >= 0; i--) {
            var player = this.players[i];
            if (player !== excludedPlayer) {
                player.send(signal, data);
            }
        }
    };
    Match.prototype.start = function () {
        var _this = this;
        this.running = true;
        this.broadcast(signal_1["default"].MATCH, { level: this.level, text: this.letters, time: this.time });
        setTimeout(function () {
            _this.timeup();
        }, this.time * 1000);
        this.close();
    };
    Match.prototype.stop = function () {
        var _this = this;
        this.running = false;
        this.broadcast(signal_1["default"].RESULT, { interrupted: this.players.length < 2, score: this.score });
        this.close();
        this.players.forEach(function (player) {
            _this.leave(player, true);
        });
    };
    Match.prototype.timeup = function () {
        if (this.running) {
            this.stop();
        }
    };
    Match.prototype.join = function (player) {
        if (this.players.length >= 2 || this.players.indexOf(player) >= 0) {
            return;
        }
        this.players.push(player);
        player.match = this;
        this.broadcast(signal_1["default"].JOIN, { uuid: player.uuid });
        this.score[player.uuid] = {
            score: 0
        };
        if (this.players.length >= 2) {
            this.start();
        }
    };
    Match.prototype.validate = function (player, ids) {
        var _this = this;
        var text = '';
        ids.forEach(function (id) {
            text += _this.letters[id];
        });
        if (utils_1["default"].isWord(text.toLowerCase())) {
            var letters_1 = utils_1["default"].generateLetters2(ids);
            var lettersArr_1 = this.letters.split('');
            var score = server_1["default"].$.config.scoreMap[text.length < server_1["default"].$.config.scoreMap.length ? text.length : server_1["default"].$.config.scoreMap.length - 1];
            ids.forEach(function (id, index) {
                lettersArr_1[id] = letters_1[index];
            });
            this.letters = lettersArr_1.join('');
            this.score[player.uuid].score += score;
            this.broadcast(signal_1["default"].CORRECT, { uuid: player.uuid, ids: ids, word: text, letters: letters_1, score: score });
        }
        else {
            this.broadcast(signal_1["default"].WRONG, { uuid: player.uuid, ids: ids });
        }
    };
    Match.prototype.leave = function (player, silence) {
        if (this.players.indexOf(player) < 0) {
            return;
        }
        player.match = null;
        this.players.splice(this.players.indexOf(player), 1);
        if (!silence) {
            this.broadcast(signal_1["default"].LEAVE, { uuid: player.uuid });
        }
        if (this.running) {
            this.stop();
        }
        this.close();
    };
    Match.prototype.close = function () {
        if (Match.pendingMatches.indexOf(this) >= 0) {
            Match.pendingMatches.splice(Match.pendingMatches.indexOf(this), 1);
        }
    };
    Match.pendingMatches = [];
    return Match;
}());
exports["default"] = Match;
