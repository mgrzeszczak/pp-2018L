import { combineReducers } from "redux";
import { postReducer, PostData } from "./postReducer";
import { postFormReducer, PostFormData } from "./postFormReducer";
import { analysePostReducer } from "./analysePostReducer";
import { AnalysisResult } from "../model/analysis";

export interface AppState {
    postData: PostData;
    postFormData: PostFormData;
    analysisResult: AnalysisResult;
}

const rootReducer = combineReducers(
    {
        postData: postReducer,
        postFormData: postFormReducer,
        analysisResult: analysePostReducer
    }
);

export default rootReducer;
