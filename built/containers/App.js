"use strict";
/**
 * @param {File} file
 * @param {HTMLElement} dropzoneElement
 */
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
require("./app.scss");
//----------Components----------
var Upload_1 = require("./Upload");
var Analysis_1 = require("./Analysis");
var DataContext_1 = require("../contexts/DataContext");
var data_state_1 = require("../state/data.state");
var App = function () {
    var _a = (0, react_1.useState)(null), receivedData = _a[0], setReceivedData = _a[1];
    return (<react_router_dom_1.HashRouter>
      <data_state_1.StateProvider>
        <DataContext_1.DataContext.Provider value={{ receivedData: receivedData, setReceivedData: setReceivedData }}>
          <div className="Routes">
            <react_router_dom_1.Routes>
              <react_router_dom_1.Route path="/" element={<Upload_1.default />}/>
              <react_router_dom_1.Route path="/analysis" element={<Analysis_1.default />}/>
            </react_router_dom_1.Routes>
          </div>
        </DataContext_1.DataContext.Provider>
      </data_state_1.StateProvider>
    </react_router_dom_1.HashRouter>);
};
exports.default = App;
