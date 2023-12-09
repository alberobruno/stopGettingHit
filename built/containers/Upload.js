"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Dropbox_1 = require("../components/Dropbox");
var List_1 = require("./List");
var Upload = function () {
    return (<>
      <h1 className="bx--type-semibold text-center mt-5" style={{ paddingTop: "50px" }}>
        Stop Getting Hit
      </h1>
      <Dropbox_1.default />
      <List_1.default />
    </>);
};
exports.default = Upload;
