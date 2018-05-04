
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addNewPost, updatePostForm, analyseNewPost, clearAnalysis } from "../actions";
import { AnalysisMatch, AnalysisResult } from "../model/analysis";
import { AppState } from "../reducers";
import Post from "../model/post";

import "react-tippy/dist/tippy.css";
const Tooltip = require("react-tippy").Tooltip;
const Link: any = require("react-router-hash-link").HashLink;

class PostFormComponent extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.onAuthorChange = this.onAuthorChange.bind(this);
        this.onContentChange = this.onContentChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.state = {
            highlightedSentenceNo: null
        };
    }

    onAuthorChange(event: any) {
        this.props.updatePostForm({
            content: this.props.content,
            author: event.target.value
        });
    }

    onContentChange(event: any) {
        this.props.updatePostForm({
            content: event.target.value,
            author: this.props.author
        });
    }

    onFormSubmit() {
        const post = new Post(this.props.posts.length + 1, this.props.author, this.props.content);
        this.props.analyseNewPost(post, this.props.posts);
    }

    createPost() {
        this.props.clearAnalysis();
        const post = new Post(this.props.posts.length + 1, this.props.author, this.props.content);
        this.props.addNewPost(post);
        this.props.updatePostForm({ content: "", author: "" });
        this.props.history.push("/");
    }

    render() {
        let style = {
            "margin": 20
        };
        if (this.props.analysisResult !== null) {
            return <div style={{ margin: 10 }}>
                <div className="row">
                    <div className="col-md-12" style={{ textAlign: "center" }}>
                        <h4>Found similar posts:</h4>
                    </div>
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-8">
                        {this.props.analysisResult.matches.map((m: AnalysisMatch) =>
                            <div className="row" style={{ margin: 10 }}>
                                <div className="col-md-10">
                                    <div className="card">
                                        <div className="card-body">
                                            <div>
                                                {m.sentences.map((sentence, index) =>
                                                    <Tooltip
                                                        title={`Similarity: ${(sentence.similarity * 100).toFixed(2)}%`}
                                                        position="bottom"
                                                        trigger="mouseenter">
                                                        <span>
                                                            <span
                                                                onMouseEnter={() => this.setState({ highlightedSentenceNo: sentence.matchedSentenceNo })}
                                                                onMouseLeave={() => this.setState({ highlightedSentenceNo: null })}
                                                                style={{ textDecoration: "underline", textDecorationColor: rgb2hex(Math.floor(2.55 * 100 * sentence.similarity), 0, 0) }}>
                                                                {sentence.content}
                                                            </span>
                                                            <span> </span>
                                                        </span>
                                                    </Tooltip>

                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2" style={{ margin: "auto" }}>
                                    <Link to={`/#post-${m.postId}`}>
                                        <button className="btn btn-primary">Go to</button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-md-2">
                    </div>
                </div>

                <div className="row" style={{ margin: 20 }}>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                {this.props.analysisResult.postSentences.map((sentence: string, index: number) =>
                                    <span>
                                        <span style={{ backgroundColor: index === this.state.highlightedSentenceNo ? "#ddd" : "white" }}>
                                            {sentence}
                                        </span>
                                        <span> </span>
                                    </span>)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ margin: 20 }}>
                    <div className="col">
                        <button style={{ position: "absolute", right: 10 }} onClick={() => this.props.clearAnalysis()} className="btn btn-primary">Cancel</button>
                    </div>
                    <div className="col">
                        <button style={{ position: "absolute", left: 10 }} onClick={() => { this.createPost(); }} className="btn btn-danger">Post anyway</button>
                    </div>
                </div>
            </div>;
        } else {
            return <div style={style}>
                <form>
                    <div className="form-group">
                        <input value={this.props.author} onChange={this.onAuthorChange} type="text" className="form-control" placeholder="Username" />
                    </div>
                    <div className="form-group">
                        <textarea value={this.props.content} onChange={this.onContentChange} className="form-control" placeholder="Post content" id="exampleFormControlTextarea1" rows={3}></textarea>
                    </div>
                    <button onClick={() => this.props.history.push("/")} className="btn btn-primary">Cancel</button>
                    <button className="btn btn-primary mb-2" onClick={this.onFormSubmit}>Post</button>
                </form>
            </div >;
        }
    }
}

function rgb2hex(red: number, green: number, blue: number): string {
    let rgb = blue | (green << 8) | (red << 16);
    return "#" + (0x1000000 + rgb).toString(16).slice(1);
}

function mapStateToProps(appState: AppState) {
    return {
        posts: appState.postData.posts,
        ...appState.postFormData,
        analysisResult: appState.analysisResult
    };
}

export default connect(mapStateToProps, { addNewPost, updatePostForm, analyseNewPost, clearAnalysis })(PostFormComponent);

