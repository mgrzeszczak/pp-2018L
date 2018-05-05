import axios, { AxiosPromise } from "axios";
import Post from "../model/post";
import { AnalysisResult, AnalysisMatch } from "../model/analysis";
const API_URL = "http://localhost:8090/api";

export enum ActionType {
    ADD_NEW_POST,
    ANALYSE_POST,
    CLEAR_ANALYSIS,
    UPDATE_POST_FORM
}

export function updatePostForm(data: { content: string, author: string }): any {
    return {
        type: ActionType.UPDATE_POST_FORM,
        payload: data
    };
}

export function addNewPost(post: Post): any {
    const promise = new Promise<Post>((resolve, reject) => {
        resolve(post);
    });
    return {
        type: ActionType.ADD_NEW_POST,
        payload: promise
    };
}

export function clearAnalysis(): any {
    return {
        type: ActionType.CLEAR_ANALYSIS,
        payload: {}
    };
}

export function putAnalysis(res: AnalysisResult): any {
    return {
        type: ActionType.ANALYSE_POST,
        payload: res
    };
}

export function analyseNewPost(post: Post, posts: Post[]): any {
    let payload = {
        newPost: post,
        posts: posts
    };
    let promise = new Promise((resolve, reject) => {
        axios.post(`${API_URL}/post/analyze`, payload)
            .then(r => {
                if (r.data.matches.length > 0) {
                    resolve(r.data);
                }
                else {
                    resolve(undefined);
                }
            })
            .catch(e => reject(e));
    });




    // const promise = new Promise<AnalysisResult>((resolve, reject) => {

    //     resolve({
    //         postSentences: ["line 1.", "line 2.", "line 3.", "question?"],
    //         matches: [
    //             {
    //                 postId: 12,
    //                 sentences: [
    //                     {
    //                         content: "This is a test sentence",
    //                         similarity: 0.6,
    //                         matchedSentenceNo: 1
    //                     }
    //                 ]
    //             },
    //             {
    //                 postId: 12,
    //                 sentences: [
    //                     {
    //                         content: "This is a test sentence",
    //                         similarity: 0.8,
    //                         matchedSentenceNo: 1
    //                     }
    //                 ]
    //             }
    //         ]
    //     });
    // });
    return {
        type: ActionType.ANALYSE_POST,
        payload: promise
    };
}
