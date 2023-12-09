"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var use_observable_1 = require("@ngneat/use-observable");
var store_1 = require("../state/store");
var Items_1 = require("../components/Items");
require("../styles.scss");
var react_2 = require("@carbon/react");
var List = function () {
    // ---------- State management ----------
    var matches = (0, use_observable_1.useObservable)(store_1.dataQuery.selectAll())[0];
    var state = (0, use_observable_1.useObservable)(store_1.dataState$)[0];
    var _a = (0, react_1.useState)(false), fetched = _a[0], setFetched = _a[1];
    // ---------- Use Effect ----------
    (0, react_1.useEffect)(function () {
        if (!fetched && (matches === null || matches === void 0 ? void 0 : matches.length) === 0) {
            setFetched(true);
            (0, store_1.fetchData)();
        }
    }, [fetched]);
    // ---------- No Data ----------
    if ((matches === null || matches === void 0 ? void 0 : matches.length) === 0 && state !== "loading") {
        return (<div className="list">
        <div id="listComponent">No data available.</div>
      </div>);
    }
    // ---------- Return Data ----------
    var sortedData = Array.isArray(matches)
        ? __spreadArray([], matches, true).sort(function (a, b) { return a.id - b.id; })
        : [];
    return (<div className="table-container-custom">
      {state === "loading" && (<react_2.InlineLoading description={"Fetching data from database..."}/>)}
      {state !== "loading" && (<react_2.TableContainer title="Matches">
          <react_2.Table>
            <react_2.TableHead>
              <react_2.TableRow>
                <react_2.TableCell>Id</react_2.TableCell>
                <react_2.TableCell>Player 1</react_2.TableCell>
                <react_2.TableCell>Player 2</react_2.TableCell>
                <react_2.TableCell></react_2.TableCell>
                <react_2.TableCell></react_2.TableCell>
              </react_2.TableRow>
            </react_2.TableHead>
            <react_2.TableBody>
              {sortedData.map(function (row, i) { return (<Items_1.default data={row} key={i}/>); })}
            </react_2.TableBody>
          </react_2.Table>
        </react_2.TableContainer>)}
    </div>);
};
exports.default = List;
