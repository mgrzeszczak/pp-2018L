
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AppState } from "../reducers";
import Post from "../model/post";

export default class NavbarComponent extends Component<{ title: string }, {}> {

  constructor(props: { title: string }) {
    super(props);
    this.state = {};
  }

  render() {
    let btnStyle = {
      margin: 10
    };
    return <header>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <a className="navbar-brand" href="#">{this.props.title}</a>
        {/* <div style={{ position: "absolute", right: 10 }}>
          <button className="btn btn-success" style={btnStyle}>Import thread</button>
          <button className="btn btn-danger" style={btnStyle}>Export thread</button>
        </div> */}
      </nav>
    </header>;
  }
}
