import Post from "../model/post";
import { ActionType } from "../actions";

export interface PostData {
    posts: Post[];
}

export function postReducer(state: PostData = {
    posts: [

    ]
}, action: any): PostData {
    switch (action.type) {
        case ActionType.ADD_NEW_POST:
            return {
                posts: [...state.posts, action.payload]
            };
        default:
            return state;
    }
}
