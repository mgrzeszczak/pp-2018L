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
        console.log(this.props.location);
        const re = /#post-(\d+)/;
        let result: number | null = null;
        if (this.props.location.hash !== undefined && this.props.location.hash != null) {
            let match: any = re.exec(this.props.location.hash);
            if (match != null) {
                result = parseInt(match[1]);
            }
        }

        return <div>
            <div>
                {this.props.posts.map((p: any) => <PostComponent key={p.id} post={p} focus={p.id === result} />)}
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

