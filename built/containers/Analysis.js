"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var AnalyzeMoves_1 = require("../stats/AnalyzeMoves");
var Header_1 = require("../components/Header");
var AnalysisHeading_1 = require("../components/AnalysisHeading");
var AnalysisContent_1 = require("../components/AnalysisContent");
var AnalysisContext_1 = require("../contexts/AnalysisContext");
var Analysis = function () {
    //Playing with Analysis Context
    var _a = (0, react_1.useState)(null), analysisState = _a[0], setAnalysisState = _a[1];
    var _b = (0, react_1.useState)(true), p1MainPlayer = _b[0], setP1MainPlayer = _b[1];
    var data = (0, react_router_dom_1.useLocation)().state.data;
    var id = (0, react_router_dom_1.useLocation)().state.id;
    var player1 = (0, react_router_dom_1.useLocation)().state.player1;
    var player2 = (0, react_router_dom_1.useLocation)().state.player2;
    var playerMoves = [];
    var hasAnalysisBeenRun = false;
    //This happens twice, not sure why
    console.log("Analysis use location data: ", data);
    if (!hasAnalysisBeenRun) {
        hasAnalysisBeenRun = true;
        playerMoves = (0, AnalyzeMoves_1.default)(data);
    }
    var toggleStyles = {
        p1: { filter: p1MainPlayer ? "brightness(1)" : "brightness(0.4)" },
        p2: { filter: p1MainPlayer ? "brightness(0.4)" : "brightness(1)" },
    };
    return (<>
      <AnalysisContext_1.AnalysisContext.Provider value={{ analysisState: analysisState, setAnalysisState: setAnalysisState }}>
        <Header_1.default state={{ data: data, id: id, player1: player1, player2: player2 }}/>
        <div className="analysis">
          <AnalysisHeading_1.default id={id} toggleStyles={toggleStyles} p1MainPlayer={p1MainPlayer} setP1MainPlayer={setP1MainPlayer} player1={player1} player2={player2}/>
          <AnalysisContent_1.default playerMoves={playerMoves} p1MainPlayer={p1MainPlayer} toggleStyles={toggleStyles} player1={player1} player2={player2}/>
        </div>
      </AnalysisContext_1.AnalysisContext.Provider>
    </>);
};
exports.default = Analysis;
