
export interface AnalysisResult {
    postSentences: string[];
    matches: AnalysisMatch[];
}

export interface AnalysisMatch {
    postId: number;
    sentence: { content: string, similarity: number, matchedSentenceNo: number };
}
