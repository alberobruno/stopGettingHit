"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppState = exports.StateProvider = void 0;
var react_1 = require("react");
var StateContext = (0, react_1.createContext)();
var StateProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(null), receivedData = _b[0], setReceivedData = _b[1];
    // You can add more state management logic here
    return (<StateContext.Provider value={{ receivedData: receivedData, setReceivedData: setReceivedData }}>
      {children}
    </StateContext.Provider>);
};
exports.StateProvider = StateProvider;
var useAppState = function () { return (0, react_1.useContext)(StateContext); };
exports.useAppState = useAppState;
