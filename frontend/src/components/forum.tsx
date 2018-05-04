import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AppState } from "../reducers";
import Post from "../model/post";
import { PostComponent, PostComponentProps } from "./post";
import { Switch, Route, Link, Redirect } from "react-router-dom";

class ForumComponent extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            posts: [
                new Post(1, "greyshack", "first post"),
                new Post(2, "greyshack", "first post"),
                new Post(3, "greyshack", "first post"),
            ]
        };
    }

    render() {
        return <div>
            <div>
                {this.props.posts.map((p: any) => <PostComponent key={p.id} post={p} />)}
            </div>
            <button className="btn btn-primary" onClick={() => this.props.history.push("/new-post")}>New post</button>
        </div>;
    }
}

function mapStateToProps(appState: AppState) {
    return {
        posts: appState.postData.posts
    };
}

export default connect(mapStateToProps, {})(ForumComponent);

