
export interface AnalysisResult {
    postSentences: string[];
    matches: AnalysisMatch[];
}

export interface AnalysisMatch {
    postId: number;
    sentences: { content: string, similarity: number, matchedSentenceNo: number }[];
}
