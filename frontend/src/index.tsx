import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { HashRouter } from "react-router-dom";
import ReduxPromise from "redux-promise";
import reducers from "./reducers";
import Root from "./root";

const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);
const containerId = "root";

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <HashRouter>
      <Root />
    </HashRouter>
  </Provider>,
  document.getElementById(containerId)
);
