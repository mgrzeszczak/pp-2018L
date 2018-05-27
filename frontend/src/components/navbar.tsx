
import React, { Component } from "react";
import { withRouter } from "react-router";
import { bindActionCreators } from "redux";
import Post from "../model/post";

class NavbarComponent extends Component<any, {}> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    let btnStyle = {
      margin: 10
    };
    console.log(this.props);
    return <header>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <a className="navbar-brand" href="#">Repeating questions</a>
        <div style={{ position: "absolute", right: 10 }}>
          <button className="btn btn-primary" onClick={() => this.props.history.push("/new-post")}>New post</button>
        </div>
        {/* <div style={{ position: "absolute", right: 10 }}>
          <button className="btn btn-success" style={btnStyle}>Import thread</button>
          <button className="btn btn-danger" style={btnStyle}>Export thread</button>
        </div> */}
      </nav>
    </header>;
  }
}

export default withRouter(NavbarComponent);
