import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import ForumComponent from "./components/forum";
import NavbarComponent from "./components/navbar";
import PostFormComponent from "./components/post-form";

export default class Root extends Component<{}, {}> {

    render() {
        return <div>
            <NavbarComponent />
            <div className="container">
                <Switch>
                    <Route exact path="/" component={ForumComponent} />
                    <Route exact path="/new-post" component={PostFormComponent} />
                </Switch>
            </div>
        </div>;
    }
}

