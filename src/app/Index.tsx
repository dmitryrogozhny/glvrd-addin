/// <reference path="../../typings/index.d.ts" />

/* tslint:disable */
import * as React from "react";
/* tslint:enable */

import * as ReactDom from "react-dom";

import domready = require("domready");
import shims = require("es6-shim");

const ensureImport = shims; 

import App from "./App";

Office.initialize = (reason) => {
    domready(function(): void {
       ReactDom.render(<App />, document.getElementById("container"));
    });
 };
