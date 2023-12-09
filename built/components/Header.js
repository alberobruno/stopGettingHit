"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Header = function () {
    return (<div className="header">
      <react_router_dom_1.Link to="/" className="link" style={{ color: "black" }}>
        <p>Back to Matches</p>
      </react_router_dom_1.Link>
    </div>);
};
exports.default = Header;
