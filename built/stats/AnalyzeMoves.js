"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var masterMoves_1 = require("./masterMoves");
var analyzeMoves = function (data) {
    //----------When you lose in neutral, what moves were you hit by?
    var listOfMovesP1 = [];
    var listOfMovesP2 = [];
    var conversions = data.data.stats.conversions;
    for (var _i = 0, conversions_1 = conversions; _i < conversions_1.length; _i++) {
        var conversion = conversions_1[_i];
        //----------This means player 1 got hit----------
        if (conversion.playerIndex === 0) {
            if (conversion.openingType === "neutral-win") {
                if (masterMoves_1.default.hasOwnProperty(conversion.moves[0].moveId)) {
                    listOfMovesP1.push(masterMoves_1.default[conversion.moves[0].moveId]);
                }
                else {
                    listOfMovesP1.push(conversion.moves[0].moveId);
                }
            }
        }
        //----------This means player 2 got hit----------
        if (conversion.playerIndex === 1) {
            if (conversion.openingType === "neutral-win") {
                if (masterMoves_1.default.hasOwnProperty(conversion.moves[0].moveId)) {
                    listOfMovesP2.push(masterMoves_1.default[conversion.moves[0].moveId]);
                }
                else {
                    listOfMovesP2.push(conversion.moves[0].moveId);
                }
            }
        }
    }
    return [listOfMovesP1, listOfMovesP2];
};
exports.default = analyzeMoves;
