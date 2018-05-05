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
        this.state = {};
    }

    render() {
        return <div>
            <div>
                {this.props.posts.map((p: any) => <PostComponent key={p.id} post={p} />)}
            </div>
            <div className="row" style={{ margin: 10 }}>
                <div className="col">
                    <div style={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <button className="btn btn-primary" onClick={() => this.props.history.push("/new-post")}>New post</button>
                    </div>

                </div>
            </div>

        </div >;
    }
}

function mapStateToProps(appState: AppState) {
    return {
        posts: appState.postData.posts
    };
}

export default connect(mapStateToProps, {})(ForumComponent);

