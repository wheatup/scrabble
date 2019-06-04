"use strict";
exports.__esModule = true;
var Player = /** @class */ (function () {
    function Player(ws, uuid) {
        this.ws = null;
        this.uuid = null;
        this.ws = ws;
        this.uuid = uuid;
    }
    Player.getPlayer = function (ws) {
        var uuid = ws.uuid;
        if (!uuid) {
            uuid = ++Player.UUID;
            var player = new Player(ws, uuid);
            Player.players[uuid] = player;
            return player;
        }
        else {
            return Player.players[uuid];
        }
    };
    Player.prototype.send = function (signal, data) {
        var pack = { signal: signal, data: data };
        this.ws.send(Buffer.from(JSON.stringify(pack)).toString('base64'));
    };
    Player.prototype.disconnect = function () {
        delete Player.players[this.uuid];
    };
    Player.players = {};
    Player.UUID = 0;
    return Player;
}());
exports["default"] = Player;
