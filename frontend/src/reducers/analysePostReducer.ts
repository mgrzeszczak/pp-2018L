import Post from "../model/post";
import { ActionType } from "../actions";
import { AnalysisMatch, AnalysisResult } from "../model/analysis";

export function analysePostReducer(state: AnalysisResult | null = null, action: any): AnalysisResult | null {
    switch (action.type) {
        case ActionType.ANALYSE_POST:
            return action.payload;
        case ActionType.CLEAR_ANALYSIS:
            return null;
        default:
            return state;
    }
}
