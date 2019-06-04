"use strict";
/**
 * Player entity
 * @author wheatup
 */
exports.__esModule = true;
var Player = /** @class */ (function () {
    function Player(ws, uuid) {
        this.ws = null;
        this.uuid = null;
        this.match = null;
        this.ws = ws;
        this.uuid = uuid;
    }
    Player.getPlayer = function (ws) {
        //@ts-ignore
        var uuid = ws.uuid;
        if (!uuid) {
            uuid = ++Player.UUID;
            var player = new Player(ws, uuid);
            Player.players[uuid] = player;
            return player;
        }
        else {
            var player = Player.players[uuid];
            player.ws = ws;
            return Player.players[uuid];
        }
    };
    Player.prototype.send = function (signal, data) {
        var pack = { signal: signal, data: data };
        try {
            this.ws.send(Buffer.from(JSON.stringify(pack)).toString('base64'));
        }
        catch (ex) {
            // console.error(ex);
        }
    };
    Player.prototype.remove = function () {
        if (this.match) {
            this.match.leave(this);
            this.match = null;
        }
        delete Player.players[this.uuid];
    };
    Player.players = {};
    Player.UUID = 0;
    return Player;
}());
exports["default"] = Player;
