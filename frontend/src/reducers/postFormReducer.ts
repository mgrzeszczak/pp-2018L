import Post from "../model/post";
import { ActionType } from "../actions";

export interface PostFormData {
    content: string;
    author: string;
}

export function postFormReducer(state: PostFormData = {
    content: "",
    author: ""
}, action: any): PostFormData {
    switch (action.type) {
        case ActionType.UPDATE_POST_FORM:
            return {
                ...action.payload
            };
        default:
            return state;
    }
}
