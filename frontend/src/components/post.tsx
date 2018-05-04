import React, { Component } from "react";
import Post from "../model/post";

export interface PostComponentProps {
    post: Post;
}

interface PostComponentState {
    selected: boolean;
}

export class PostComponent extends Component<PostComponentProps, PostComponentState> {

    constructor(props: PostComponentProps) {
        super(props);
        this.state = {
            selected: false
        };
        this.updateSelected = this.updateSelected.bind(this);
    }

    updateSelected(value: boolean) {
        this.setState({
            selected: value
        });
    }

    render() {
        return <div className="row" key={this.props.post.id} style={{ marginTop: 10, marginBottom: 10 }}>
            <div className="col-md-12">
                <div
                    onMouseEnter={() => this.updateSelected(true)}
                    onMouseLeave={() => this.updateSelected(false)}
                    className={(this.state.selected ? "border-primary" : "") + " card"} id={"post-" + this.props.post.id}>
                    <div className="card-header">{`#${this.props.post.id} ${this.props.post.author} - ${new Date(this.props.post.timestamp).toLocaleString()}`}</div>
                    <div className="card-body">
                        <p className="card-text">{this.props.post.content}</p>
                    </div>
                </div>
            </div>
        </div >;
    }
}
